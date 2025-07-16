import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SortScreen({ navigation }) {
  const [options, setOptions]           = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput]               = useState('');
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

  const goToWheel = () => {
    if (options.length) navigation.navigate('Wheel', { options });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de opções</Text>

      <FlatList
        data={options}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma opção.</Text>}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      <Button
        title="ADICIONAR ESSAS OPÇÕES NA ROLETA"
        onPress={goToWheel}
        disabled={options.length === 0}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text>Escreva sua opção:</Text>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Digite aqui..."
            />
            <Button title="Adicionar" onPress={addOption} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, padding: 20, backgroundColor: '#fff' },
  title:      { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  list:       { marginBottom: 20 },
  item:       { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  empty:      { textAlign: 'center', color: '#888' },
  addBtn:     {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  addText:    { color: '#fff', fontSize: 24 },
  modalBg:    { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal:      { margin: 20, backgroundColor: '#fff', padding: 20, borderRadius: 8 },
  input:      { borderWidth: 1, borderColor: '#999', borderRadius: 5, padding: 10, marginVertical: 10 }
});
