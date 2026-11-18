import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function SettingsLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.onSurface,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Impostazioni' }} />
        </Stack>
    );
}
