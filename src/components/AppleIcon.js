import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Colors } from '../constants';

// Apple logo - using official Apple logo
// For dark backgrounds (black button), use white logo
const AppleIcon = ({ size = 24, color = '#FFFFFF' }) => {
  // Use white Apple logo for dark backgrounds (black button)
  // For light backgrounds, use black logo
  const isWhite = color === '#FFFFFF' || color === Colors?.white || color === 'white';
  
  return (
    <Image
      source={{
        uri: isWhite 
          ? 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' // Will be tinted white
          : 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
      }}
      style={[
        styles.logo, 
        { 
          width: size, 
          height: size,
          tintColor: isWhite ? '#FFFFFF' : undefined // Tint to white for dark backgrounds
        }
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // Image will maintain aspect ratio
  },
});

export default AppleIcon;

