// PresetScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getAllRoletasSync, getPresetOptionsSync } from './database/db'; // removido unfavoriteRoletaSync
import CustomButton from './components/CustomButton';
import Header from './components/Header';

export default function PresetScreen({ navigation }) {
  const [presets, setPresets] = useState([]);

  const loadPresets = () => {
    const todasRoletas = getAllRoletasSync();
    console.log('=== PRESET SCREEN ===');
    console.log('Todas as roletas:', todasRoletas);
    
    // Apenas temas pré-definidos originais (IDs 1-6)
    const themesPreDefinidos = todasRoletas
      .filter(t => t.id >= 1 && t.id <= 6) // Apenas os 6 temas originais
      .map(t => ({
        key: 'preset-' + t.id,
        label: t.nome,
        id: t.id,
        isUserCreated: false, // Todos são pré-definidos
      }))
      .sort((a, b) => a.id - b.id); // Ordenar por ID para manter ordem original
    
    console.log('Temas pré-definidos:', themesPreDefinidos);
    console.log('=====================');
    setPresets(themesPreDefinidos);
  };

  useEffect(() => {
    loadPresets();
  }, []);

  // Recarregar presets quando a tela receber foco
  useFocusEffect(
    React.useCallback(() => {
      loadPresets();
    }, [])
  );

  const goToSort = (preset) => {
    const opcoes = getPresetOptionsSync(preset.id);
    console.log('=== PRESET SCREEN DEBUG ===');
    console.log('Preset:', preset);
    console.log('Opções obtidas:', opcoes);
    console.log('Navegando para Sort com:', {
      presetOptions: opcoes,
      presetName: preset.label,
      isPreset: true,
      presetId: preset.id
    });
    console.log('===========================');
    
    navigation.navigate('Sort', {
      presetOptions: opcoes,
      presetName: preset.label,
      isPreset: true,
      presetId: preset.id
    });
  };

  return (
    <LinearGradient colors={['#1a2456', '#2d3a6e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Pré-selecionados"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />

        {presets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum tema disponível.</Text>
          </View>
        ) : (
          <FlatList
            data={presets}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <CustomButton
                  title="Girar roleta"
                  onPress={() => goToSort(item)}
                  style={styles.button}
                />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  list: { padding: 20 },
  card: {
    backgroundColor: '#B8E6E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a6e',
    marginBottom: 12,
    textAlign: 'center', // Centralizar o título
  },
  button: {
    alignSelf: 'center', 
    width: 150,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Removidos estilos não utilizados: cardHeader, unfavoriteButton, unfavoriteText
});
