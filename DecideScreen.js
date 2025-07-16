import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default function DecideScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wheelContainer}>
        <Image
          source={require('./assets/wheel.png')}
          style={styles.wheel}
          resizeMode="contain"
        />
        <Image
          source={require('./assets/marker.png')}
          style={styles.marker}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Sort')}
      >
        <Text style={styles.buttonText}>Escreva opções para sortear</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OU</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {/* futuro: navegação para “Preset” */}}
      >
        <Text style={styles.buttonText}>Escolha temas pré‑selecionados</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B174B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  wheelContainer: {
    width: 300,
    height: 300,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wheel:    { position: 'absolute', width: '100%', height: '100%' },
  marker:   { width: 40, height: 40, top: -10 },
  button:   {
    backgroundColor: '#1E255E',
    borderColor: '#2DD4BF',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 10
  },
  buttonText: { color: '#EDE9FE', fontSize: 16, textAlign: 'center' },
  orText:      { color: '#EDE9FE', marginVertical: 8, fontSize: 14 }
});
