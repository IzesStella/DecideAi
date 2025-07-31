import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import BackArrowIcon from './icons/BackArrowIcon';
import RefreshIcon from './icons/RefreshIcon';

const Header = ({ 
  title, 
  showBackButton = false, 
  showRefreshButton = false, 
  onBackPress,
  onRefreshPress 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <BackArrowIcon width={24} height={24} fill="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightSection}>
        {showRefreshButton && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onRefreshPress}
            activeOpacity={0.7}
          >
            <RefreshIcon width={24} height={24} fill="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default Header;
