import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getAllRoletasSync, getPresetOptionsSync, unfavoriteRoletaSync } from './database/db';
import CustomButton from './components/CustomButton';
import Header from './components/Header';
import ConfirmModal from './components/ConfirmModal'; // Adicionar import do modal

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado do modal
  const [selectedFavorite, setSelectedFavorite] = useState(null); // Favorito selecionado para remoção

  // Função para carregar favoritos
  const loadFavorites = () => {
    console.log('=== CARREGANDO FAVORITOS ===');
    const todasRoletas = getAllRoletasSync();
    console.log('Todas as roletas:', todasRoletas);
    
    // Roletas favoritadas pelo usuário: preset = 1 E id > 6 (não são temas pré-definidos)
    const userFavorites = todasRoletas
      .filter(t => {
        const isFavorite = t.preset === 1 && t.id > 6;
        console.log(`Roleta ${t.id} (${t.nome}): preset=${t.preset}, id>${6}=${t.id > 6}, é favorito=${isFavorite}`);
        return isFavorite;
      })
      .map(t => ({
        key: 'fav-' + t.id,
        label: t.nome,
        id: t.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    console.log('Favoritos filtrados:', userFavorites);
    console.log('============================');
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

  // Função para iniciar remoção de favorito
  const handleUnfavorite = (favorite) => {
    setSelectedFavorite(favorite);
    setShowConfirmModal(true);
  };

  // Função para confirmar remoção
  const confirmRemoval = () => {
    if (selectedFavorite) {
      console.log('Removendo favorito:', selectedFavorite);
      const success = unfavoriteRoletaSync(selectedFavorite.id);
      if (success) {
        loadFavorites(); // Recarregar lista
      }
    }
    setShowConfirmModal(false);
    setSelectedFavorite(null);
  };

  // Função para cancelar remoção
  const cancelRemoval = () => {
    setShowConfirmModal(false);
    setSelectedFavorite(null);
  };

  return (
    <LinearGradient colors={['#1a2456', '#2d3a6e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title=" Seus Favoritos"
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
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <TouchableOpacity
                    style={styles.unfavoriteButton}
                    onPress={() => handleUnfavorite(item)}
                  >
                    <Text style={styles.unfavoriteText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CustomButton
                  title="Girar roleta"
                  onPress={() => goToSort(item)}
                  style={styles.button}
                />
              </View>
            )}
          />
        )}

        <ConfirmModal
          visible={showConfirmModal}
          title="Remover dos Favoritos"
          message={`Tem certeza que deseja remover "${selectedFavorite?.label}" dos seus favoritos?`}
          onCancel={cancelRemoval}
          onConfirm={confirmRemoval}
        />
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
    textAlign: 'center',
  },
  unfavoriteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unfavoriteText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
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