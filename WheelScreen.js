// WheelScreen.js
import React from 'react';
import { SafeAreaView, Button, StyleSheet, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';

export default function WheelScreen({ route }) {
  const { options } = route.params;
  const rotation = useSharedValue(0);

  const spin = () => {
    rotation.value = withTiming(
      360 * 5 + Math.random() * 360,
      { duration: 3000, easing: Easing.out(Easing.quad) }
    );
    setTimeout(() => {
      const idx = Math.floor(Math.random() * options.length);
      Alert.alert('Resultado', options[idx]);
    }, 3000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={require('./assets/wheel.png')}
        style={[styles.wheel, animatedStyle]}
        resizeMode="contain"
      />
      <Button title="Girar a roleta" onPress={spin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  wheel:     { width: 300, height: 300 }
});
