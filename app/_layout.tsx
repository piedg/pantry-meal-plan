import { useCallback, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { PaperProvider } from 'react-native-paper';
import { AppSplash } from '../components/AppSplash';
import { MealPlanProvider } from '../context/MealPlanContext';
import { PantryProvider } from '../context/PantryContext';
import { ThemeModeProvider, useThemeMode } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../theme/theme';

// Keep the native splash up until AppSplash has drawn its first frame.
SplashScreen.preventAutoHideAsync();

function ThemedApp() {
    const [showSplash, setShowSplash] = useState(true);
    const hideSplash = useCallback(() => setShowSplash(false), []);
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
                    <MealPlanProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                    </MealPlanProvider>
                    {showSplash && <AppSplash onFinish={hideSplash} />}
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