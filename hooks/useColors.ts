import { useTheme } from '../contexts/ThemeContext';
import { LightColors, DarkColors } from '../constants/Colors';

export const useColors = () => {
  const { isDark } = useTheme();
  return isDark ? DarkColors : LightColors;
};