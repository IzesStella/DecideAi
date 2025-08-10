import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConfirmModal({ visible, title, message, onCancel, onConfirm }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#B8E6E6', '#B8E6E6']}
            style={styles.gradient}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3a6e',
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: '#2d3a6e',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  confirmButton: {
    backgroundColor: '#ff4444',
  },
  cancelText: {
    color: '#2d3a6e',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmText: {
    color: '#2d3a6e',
    fontWeight: '600',
    fontSize: 16,
  },
});