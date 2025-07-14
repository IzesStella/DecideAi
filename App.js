import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Vibration, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [choice, setChoice] = useState(null);

  const addOption = () => {
    if (input.trim()) {
      setOptions(prev => [...prev, input.trim()]);
      setInput('');
    }
  };

  const drawOption = () => {
    const index = Math.floor(Math.random() * options.length);
    setChoice(options[index]);
    Vibration.vibrate();
    Haptics.selectionAsync();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite uma opção"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={addOption}
      />
      <Button title="Adicionar" onPress={addOption} />
      <FlatList
        data={options}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
      <Button title="Sortear" onPress={drawOption} disabled={options.length === 0} />
      {choice && <Text style={styles.choice}>➤ {choice}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  item: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  choice: { marginTop: 20, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
