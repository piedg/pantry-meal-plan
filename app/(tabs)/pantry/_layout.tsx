import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function PantryLayout() {
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
            <Stack.Screen name="index" options={{ title: 'La mia Dispensa' }} />
            <Stack.Screen name="products" options={{ title: 'Tutti i prodotti' }} />
            <Stack.Screen name="add" options={{ title: 'Aggiungi prodotto' }} />
        </Stack>
    );
}