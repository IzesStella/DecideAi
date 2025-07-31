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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';
import CustomButton from './components/CustomButton';
import CustomInput from './components/CustomInput';
import OptionsList from './components/OptionsList';

const { width: screenWidth } = Dimensions.get('window');

export default function SortScreen({ navigation }) {
  const [options, setOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const STORAGE_KEY = '@opcoes_decisor';

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setOptions(JSON.parse(json));
    })();
  }, []);

  const saveOptions = async list => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addOption = () => {
    if (!input.trim()) return;
    const newList = [...options, input.trim()];
    setOptions(newList);
    saveOptions(newList);
    setInput('');
    setModalVisible(false);
  };

  const removeOption = (index) => {
    const newList = options.filter((_, i) => i !== index);
    setOptions(newList);
    saveOptions(newList);
  };

  const goToWheel = () => {
    if (options.length >= 2) {
      navigation.navigate('Wheel', { options });
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const clearOptions = () => {
    setOptions([]);
    saveOptions([]);
  };

  return (
    <LinearGradient 
      colors={['#1a2456', '#2d3a6e']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Sorteio Pré-Selecionados"
          showBackButton={true}
          showRefreshButton={true}
          onBackPress={goBack}
          onRefreshPress={clearOptions}
        />

        <View style={styles.content}>
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
});
