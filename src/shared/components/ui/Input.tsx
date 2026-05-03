import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.pencilLight}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.pencil,
    marginBottom: 4,
    fontFamily: 'PatrickHand_400Regular',
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    paddingHorizontal: 12,
    paddingVertical: 4,
    // Hand-drawn effect: irregular corners
    borderTopLeftRadius: 12,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 14,
    // Wobble effect
    transform: [{ rotate: '-0.8deg' }, { skewX: '-1deg' }],
  },
  input: {
    fontSize: 18,
    color: colors.ink,
    minHeight: 44,
    fontFamily: 'PatrickHand_400Regular',
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
  },
});
