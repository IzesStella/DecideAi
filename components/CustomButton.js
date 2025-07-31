import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  colors = ['#8B5FBF', '#6A4C93'],
  disabled = false 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <LinearGradient
        colors={disabled ? ['#CCCCCC', '#999999'] : colors}
        style={styles.gradient}
      >
        <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: '#FFFFFF',
  },
});

export default CustomButton;
