import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Google "G" logo - using official Google logo
const GoogleIcon = ({ size = 24 }) => {
  return (
    <Image
      source={{
        uri: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'
      }}
      style={[styles.logo, { width: size * 1.5, height: size }]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // Image will maintain aspect ratio
  },
});

export default GoogleIcon;

