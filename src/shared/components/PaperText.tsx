import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function PaperText({ style, children, ...props }: TextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'PatrickHand_400Regular',
    color: colors.ink,
    fontSize: 18, // Default size
  },
});
