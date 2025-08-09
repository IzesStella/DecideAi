// PresetScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getPresetsSync, getPresetOptionsSync, unfavoriteRoletaSync } from './database/db';
import CustomButton from './components/CustomButton';
import Header from './components/Header';

export default function PresetScreen({ navigation }) {
  const [presets, setPresets] = useState([]);

  const loadPresets = () => {
    const presetsData = getPresetsSync();
    const formattedPresets = presetsData.map(t => ({
      key: 'preset-' + t.id,
      label: t.nome,
      id: t.id,
      isUserCreated: t.id > 4, // IDs maiores que 4 são criados pelo usuário
    }));
    
    // Ordenar: favoritos do usuário primeiro, depois pré-definidos
    const sortedPresets = formattedPresets.sort((a, b) => {
      if (a.isUserCreated && !b.isUserCreated) return -1; // a vem primeiro
      if (!a.isUserCreated && b.isUserCreated) return 1;  // b vem primeiro
      return a.label.localeCompare(b.label); // ordem alfabética dentro de cada grupo
    });
    
    setPresets(sortedPresets);
  };

  const handleUnfavorite = (presetId, presetName) => {
    Alert.alert(
      'Remover dos Favoritos',
      `Deseja remover "${presetName}" dos seus favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const success = unfavoriteRoletaSync(presetId);
            if (success) {
              loadPresets(); // Recarrega a lista
            }
          }
        }
      ]
    );
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
          title="Temas Pré-selecionados"
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
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {item.isUserCreated && '⭐ '}{item.label}
                  </Text>
                  {item.isUserCreated && (
                    <TouchableOpacity
                      onPress={() => handleUnfavorite(item.id, item.label)}
                      style={styles.unfavoriteButton}
                    >
                      <Text style={styles.unfavoriteText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <CustomButton
                  title="Sortear este tema"
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a6e',
    flex: 1,
  },
  unfavoriteButton: {
    backgroundColor: '#ff4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unfavoriteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    alignSelf: 'flex-end',
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
});
