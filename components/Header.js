import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrowIcon from './icons/BackArrowIcon';

const Header = ({ 
  title,
  showBackButton = false, 
  onBackPress
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.iconButtonNoBg}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <BackArrowIcon width={24} height={24} fill="#B8E6E6" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerSection}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      
      <View style={styles.rightSection}>
        {/* Espaço reservado para futuras funcionalidades */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButtonNoBg: {
    padding: 8,
    borderRadius: 20,
  },
});

export default Header;
