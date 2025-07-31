// components/PopupResult.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PopupResult({ visible, result, onClose }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Resultado</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultLetter}>
              {result?.charAt(0).toUpperCase() || ''}
            </Text>
          </View>
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        </View>

        {/* Close Button */}
        <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
          <LinearGradient colors={['#8B5FBF', '#6A4C93']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>OK</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  popup: {
    width: screenWidth * 0.85,
    maxWidth: 350,
    backgroundColor: '#B8E6E6',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
  },
  header: {
    backgroundColor: '#7BC8C8',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#2E3A59',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  resultContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#A8D8D8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultLetter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  resultTextContainer: {
    backgroundColor: '#A8D8D8',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
    textAlign: 'center',
  },
  button: {
    margin: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
