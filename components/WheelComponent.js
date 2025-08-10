import React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const WheelComponent = ({ options, rotation, size = screenWidth * 1.0 }) => {
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  
  // Cores para os setores
  const colors = ['#FF6B35', '#FFA652'];
  
  // Função para criar um setor da roleta
  const createSector = (startAngle, endAngle, color, text, index) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    const x1 = centerX + radius * 0.8 * Math.cos(startAngleRad);
    const y1 = centerY + radius * 0.8 * Math.sin(startAngleRad);
    const x2 = centerX + radius * 0.8 * Math.cos(endAngleRad);
    const y2 = centerY + radius * 0.8 * Math.sin(endAngleRad);
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius * 0.8} ${radius * 0.8} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    // Posição do texto
    const textAngle = (startAngle + endAngle) / 2;
    const textAngleRad = (textAngle * Math.PI) / 180;
    const textX = centerX + radius * 0.6 * Math.cos(textAngleRad);
    const textY = centerY + radius * 0.6 * Math.sin(textAngleRad);
    
    return (
      <React.Fragment key={index}>
        <Path
          d={pathData}
          fill={color}
          stroke="#FFF"
          strokeWidth="2"
        />
      </React.Fragment>
    );
  };
  
  // Função para criar textos dos setores
  const createTexts = () => {
    const anglePerOption = 360 / options.length;
    
    return options.map((option, index) => {
      const angle = index * anglePerOption + anglePerOption / 2;
      const angleRad = (angle * Math.PI) / 180;
      const textX = centerX + radius * 0.5 * Math.cos(angleRad);
      const textY = centerY + radius * 0.5 * Math.sin(angleRad);
      
      return (
        <View
          key={`text-${index}`}
          style={{
            position: 'absolute',
            left: textX - 50, // aumentado de 40 para 50
            top: textY - 20, // aumentado de 15 para 20
            width: 100, // aumentado de 80 para 100
            height: 40, // adicionada altura fixa
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: `${angle}deg` }]
          }}
        >
          <Text
            style={{
              color: '#FFF',
              fontSize: 14, // reduzido de 16 para 14
              fontWeight: 'bold',
              textAlign: 'center',
              textShadowColor: 'rgba(0,0,0,0.7)', // sombra mais forte
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3, // sombra maior
              width: '100%',
              paddingHorizontal: 6, // aumentado padding
              lineHeight: 16, // altura da linha
            }}
            numberOfLines={2} // permitir 2 linhas
            adjustsFontSizeToFit
            minimumFontScale={0.5} // pode reduzir mais se necessário
            ellipsizeMode="tail" // adicionar ... se não couber
          >
            {option}
          </Text>
        </View>
      );
    });
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));
  
  const anglePerOption = 360 / options.length;
  
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* Indicador (seta ciano) */}
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: radius - 15,
          zIndex: 10,
          width: 30,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Svg width="30" height="30" viewBox="0 0 30 30">
          <Polygon
            points="15,25 5,5 25,5"
            fill="#00BCD4"
            stroke="#FFF"
            strokeWidth="2"
          />
        </Svg>
      </View>
      
      {/* Roleta */}
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Svg width={size} height={size}>
          {/* Setores da roleta */}
          {options.map((option, index) => {
            const startAngle = index * anglePerOption;
            const endAngle = (index + 1) * anglePerOption;
            const color = colors[index % colors.length];
            
            return createSector(startAngle, endAngle, color, option, index);
          })}
          
          {/* Círculo central */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.25}
            fill="#2E3A59"
            stroke="#00BCD4"
            strokeWidth="4"
          />
        </Svg>
        
        {/* Textos dos setores */}
        {createTexts()}
        
        {/* Logo central */}
        <Image
          source={require('../assets/wheel-center.png')}
          style={{
            width: 110, 
            height: 110, 
            position: 'absolute',
            top: centerY - 55, 
            left: centerX - 55, 
          }}
        />
      </Animated.View>
    </View>
  );
};

export default WheelComponent;
