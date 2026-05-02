import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  loading, 
  variant = 'primary',
  disabled,
  style
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'secondary' ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        style
      ]} 
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.paper : colors.pencil} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'secondary' ? styles.secondaryText : styles.primaryText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    // Sketchy effect: irregular corners
    borderTopLeftRadius: 15,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 20,
    // Wobble effect
    transform: [{ rotate: '1.2deg' }, { skewY: '1deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 5,
  },
  primary: {
    backgroundColor: colors.pencil,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 22,
    fontFamily: 'PatrickHand_400Regular',
  },
  primaryText: {
    color: colors.paper,
  },
  secondaryText: {
    color: colors.pencil,
  },
});
