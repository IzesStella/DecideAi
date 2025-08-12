import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native'; // adicione este import
import { getPresetsSync, getPresetOptionsSync } from './database/db';
import CustomButton from './components/CustomButton';
import Header from './components/Header';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Função para carregar favoritos
  const loadFavorites = () => {
    const presetsData = getPresetsSync();
    // IDs maiores que 4 são favoritos do usuário
    const userFavorites = presetsData
      .filter(t => t.id > 15)
      .map(t => ({
        key: 'fav-' + t.id,
        label: t.nome,
        id: t.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    setFavorites(userFavorites);
  };

  // Carregar favoritos quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Função para navegar para a roleta
  const goToSort = (favorite) => {
    const opcoes = getPresetOptionsSync(favorite.id);
    console.log('=== FAVORITES SCREEN DEBUG ===');
    console.log('Favorite:', favorite);
    console.log('Opções obtidas:', opcoes);
    console.log('Navegando para Sort com:', {
      presetOptions: opcoes,
      presetName: favorite.label,
      isPreset: true,
      presetId: favorite.id
    });
    console.log('==============================');
    
    navigation.navigate('Sort', {
      presetOptions: opcoes,
      presetName: favorite.label,
      isPreset: true,
      presetId: favorite.id
    });
  };

  return (
    <LinearGradient colors={['#1a2456', '#2d3a6e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Seus Favoritos"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não favoritou nenhuma roleta.</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
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
});