import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';

const CreateEventScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Event</Text>
        <Text style={styles.subtitle}>Coming soon - Create new rides and meetups</Text>
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

export default CreateEventScreen;
