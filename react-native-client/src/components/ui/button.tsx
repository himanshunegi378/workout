import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

export function Button({
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  children,
}: ButtonProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: '#be185d',
          },
          text: {
            color: '#ffffff',
          },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: themeColors.backgroundElement,
            borderWidth: 1,
            borderColor: scheme === 'dark' ? '#333' : '#ddd',
          },
          text: {
            color: themeColors.text,
          },
        };
      case 'ghost':
        return {
          button: {
            backgroundColor: 'transparent',
          },
          text: {
            color: themeColors.textSecondary,
          },
        };
      case 'danger':
        return {
          button: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 1.5,
            borderColor: 'rgba(239, 68, 68, 0.25)',
          },
          text: {
            color: '#ef4444',
          },
        };
      default:
        return { button: {}, text: {} };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        variantStyle.button,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#be185d'} size="small" />
      ) : typeof children === 'string' ? (
        <ThemedText
          type="smallBold"
          style={[styles.text, variantStyle.text, textStyle]}
        >
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    flexDirection: 'row',
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
});
