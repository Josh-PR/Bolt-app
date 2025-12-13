export const LightColors = {
  // Primary - Forest Green
  primary: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Base primary
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32', // Primary brand
    900: '#1B5E20',
  },
  
  // Secondary - Softball Orange
  secondary: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00', // Secondary brand
    900: '#E65100',
  },
  
  // Accent - Sky Blue
  accent: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#03A9F4',
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD', // Accent brand
    900: '#01579B',
  },
  
  // Semantic Colors
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#D32F2F',
  info: '#1976D2',
  
  // Neutral Colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  
  // Background Colors
  background: {
    primary: '#000000', // Keep black for main app background
    secondary: '#FFFFFFF',
    tertiary: '#F5F5F5',
    dark: '#000000',
    card: '#FFFFFF', // White for card backgrounds like to-do section
    surface: '#FAFAFA',
  },
  
  // Border Colors
  border: {
    light: '#333333',
    medium: '#555555',
    dark: '#777777',
  },
  
  // Widget Colors
  widgets: {
    blue: '#4A90E2',
    red: '#E74C3C',
    purple: '#9B59B6',
    orange: '#F39C12',
    green: '#2ECC71',
    teal: '#1ABC9C',
    pink: '#E91E63',
    indigo: '#6C5CE7',
  },
};

export const DarkColors = {
  // Primary - Forest Green (adjusted for dark mode)
  primary: {
    50: '#1B2E1B',
    100: '#2D4A2D',
    200: '#3F663F',
    300: '#518251',
    400: '#639E63',
    500: '#75BA75',
    600: '#87D687',
    700: '#99F299',
    800: '#4CAF50', // Keep brand color
    900: '#E8F5E8',
  },
  
  // Secondary - Softball Orange (adjusted for dark mode)
  secondary: {
    50: '#2E1F0A',
    100: '#4A3314',
    200: '#66471E',
    300: '#825B28',
    400: '#9E6F32',
    500: '#BA833C',
    600: '#D69746',
    700: '#F2AB50',
    800: '#FF8F00', // Keep brand color
    900: '#FFF8E1',
  },
  
  // Accent - Sky Blue (adjusted for dark mode)
  accent: {
    50: '#0A1A2E',
    100: '#142D4A',
    200: '#1E4066',
    300: '#285382',
    400: '#32669E',
    500: '#3C79BA',
    600: '#468CD6',
    700: '#509FF2',
    800: '#0277BD', // Keep brand color
    900: '#E1F5FE',
  },
  
  // Semantic Colors (adjusted for dark mode)
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral Colors (inverted for dark mode)
  neutral: {
    50: '#212121',
    100: '#424242',
    200: '#616161',
    300: '#757575',
    400: '#9E9E9E',
    500: '#BDBDBD',
    600: '#E0E0E0',
    700: '#EEEEEE',
    800: '#F5F5F5',
    900: '#FAFAFA',
  },
  
  // Text Colors (inverted for dark mode)
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#666666',
    inverse: '#212121',
  },
  
  // Background Colors (dark theme)
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2A2A2A',
    dark: '#000000',
    card: '#1E1E1E',
    surface: '#181818',
  },
  
  // Border Colors (adjusted for dark mode)
  border: {
    light: '#333333',
    medium: '#555555',
    dark: '#777777',
  },
  
  // Widget Colors (adjusted for dark mode)
  widgets: {
    blue: '#5BA3F5',
    red: '#FF6B6B',
    purple: '#B794F6',
    orange: '#FFB347',
    green: '#68D391',
    teal: '#4FD1C7',
    pink: '#F687B3',
    indigo: '#9F7AEA',
  },
};

// Default export maintains backward compatibility
export const Colors = LightColors;