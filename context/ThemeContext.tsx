import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme-mode';

type ThemeContextValue = {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw === 'system' || raw === 'light' || raw === 'dark') {
                    setMode(raw);
                }
            } catch (e) {
                console.warn('Errore nel caricamento del tema', e);
            }
            setLoaded(true);
        };
        load();
    }, []);

    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(STORAGE_KEY, mode);
    }, [mode, loaded]);

    const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

    return (
        <ThemeContext.Provider value={{ mode, setMode, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeMode(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (ctx === null) {
        throw new Error('useThemeMode va usato dentro ThemeModeProvider');
    }
    return ctx;
}