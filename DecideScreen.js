import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from './components/CustomButton';
import WheelComponent from './components/WheelComponent';

const { width: screenWidth } = Dimensions.get('window');

export default function DecideScreen({ navigation }) {
  // Opções de exemplo para mostrar a roleta na tela inicial
  const exampleOptions = ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'];
  
  return (
    <LinearGradient 
      colors={['#1a2456', '#2d3a6e']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Roleta de exemplo */}
        <View style={styles.wheelContainer}>
          <WheelComponent
            options={exampleOptions}
            rotation={{ value: 0 }} // Sem animação na tela inicial
            size={screenWidth * 0.7}
          />
        </View>

        {/* Botões de ação */}
        <View style={styles.buttonsContainer}>
          <CustomButton
            title="Escreva opções para sortear"
            onPress={() => navigation.navigate('Sort')}
            style={styles.button}
          />

          <Text style={styles.orText}>OU</Text>

          <CustomButton
            title="Escolha temas pré‑selecionados"
            onPress={() => navigation.navigate('Preset')}
            style={styles.button}
            colors={['#6A4C93', '#8B5FBF']}
          />

          <CustomButton
            title="Ver histórico de roletas"
            onPress={() => navigation.navigate('History')}
            style={styles.button}
            colors={['#FFA652', '#FF6B35']}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    width: '90%',
    marginVertical: 8,
  },
  orText: {
    color: '#FFFFFF',
    marginVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
