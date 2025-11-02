import React from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import {colors, spacing, borderRadius} from '../theme/colors';

const ProductDetailSkeleton: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Image Skeleton */}
        <View style={styles.imageContainer}>
          <SkeletonLoader width={300} height={300} borderRadius={8} />
        </View>

        <View style={styles.contentContainer}>
          {/* Category Badge */}
          <SkeletonLoader width={120} height={28} borderRadius={20} style={styles.category} />

          {/* Title */}
          <SkeletonLoader width="100%" height={24} borderRadius={4} style={styles.titleLine} />
          <SkeletonLoader width="80%" height={24} borderRadius={4} style={styles.titleLine} />

          {/* Rating */}
          <SkeletonLoader width={200} height={20} borderRadius={4} style={styles.rating} />

          {/* Price Card */}
          <View style={styles.priceCard}>
            <SkeletonLoader width={60} height={16} borderRadius={4} style={styles.priceLabel} />
            <SkeletonLoader width={120} height={36} borderRadius={4} />
          </View>

          {/* Description */}
          <SkeletonLoader width={150} height={20} borderRadius={4} style={styles.descriptionTitle} />
          <SkeletonLoader width="100%" height={16} borderRadius={4} style={styles.descriptionLine} />
          <SkeletonLoader width="100%" height={16} borderRadius={4} style={styles.descriptionLine} />
          <SkeletonLoader width="100%" height={16} borderRadius={4} style={styles.descriptionLine} />
          <SkeletonLoader width="80%" height={16} borderRadius={4} style={styles.descriptionLine} />

          {/* Button */}
          <SkeletonLoader width="100%" height={56} borderRadius={16} style={styles.button} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  contentContainer: {
    padding: spacing.xl,
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
  priceCard: {
    backgroundColor: colors.buttonPrimaryLight,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
  },
  priceLabel: {
    marginBottom: spacing.sm,
  },
  descriptionTitle: {
    marginBottom: spacing.md,
  },
  descriptionLine: {
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default ProductDetailSkeleton;

