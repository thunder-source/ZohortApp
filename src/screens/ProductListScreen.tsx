import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Keyboard,
  ScrollView,
  ListRenderItem,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useNavigation } from '@react-navigation/native';
import type { ProductListScreenNavigationProp } from '../types/navigation.types';
import type { Product } from '../types/product.types';
import { productService } from '../services/api';
import { ProductCard, FilterChip, ProductCardSkeleton } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme/colors';

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<ProductListScreenNavigationProp>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (isRefreshing: boolean = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);
      const data = await productService.getAllProducts();

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map(product => product.category))
      ).sort();

      setAllProducts(data);
      setCategories(uniqueCategories);
      setFilteredProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
  };

  // Apply both search and category filters
  const applyFilters = useCallback((search: string, category: string) => {
    let filtered = allProducts;

    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }

    // Apply search filter
    if (search.trim() !== '') {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [allProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(() => {
      applyFilters(query, selectedCategory);
    }, 300);
  };

  const handleCategorySelect = useCallback((category: string) => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setSelectedCategory(category);
    applyFilters(searchQuery, category);
  }, [searchQuery, applyFilters]);

  const handleClearFilters = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setSearchQuery('');
    setSelectedCategory('All');
    setFilteredProducts(allProducts);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    Keyboard.dismiss();
  }, [allProducts]);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  }, [navigation]);

  const renderProduct: ListRenderItem<Product> = useCallback(({ item }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  ), [handleProductPress]);

  const renderSkeleton = () => (
    <>
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </>
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 360, // Approximate height of ProductCard
    offset: 360 * index,
    index,
  }), []);

  const renderEmptyState = () => {
    if (searchQuery.trim() !== '' || selectedCategory !== 'All') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyMessage}>
            We couldn't find any products matching your filters.
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleClearFilters}
            activeOpacity={0.8}>
            <Text style={styles.refreshButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No Products Found</Text>
        <Text style={styles.emptyMessage}>
          We couldn't find any products at the moment.
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchProducts()}
          activeOpacity={0.8}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Products</Text>
          <Text style={styles.headerSubtitle}>Loading products...</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={colors.textHint}
              editable={false}
            />
          </View>
        </View>
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Categories</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          {renderSkeleton()}
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchProducts()}
          activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <Text style={styles.headerSubtitle}>
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'item' : 'items'} available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9e9e9e"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
              activeOpacity={0.7}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Categories</Text>
          {(searchQuery.trim() !== '' || selectedCategory !== 'All') && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
              activeOpacity={0.7}>
              <Text style={styles.clearFiltersButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
          keyboardShouldPersistTaps="handled">
          <FilterChip
            label="All"
            isActive={selectedCategory === 'All'}
            onPress={() => handleCategorySelect('All')}
            count={allProducts.length}
          />
          {categories.map(category => {
            const count = allProducts.filter(p => p.category === category).length;
            return (
              <FilterChip
                key={category}
                label={category}
                isActive={selectedCategory === category}
                onPress={() => handleCategorySelect(category)}
                count={count}
              />
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews={true}
        contentContainerStyle={[
          styles.listContainer,
          filteredProducts.length === 0 && styles.listContainerEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            title="Pull to refresh"
            titleColor={colors.textSecondary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxxl,
  },
  listContainer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listContainerEmpty: {
    flexGrow: 1,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.base,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 15,
    color: colors.error,
    marginBottom: spacing.xxl,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    minWidth: 140,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.base,
    fontWeight: typography.bold,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: spacing.md,
    borderRadius: 10,
  },
  refreshButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: typography.semibold,
  },
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.md,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    lineHeight: 14,
  },
  filterSection: {
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterTitle: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearFiltersButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  clearFiltersButtonText: {
    fontSize: 12,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  filterScrollContent: {
    paddingHorizontal: spacing.lg,
  },
});

export default ProductListScreen;

