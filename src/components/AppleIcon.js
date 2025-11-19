import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Apple logo - using official Apple logo
const AppleIcon = ({ size = 24, color = '#000000' }) => {
  return (
    <Image
      source={{
        uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
      }}
      style={[styles.logo, { width: size, height: size }]}
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

