import React, { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { withRepeat, withTiming, Easing } from 'react-native-reanimated';
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
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth } = Dimensions.get('window');

export default function DecideScreen({ navigation }) {
  // Criar valor animado para rotação contínua
  const rotation = useSharedValue(0);

  // Iniciar animação quando a tela carregar
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { 
        duration: 4000, // 4 segundos para dar uma volta completa
        easing: Easing.linear // rotação constante, sem aceleração
      }),
      -1, // repetir infinitamente
      false // não reverter a direção
    );
  }, []);

  // Opções de exemplo para mostrar a roleta na tela inicial
  const exampleOptions = ['D', 'e', 'c', 'i', 'd', 'e', 'A', 'i'];
  
  return (
    <LinearGradient 
      colors={['#1a2456', '#2d3a6e']} 
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>

        {/* Roleta com animação contínua */}
        <View style={styles.wheelContainer}>
          <WheelComponent
            options={exampleOptions}
            rotation={rotation} // passar a animação para o componente
            size={screenWidth * 1.0}
          />
        </View>

        {/* Botões de ação */}
        <View style={styles.buttonsContainer}>
          <CustomButton
            title="Escreva opções para sortear"
            onPress={() => navigation.navigate('Sort')}
            style={styles.button}
          />

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
    paddingBottom: 40, 
  },
  button: {
    width: '90%',
    marginVertical: 8,
  },
});
