import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BackArrowIcon = ({ width = 24, height = 24, fill = "#FFFFFF" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={fill}
    />
  </Svg>
);

export default BackArrowIcon;
