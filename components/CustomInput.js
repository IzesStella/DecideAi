  import React from 'react';
  import { 
    View, 
    TextInput, 
    StyleSheet, 
    Text,
    TouchableOpacity 
  } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';

  const CustomInput = ({ 
    placeholder, 
    value, 
    onChangeText, 
    style,
    multiline = false,
    numberOfLines = 1,
    buttonText,
    onButtonPress,
    showButton = false 
  }) => {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            placeholder={placeholder}
            placeholderTextColor="#7BC8C8"
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
        </View>
        
        {showButton && buttonText && (
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={onButtonPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5FBF', '#6A4C93']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    inputContainer: {
      backgroundColor: '#B8E6E6',
      borderRadius: 20,
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    input: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      fontSize: 16,
      color: '#2E3A59',
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      borderRadius: 20,
      overflow: 'hidden',
    },
    button: {
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

  export default CustomInput;
