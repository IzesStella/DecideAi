// HistoryScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getHistorySync } from './database/db';
import CustomButton from './components/CustomButton';
import Header from './components/Header';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    const historyData = getHistorySync();
    console.log('=== HISTORY DEBUG ===');
    console.log('History data:', historyData);
    if (historyData.length > 0) {
      console.log('Primeiro item:', historyData[0]);
      console.log('Campo preset do primeiro item:', historyData[0].preset);
      console.log('ID da roleta:', historyData[0].roleta_id);
    }
    console.log('====================');
    setHistory(historyData);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Recarregar dados quando a tela receber foco
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  return (
    <LinearGradient colors={['#1a2456', '#2d3a6e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Histórico de Roletas"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma roleta rodada ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isUserCreated = item.preset === 1 && item.roleta_id > 4;
              console.log('Renderizando item:', item.roleta_nome, 'preset:', item.preset, 'id:', item.roleta_id, 'isUserCreated:', isUserCreated);
              return (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {isUserCreated && '⭐ '}{item.roleta_nome}
                  </Text>
                  <Text style={styles.cardOption}>Opção sorteada: {item.opcao_sorteada}</Text>
                  <Text style={styles.cardDate}>
                    {new Date(item.datahora).toLocaleString('pt-BR')}
                  </Text>
                </View>
              );
            }}
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
    marginBottom: 8,
    color: '#2d3a6e',
  },
  cardOption: {
    fontSize: 15,
    color: '#2d3a6e',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    color: '#6A4C93',
    marginBottom: 4,
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
