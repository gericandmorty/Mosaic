import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

export function PaperText({ style, children, ...props }: TextProps) {
  const colors = useThemeColors();
  
  return (
    <Text style={[styles.text, { color: colors.ink }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'PatrickHand_400Regular',
    fontSize: 18, // Default size
  },
});
