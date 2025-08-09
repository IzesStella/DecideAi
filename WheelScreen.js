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
import { saveCustomRoletaSync, saveResultSync, favoriteRoletaSync, updatePresetSync } from './database/db';

export default function WheelScreen({ route, navigation }) {
  const { options, roletaName, isPreset = false, presetId = null, shouldFavorite = false } = route.params;
  const rotation = useSharedValue(0);

  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [roletaId, setRoletaId] = useState(null);
  const roletaIdRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    console.log('=== WHEEL SCREEN USEEFFECT ===');
    console.log('Options recebidas:', options);
    console.log('Nome da roleta:', roletaName);
    console.log('É preset?', isPreset);
    console.log('Preset ID:', presetId);
    
    if (isPreset && presetId) {
      // Para presets, usar o ID existente e atualizar nome/opções se foram modificadas
      console.log('Usando preset existente com ID:', presetId);
      setRoletaId(presetId);
      roletaIdRef.current = presetId;
      
      // Atualizar o preset no banco (nome e opções)
      updatePresetSync(presetId, roletaName, options);
      console.log('Preset atualizado com nome:', roletaName);
    } else if (options && roletaName) {
      // Para roletas customizadas, salvar no banco
      const id = saveCustomRoletaSync(roletaName || 'Minha Roleta', options);
      console.log('ID da roleta customizada retornado:', id);
      setRoletaId(id);
      roletaIdRef.current = id;
      
      // Se deve ser favoritada, favoritar após criar
      if (shouldFavorite && id) {
        const favoritou = favoriteRoletaSync(id);
        console.log('Roleta favoritada:', favoritou);
      }
    } else {
      console.log('ERRO: dados insuficientes para inicializar roleta');
    }
    console.log('ID final configurado:', roletaIdRef.current);
    console.log('==============================');
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
      console.log('=== RESULTADO DA ROLETA ===');
      console.log('Vencedor:', winner);
      console.log('RoletaId (estado):', roletaId);
      console.log('RoletaId (referência):', roletaIdRef.current);

      // Salvar resultado no banco de dados usando a referência
      const idParaSalvar = roletaIdRef.current || roletaId;
      if (idParaSalvar) {
        console.log('Salvando com ID:', idParaSalvar);
        saveResultSync(idParaSalvar, winner);
      } else {
        console.error('ERRO: nenhum ID disponível - não pode salvar resultado');
      }
      console.log('============================');

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
          title={roletaName || "Roleta da Decisão"}
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