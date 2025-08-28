export const colors = {
  // Primary Colors
  primary: '#7C3AED', // Deep Purple
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  
  // Secondary Colors
  secondary: '#0D0D0D', // Charcoal Black
  secondaryLight: '#1C1C1E',
  secondaryDark: '#000000',
  
  // Accent Colors
  accent: '#00CFFF', // Electric Blue
  accentLight: '#39FF14', // Neon Teal
  accentDark: '#0099CC',
  
  // Background Colors
  background: '#0D0D0D',
  card: '#1C1C1E',
  surface: '#2E2E2E',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textMuted: '#9CA3AF',
  textDisabled: '#6B7280',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Border Colors
  border: '#374151',
  borderLight: '#4B5563',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.8)',
  
  // Gradient Colors
  gradientStart: '#7C3AED',
  gradientEnd: '#A78BFA',
  
  // Role Badge Colors
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  
  // Weather Colors
  rain: '#3B82F6',
  sunny: '#F59E0B',
  cloudy: '#6B7280',
};

export const gradients = {
  primary: [colors.primary, colors.primaryLight],
  secondary: [colors.secondary, colors.surface],
  accent: [colors.accent, colors.accentLight],
  card: [colors.card, colors.surface],
};

export const shadows = {
  small: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 5.84,
    elevation: 12,
  },
};
