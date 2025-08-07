// PresetScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from './components/CustomButton';
import Header from './components/Header';

// Placeholder: futuramente você fará fetch do seu BD
const PRESETS_PLACEHOLDER = [];

export default function PresetScreen({ navigation }) {
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    // TODO: faça fetch do seu banco e setPresets(data)
    setPresets(PRESETS_PLACEHOLDER);
  }, []);

  const goToSort = (preset) => {
    navigation.navigate('Sort', {
      presetKey: preset.key,
      presetLabel: preset.label,
      presetList: preset.list,
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
                <Text style={styles.cardTitle}>{item.label}</Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d3a6e',
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
