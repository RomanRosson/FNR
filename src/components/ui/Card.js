import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, shadows } from '../../theme';

const Card = ({
  children,
  style,
  variant = 'default',
  padding = 'default',
  margin = 'default',
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[variant]];
    
    if (padding !== 'default') {
      baseStyle.push(styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`]);
    }
    
    if (margin !== 'default') {
      baseStyle.push(styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}`]);
    }
    
    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  
  // Variants
  default: {
    backgroundColor: colors.card,
  },
  elevated: {
    backgroundColor: colors.card,
    ...shadows.medium,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: spacing.sm,
  },
  paddingDefault: {
    padding: spacing.cardPadding,
  },
  paddingLarge: {
    padding: spacing.lg,
  },
  
  // Margin variants
  marginNone: {
    margin: 0,
  },
  marginSmall: {
    margin: spacing.sm,
  },
  marginDefault: {
    margin: spacing.sm,
  },
  marginLarge: {
    margin: spacing.lg,
  },
});

export default Card;
