import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';
import WheelComponent from './components/WheelComponent';
import PopupResult from './components/PopupResult';
import CustomButton from './components/CustomButton';
import Header from './components/Header';

export default function WheelScreen({ route, navigation }) {
  const { options } = route.params;
  const rotation = useSharedValue(0);

  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || !options?.length) return;

    setIsSpinning(true);
    setShowResult(false);

    // 1) Normalize antes de tudo
    rotation.value = rotation.value % 360;
    const initialRotation = rotation.value;

    // 2) Calcula quantas voltas e offset aleatório
    const spinCount   = 3 + Math.random() * 2;
    const angleOffset = Math.random() * 360;
    const spinAngle   = 360 * spinCount + angleOffset;

    // 3) Dispara a animação
    rotation.value = withTiming(
      rotation.value + spinAngle,
      { duration: 2000, easing: Easing.out(Easing.cubic) }
    );

    // 4) Após 2s, calcula qual setor está sob a seta
    setTimeout(() => {
      if (!isMounted.current) return;

      // a) Rotação final normalizada
      const finalRotation = (initialRotation + spinAngle) % 360;

      // b) Ângulo absoluto da seta: 270° (seta em top apontando pra baixo)
      const pointerAngle = 270;

      // c) Qual ângulo no espaço da roleta corresponde sob a seta?
      //    initialWheelAngle = (pointerAngle - finalRotation + 360) % 360
      const wheelAngle = (pointerAngle - finalRotation + 360) % 360;

      // d) Calcula o índice do setor
      const sectorAngle = 360 / options.length;
      const index = Math.floor(wheelAngle / sectorAngle);

      // e) Vencedor
      const winner = options[index];

      // Atualiza estado para mostrar popup
      setSelectedOption(winner);
      setShowResult(true);
      setIsSpinning(false);

      // Mantém rotation consistente
      rotation.value = finalRotation;
    }, 2000);
  }, [isSpinning, options, rotation]);

  const closeResult = useCallback(() => {
    setShowResult(false);
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const resetWheel = useCallback(() => {
    if (!isSpinning) {
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [isSpinning, rotation]);

  return (
    <LinearGradient colors={['#1a2456', '#2d3a6e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Roleta da Decisão"
          showBackButton
          showRefreshButton
          onBackPress={goBack}
          onRefreshPress={resetWheel}
        />

        <View style={styles.content}>
          <View style={styles.wheelContainer}>
            <WheelComponent options={options} rotation={rotation} />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title={isSpinning ? 'Girando...' : 'Girar Roleta'}
              onPress={spin}
              disabled={isSpinning}
              style={styles.spinButton}
            />
          </View>
        </View>

        <PopupResult
          visible={showResult}
          result={selectedOption}
          onClose={closeResult}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  wheelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    width: '100%',
  },
  spinButton: { width: '100%' },
});