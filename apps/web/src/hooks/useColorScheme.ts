import { useEffect, useState } from 'react';

export type IColorScheme = 'dark' | 'light' | null;

const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<IColorScheme>(null);

  useEffect(() => {
    const getInitialColorScheme = () => {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setColorScheme(darkModeQuery.matches ? 'dark' : 'light');
    };

    getInitialColorScheme();

    const updateColorScheme = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? 'dark' : 'light');
    };

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', updateColorScheme);

    return () => {
      darkModeQuery.removeEventListener('change', updateColorScheme);
    };
  }, []);

  return colorScheme;
};

export default useColorScheme;
