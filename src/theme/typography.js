import { colors } from './colors';

export const typography = {
  // Display Text
  displayLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0,
  },
  
  // Headings
  headingLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0,
  },
  headingMedium: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0,
  },
  headingSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textMuted,
    lineHeight: 16,
  },
  
  // Button Text
  buttonLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  buttonMedium: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.25,
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.25,
  },
  
  // Caption Text
  caption: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  
  // Overline Text
  overline: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
};
