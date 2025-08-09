import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentSessionOptionsSync, clearCurrentSessionSync, saveSessionOptionSync, removeSessionOptionSync, favoriteRoletaSync, unfavoriteRoletaSync, updatePresetOptionsSync } from './database/db';
import Header from './components/Header';
import CustomButton from './components/CustomButton';
import CustomInput from './components/CustomInput';
import OptionsList from './components/OptionsList';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth } = Dimensions.get('window');

export default function SortScreen({ navigation, route }) {
  const [options, setOptions] = useState([]);
  const [roletaName, setRoletaName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Dados do preset se vier da tela de pré-selecionados
  const { presetOptions = null, presetName = null, isPreset = false, presetId = null } = route?.params || {};
  
  console.log('=== SORTSCREEN DEBUG ===');
  console.log('Route params:', route?.params);
  console.log('presetOptions:', presetOptions);
  console.log('presetName:', presetName);
  console.log('isPreset:', isPreset);
  console.log('presetId:', presetId);
  console.log('========================');

  useEffect(() => {
    // Se vier com dados de preset, carregar eles
    if (presetOptions && presetName) {
      console.log('Carregando preset:', presetName, presetOptions);
      setOptions(presetOptions);
      setRoletaName(presetName);
      setIsFavorite(true); // Presets já são favoritos
    } else {
      // Carregar opções da sessão atual do banco de dados
      const sessionOptions = getCurrentSessionOptionsSync();
      if (sessionOptions && sessionOptions.length > 0) {
        setOptions(sessionOptions);
      }
    }
  }, [presetOptions, presetName]);

  // Limpar opções quando voltar da tela da roleta
  useFocusEffect(
    React.useCallback(() => {
      // Não limpar se estivermos editando um preset
      if (isPreset) {
        console.log('Não limpando dados pois é preset');
        return;
      }
      
      // Verificar se deve limpar as opções (quando volta da roleta)
      const sessionOptions = getCurrentSessionOptionsSync();
      if (sessionOptions.length === 0) {
        console.log('Limpando dados da sessão');
        setOptions([]);
        setRoletaName('');
      }
    }, [isPreset])
  );

  const saveOptions = () => {
    // Não precisa salvar individualmente, será salvo quando for para a roleta
  };

  const addOption = () => {
    if (!input.trim()) return;
    const newOption = input.trim();
    const newList = [...options, newOption];
    setOptions(newList);
    saveSessionOptionSync(newOption);
    setInput('');
    setModalVisible(false);
  };

  const removeOption = (index) => {
    const optionToRemove = options[index];
    const newList = options.filter((_, i) => i !== index);
    setOptions(newList);
    removeSessionOptionSync(optionToRemove);
  };

  const goToWheel = () => {
    if (options.length >= 2) {
      navigation.navigate('Wheel', { 
        options,
        roletaName: roletaName.trim() || 'Minha Roleta',
        shouldFavorite: isFavorite,
        isPreset: isPreset,
        presetId: presetId
      });
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleFavoriteToggle = () => {
    if (isPreset && presetId) {
      // Se está editando um preset, desfavoritar diretamente
      if (isFavorite) {
        unfavoriteRoletaSync(presetId);
        console.log('Preset desfavoritado:', presetId);
        navigation.goBack(); // Volta para PresetScreen
      } else {
        // Não deveria acontecer, presets já são favoritos
        setIsFavorite(true);
      }
    } else {
      // Para roletas novas, apenas toggle do estado
      setIsFavorite(!isFavorite);
    }
  };

  const clearOptions = () => {
    setOptions([]);
    setRoletaName('');
    setIsFavorite(false);
    clearCurrentSessionSync();
  };

  return (
    <LinearGradient 
      colors={['#1a2456', '#2d3a6e']} 
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <Header
          showBackButton={true}
          showRefreshButton={true}
          onBackPress={goBack}
          onRefreshPress={clearOptions}
        />

        <View style={styles.content}>
          {/* Input para nome da roleta */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Nome da sua roleta:</Text>
            <CustomInput
              placeholder="Ex: Onde vamos jantar?"
              value={roletaName}
              onChangeText={setRoletaName}
              style={styles.input}
            />
          </View>

          {/* Input para escrever opções */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Escrever suas opções:</Text>
            <CustomInput
              placeholder="Escrever opção..."
              value={input}
              onChangeText={setInput}
              showButton={true}
              buttonText="ADICIONAR"
              onButtonPress={addOption}
              style={styles.input}
            />
          </View>

          {/* Lista de opções */}
          <View style={styles.listSection}>
            <OptionsList
              options={options}
              onRemoveOption={removeOption}
              editable={true}
              style={styles.optionsList}
            />
          </View>

          {/* Botão para favoritar */}
          {!(isPreset && presetId <= 4) && (
            <View style={styles.favoriteSection}>
              <CustomButton
                title={isFavorite ? "⭐ Remover dos favoritos" : "⭐ Adicionar aos favoritos"}
                onPress={handleFavoriteToggle}
                style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
                textStyle={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextActive]}
                disabled={options.length < 2 || !roletaName.trim()}
              />
            </View>
          )}

          {/* Botão para ir à roleta */}
          <View style={styles.buttonSection}>
            <CustomButton
              title="Adicionar opções na roleta"
              onPress={goToWheel}
              disabled={options.length < 2}
              style={styles.wheelButton}
            />
            
            <Text style={styles.minOptionsText}>
              Mínimo 2 opções para sortear
            </Text>
          </View>
        </View>

        {/* Modal para entrada de texto (backup) */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Escreva sua opção:</Text>
              <CustomInput
                placeholder="Digite aqui..."
                value={input}
                onChangeText={setInput}
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <CustomButton
                  title="Adicionar"
                  onPress={addOption}
                  style={styles.modalButton}
                />
                <CustomButton
                  title="Cancelar"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                  colors={['#999999', '#666666']}
                />
              </View>
            </View>
          </View>
        </Modal>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  listSection: {
    flex: 1,
    marginBottom: 20,
  },
  optionsList: {
    flex: 1,
  },
  buttonSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  wheelButton: {
    width: '100%',
    marginBottom: 10,
  },
  minOptionsText: {
    color: '#B8E6E6',
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Modal styles
  modalBg: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modal: {
    margin: 20,
    backgroundColor: '#B8E6E6',
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E3A59',
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 0.4,
  },
  favoriteSection: {
    marginBottom: 15,
  },
  favoriteButton: {
    backgroundColor: '#6A4C93',
    minHeight: 45,
  },
  favoriteButtonActive: {
    backgroundColor: '#FF6B35',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  favoriteButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
