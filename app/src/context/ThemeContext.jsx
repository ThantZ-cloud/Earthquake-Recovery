import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export default ThemeContext;
