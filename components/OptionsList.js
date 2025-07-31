import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';

const OptionsList = ({ 
  options, 
  onRemoveOption, 
  editable = false,
  style 
}) => {
  const renderItem = ({ item, index }) => (
    <View style={styles.optionItem}>
      <Text style={styles.optionText}>{item}</Text>
      {editable && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemoveOption(index)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Lista de Opções</Text>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>⚙</Text>
        </View>
      </View>
      
      <View style={styles.listContainer}>
        {options.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma opção adicionada</Text>
          </View>
        ) : (
          <FlatList
            data={options}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#B8E6E6',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    backgroundColor: '#7BC8C8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#2E3A59',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerIcon: {
    backgroundColor: '#5AA8A8',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    maxHeight: 200,
    minHeight: 100,
  },
  list: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#A8D8D8',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 3,
  },
  optionText: {
    flex: 1,
    color: '#2E3A59',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#7BC8C8',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default OptionsList;
