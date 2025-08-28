import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  children,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    } else {
      baseStyle.push(styles[variant]);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    } else {
      baseTextStyle.push(styles[`${variant}Text`]);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? colors.textPrimary : colors.primary} 
          size="small" 
        />
      ) : (
        <>
          {children}
          {title && (
            <Text style={[getTextStyle(), textStyle]}>
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.borderRadius.md,
    ...shadows.small,
  },
  
  // Size variants
  small: {
    paddingHorizontal: spacing.buttonPadding,
    paddingVertical: spacing.xs,
    minHeight: spacing.button.sm,
  },
  medium: {
    paddingHorizontal: spacing.buttonPadding,
    paddingVertical: spacing.sm,
    minHeight: spacing.button.md,
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: spacing.button.lg,
  },
  
  // Variant styles
  primary: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  danger: {
    backgroundColor: colors.error,
    borderWidth: 0,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    ...typography.buttonSmall,
  },
  mediumText: {
    ...typography.buttonMedium,
  },
  largeText: {
    ...typography.buttonLarge,
  },
  
  // Variant text colors
  primaryText: {
    color: colors.textPrimary,
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.textSecondary,
  },
  ghostText: {
    color: colors.textSecondary,
  },
  dangerText: {
    color: colors.textPrimary,
  },
  
  // States
  disabled: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    opacity: 0.6,
  },
  disabledText: {
    color: colors.textDisabled,
  },
  
  // Layout
  fullWidth: {
    width: '100%',
  },
});

export default Button;
