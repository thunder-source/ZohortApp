import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import {colors, spacing, borderRadius} from '../theme/colors';

const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Image Skeleton */}
      <View style={styles.imageContainer}>
        <SkeletonLoader width={180} height={180} borderRadius={8} />
      </View>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        {/* Category Badge */}
        <SkeletonLoader width={100} height={24} borderRadius={20} style={styles.category} />

        {/* Title */}
        <SkeletonLoader width="100%" height={20} borderRadius={4} style={styles.titleLine} />
        <SkeletonLoader width="70%" height={20} borderRadius={4} style={styles.titleLine} />

        {/* Rating */}
        <SkeletonLoader width={150} height={16} borderRadius={4} style={styles.rating} />

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <SkeletonLoader width={80} height={28} borderRadius={4} />
          <SkeletonLoader width={100} height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

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
  infoContainer: {
    padding: spacing.lg,
  },
  category: {
    marginBottom: spacing.md,
  },
  titleLine: {
    marginBottom: spacing.sm,
  },
  rating: {
    marginBottom: spacing.lg,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProductCardSkeleton;

