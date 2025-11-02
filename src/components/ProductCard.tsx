import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import type {Product} from '../types/product.types';
import {formatPrice} from '../utils/formatters';
import AnimatedImage from './AnimatedImage';
import {colors, spacing, typography, borderRadius} from '../theme/colors';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({product, onPress}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={`full-${i}`} style={styles.starIcon}>
          ★
        </Text>,
      );
    }

    if (hasHalfStar && stars.length < 5) {
      stars.push(
        <Text key="half" style={styles.starIcon}>
          ★
        </Text>,
      );
    }

    while (stars.length < 5) {
      stars.push(
        <Text key={`empty-${stars.length}`} style={styles.starIconEmpty}>
          ★
        </Text>,
      );
    }

    return stars;
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    onPress(product);
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

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <View style={styles.imageContainer}>
          <AnimatedImage
            source={{uri: product.image}}
            style={styles.productImage}
            resizeMode="contain"
            skeletonWidth="100%"
            skeletonHeight={220}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} numberOfLines={1}>
              {product.category}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars(product.rating.rate)}</View>
            <Text style={styles.ratingText}>
              {product.rating.rate.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>({product.rating.count})</Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <TouchableOpacity
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              activeOpacity={1}>
              <Animated.View
                style={[
                  styles.shopNowButton,
                  {
                    transform: [{scale: buttonScaleAnim}],
                  },
                ]}>
                <Text style={styles.shopNowText}>View Details</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: spacing.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  categoryText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  starIcon: {
    fontSize: 14,
    color: colors.ratingActive,
    marginRight: 1,
  },
  starIconEmpty: {
    fontSize: 14,
    color: colors.ratingInactive,
    marginRight: 1,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.secondary,
  },
  shopNowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  shopNowText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
});

export default ProductCard;

