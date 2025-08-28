import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';

const RiderDetailScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rider Profile</Text>
        <Text style={styles.subtitle}>Coming soon - View rider details and bikes</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    ...typography.headingLarge,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default RiderDetailScreen;
