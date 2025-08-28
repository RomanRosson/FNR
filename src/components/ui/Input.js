import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (isFocused) {
      baseStyle.push(styles.focused);
    }
    
    if (error) {
      baseStyle.push(styles.error);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    if (multiline) {
      baseStyle.push(styles.multiline);
    }
    
    return baseStyle;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, error && styles.errorText]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            <Ionicons name={leftIcon} size={20} color={colors.textMuted} />
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
          >
            <Ionicons name={rightIcon} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  
  label: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  
  input: {
    flex: 1,
    height: spacing.input.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.inputPadding,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
  },
  
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  
  error: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  
  disabled: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  
  multiline: {
    height: 'auto',
    minHeight: spacing.input.md,
    textAlignVertical: 'top',
  },
  
  leftIcon: {
    position: 'absolute',
    left: spacing.sm,
    zIndex: 1,
  },
  
  rightIcon: {
    position: 'absolute',
    right: spacing.sm,
    zIndex: 1,
  },
  
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default Input;
