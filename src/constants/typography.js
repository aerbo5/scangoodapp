import { Platform } from 'react-native';

// Typography constants based on design system
export const Typography = {
  // Title Medium - Primary font style
  titleMedium: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontWeight: '600', // SemiBold
    fontSize: 24,
    lineHeight: 32, // Typical line height for 24px font
    letterSpacing: 0.5, // Typical letter spacing for medium weight
  },
  
  // Variations
  titleLarge: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  
  titleSmall: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  
  body: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  
  bodyBold: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  
  caption: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
};

export default Typography;

