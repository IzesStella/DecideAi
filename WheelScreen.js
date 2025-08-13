import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import WheelComponent from './components/WheelComponent';
import PopupResult from './components/PopupResult';
import CustomButton from './components/CustomButton';
import Header from './components/Header';
import { saveCustomRoletaSync, saveResultSync, favoriteRoletaSync, updatePresetSync } from './database/db';
import { StatusBar } from 'expo-status-bar';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function WheelScreen({ route, navigation }) {
  const { options, roletaName, isPreset = false, presetId = null, shouldFavorite = false } = route.params;
  const rotation = useSharedValue(0);

  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [roletaId, setRoletaId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sound, setSound] = useState();
  const roletaIdRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    console.log('=== WHEEL SCREEN USEEFFECT ===');
    console.log('Options recebidas:', options);
    console.log('Nome da roleta:', roletaName);
    console.log('É preset?', isPreset);
    console.log('Preset ID:', presetId);
    
    const createRoleta = async () => {
      try {
        let currentRoletaId;
        
        if (isPreset && presetId) {
          // Se é um preset existente, usar o ID dele
          currentRoletaId = presetId;
          console.log('Usando preset existente:', currentRoletaId);
        } else {
          // Criar nova roleta personalizada
          const name = roletaName || 'Minha Roleta';
          currentRoletaId = saveCustomRoletaSync(name, options);
          console.log('Nova roleta criada:', currentRoletaId);
          
          // Se deve favoritar, marcar como preset
          if (shouldFavorite && currentRoletaId) {
            const favoriteSuccess = favoriteRoletaSync(currentRoletaId);
            console.log('Roleta favoritada:', favoriteSuccess);
          }
        }
        
        setRoletaId(currentRoletaId);
        roletaIdRef.current = currentRoletaId;
        console.log('RoletaId definido:', currentRoletaId);
      } catch (error) {
        console.error('Erro ao criar/configurar roleta:', error);
      }
    };

    createRoleta();
    return () => { isMounted.current = false; };
  }, [options, roletaName, isPreset, presetId, shouldFavorite]);

  // Função para tocar o som
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/celebration.mp3') // seu arquivo de áudio
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Erro ao reproduzir som:', error);
    }
  };

  // Limpar o som ao sair da tela
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

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
      setShowConfetti(true); // Ativa os confetes

      // Vibração + Som + Confetes
      Vibration.vibrate(500); // 500ms
      playSound(); // Toca o som

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
    <View style={[styles.container, { backgroundColor: '#1a2456' }]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <Header
          title={roletaName || "Roleta da Decisão"}
          showBackButton
          onBackPress={goBack}
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

        {/* Confetes */}
        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{x: -10, y: 0}}
            fadeOut={true}
            explosionSpeed={350}
            fallSpeed={3000}
            onAnimationEnd={() => setShowConfetti(false)}
          />
        )}

        {/* PopupResult */}
        <PopupResult
          visible={showResult}
          result={selectedOption}
          onClose={() => {
            setShowResult(false);
            setShowConfetti(false); // Para os confetes ao fechar
          }}
        />
      </SafeAreaView>
    </View>
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