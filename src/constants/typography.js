import { Platform } from 'react-native';

// Typography constants based on design system
export const Typography = {
  // Headings
  h1: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: '#111827', // Colors.black
  },
  h2: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: '#111827',
  },
  h3: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: '#1F2937', // Colors.text
  },
  h4: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#1F2937',
  },

  // Body Text
  body: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#374151', // Neutral text
  },
  bodySmall: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },

  // Weights (modifiers)
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },

  // Utilities
  caption: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#9CA3AF',
  },
  button: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
};

export default Typography;

