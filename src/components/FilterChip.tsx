import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {colors, spacing, typography, borderRadius} from '../theme/colors';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  count?: number;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive,
  onPress,
  count,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.chip,
          isActive ? styles.chipActive : styles.chipInactive,
          {transform: [{scale: scaleAnim}]},
        ]}>
        <Text
          style={[
            styles.chipText,
            isActive ? styles.chipTextActive : styles.chipTextInactive,
          ]}>
          {label}
        </Text>
        {count !== undefined && (
          <Text
            style={[
              styles.countBadge,
              isActive ? styles.countBadgeActive : styles.countBadgeInactive,
            ]}>
            {count}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  chipInactive: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: typography.semibold,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: colors.white,
  },
  chipTextInactive: {
    color: colors.textPrimary,
  },
  countBadge: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: typography.bold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: colors.white,
  },
  countBadgeInactive: {
    backgroundColor: '#f5f5f5',
    color: colors.textSecondary,
  },
});

export default FilterChip;

