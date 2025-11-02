import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {
  ProductDetailScreenRouteProp,
  ProductDetailScreenNavigationProp,
} from '../types/navigation.types';
import type {Product} from '../types/product.types';
import {fetchProductById} from '../services/api';
import {AnimatedImage, ProductDetailSkeleton} from '../components';
import {colors, spacing, typography, borderRadius} from '../theme/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Helper function to render star ratings
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('★');
    } else if (i === fullStars && hasHalfStar) {
      stars.push('⯨');
    } else {
      stars.push('☆');
    }
  }
  
  return stars.join(' ');
};

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const {productId} = route.params;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false);
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Configure header with back button
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Product Details',
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#007AFF',
      headerTitleStyle: {
        fontWeight: '600',
      },
    });
  }, [navigation]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(productId);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleAddToCart = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    // Placeholder for add to cart functionality
    console.log('Add to cart:', product?.id);
  };

  const handleImagePress = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setImageModalVisible(true);
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>
            {error || 'Product not found'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadProduct}
            activeOpacity={0.8}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Zoomable Image */}
        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={0.9}
          onPress={handleImagePress}>
          <AnimatedImage
            source={{uri: product.image}} 
            style={styles.productImage}
            resizeMode="contain"
            skeletonWidth={300}
            skeletonHeight={300}
          />
          <View style={styles.zoomHint}>
            <Text style={styles.zoomHintText}>🔍 Tap to zoom</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          {/* Category Badge */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          {/* Product Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Rating and Price Row */}
          <View style={styles.ratingPriceContainer}>
            <View style={styles.ratingContainer}>
              <Text style={styles.starsText}>{renderStars(product.rating.rate)}</Text>
              <Text style={styles.ratingText}>
                {product.rating.rate.toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({product.rating.count} reviews)
              </Text>
            </View>
          </View>

          {/* Price with Card */}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About this product</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            onPress={handleAddToCart}
            activeOpacity={1}>
            <Animated.View
              style={[
                styles.addToCartButton,
                {
                  transform: [{scale: buttonScaleAnim}],
                },
              ]}>
              <Text style={styles.addToCartButtonText}>🛒 Add to Cart</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Zoom Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}>
            <View style={styles.modalContent}>
              <AnimatedImage
                source={{uri: product.image}}
                style={styles.modalImage}
                resizeMode="contain"
                skeletonWidth={SCREEN_WIDTH * 0.9}
                skeletonHeight={SCREEN_WIDTH * 0.9}
              />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
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
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    minWidth: 140,
    ...Platform.select({
      ios: {
        shadowColor: colors.buttonPrimary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.base,
    fontWeight: typography.bold,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  zoomHint: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.overlayMedium,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.xl,
  },
  zoomHintText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: typography.medium,
  },
  contentContainer: {
    padding: spacing.xl,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.xl,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  categoryText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  ratingPriceContainer: {
    marginBottom: spacing.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  starsText: {
    fontSize: 20,
    color: colors.ratingActive,
    letterSpacing: 2,
  },
  ratingText: {
    fontSize: 17,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  priceCard: {
    backgroundColor: colors.buttonPrimaryLight,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
    ...Platform.select({
      ios: {
        shadowColor: colors.buttonPrimary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: typography.semibold,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  price: {
    fontSize: typography.xxxl,
    fontWeight: typography.black,
    color: colors.buttonPrimary,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.xxl,
  },
  descriptionContainer: {
    marginBottom: 28,
  },
  descriptionTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  descriptionText: {
    fontSize: typography.base,
    color: '#4a4a4a',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  addToCartButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 18,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.buttonPrimary,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
    marginBottom: spacing.sm,
  },
  addToCartButtonText: {
    color: colors.white,
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    letterSpacing: 0.5,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: spacing.xl,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: typography.light,
  },
});

export default ProductDetailScreen;

