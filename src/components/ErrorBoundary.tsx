import React, {Component, ReactNode} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../theme/colors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  errorDetails: {
    backgroundColor: colors.overlayLight,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xxl,
    maxWidth: '100%',
  },
  errorText: {
    fontSize: typography.sm,
    color: colors.error,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: 140,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.base,
    fontWeight: typography.bold,
    textAlign: 'center',
  },
});

export default ErrorBoundary;

