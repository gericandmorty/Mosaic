import { useThemeStore } from '../theme/theme.slice';
import { lightColors, darkColors } from '../theme/colors';

export const useThemeColors = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return isDarkMode ? darkColors : lightColors;
};
