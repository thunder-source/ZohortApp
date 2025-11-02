import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  Animated,
  ImageProps,
  ImageURISource,
  StyleSheet,
  View,
} from 'react-native';
import SkeletonLoader from './SkeletonLoader';

interface AnimatedImageProps extends Omit<ImageProps, 'source'> {
  source: ImageURISource;
  skeletonWidth?: number | string;
  skeletonHeight?: number;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  source,
  style,
  skeletonWidth = '100%',
  skeletonHeight = 200,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  useEffect(() => {
    // Reset states when source changes
    setLoading(true);
    setError(false);
    fadeAnim.setValue(0);
  }, [source.uri, fadeAnim]);

  const imageStyle = Array.isArray(style) ? style : [style];

  return (
    <View style={[styles.container, ...imageStyle]}>
      {loading && (
        <View style={styles.skeleton}>
          <SkeletonLoader
            width={skeletonWidth}
            height={skeletonHeight}
            borderRadius={0}
          />
        </View>
      )}
      {!error && (
        <Animated.Image
          {...props}
          source={source}
          style={[
            ...imageStyle,
            styles.image,
            {
              opacity: fadeAnim,
            },
          ]}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  skeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AnimatedImage;

