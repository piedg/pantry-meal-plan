import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { PantryProvider } from '../context/PantryContext';
import { ThemeModeProvider, useThemeMode } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../theme/theme';

function ThemedApp() {
    const { isDark } = useThemeMode();
    const paperTheme = isDark ? darkTheme : lightTheme;
    const base = isDark ? DarkTheme : DefaultTheme;

    const navTheme = {
        ...base,
        colors: {
            ...base.colors,
            background: paperTheme.colors.background,
            card: paperTheme.colors.surface,
            text: paperTheme.colors.onSurface,
            border: paperTheme.colors.outlineVariant,
            primary: paperTheme.colors.primary,
        },
    };

    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={navTheme}>
                <PantryProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                </PantryProvider>
            </ThemeProvider>
        </PaperProvider>
    );
}

export default function RootLayout() {
    return (
        <ThemeModeProvider>
            <ThemedApp />
        </ThemeModeProvider>
    );
}