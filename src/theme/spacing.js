export const spacing = {
  // Base spacing units
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  
  // Component-specific spacing
  screenPadding: 16,
  cardPadding: 16,
  buttonPadding: 12,
  inputPadding: 12,
  
  // Margins
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Padding
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Gaps
  gap: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Border radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  // Icon sizes
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 96,
  },
  
  // Button heights
  button: {
    sm: 32,
    md: 44,
    lg: 52,
  },
  
  // Input heights
  input: {
    sm: 36,
    md: 44,
    lg: 52,
  },
};

export const layout = {
  // Screen dimensions
  screen: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.screenPadding,
  },
  
  // Card layout
  card: {
    padding: spacing.cardPadding,
    marginHorizontal: spacing.screenPadding,
    marginVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md,
  },
  
  // List item layout
  listItem: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    marginVertical: spacing.xs,
  },
  
  // Section layout
  section: {
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  
  // Header layout
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  
  // Bottom sheet layout
  bottomSheet: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
};
