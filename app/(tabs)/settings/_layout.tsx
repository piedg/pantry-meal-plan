import { StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { ThemeMode, useThemeMode } from '../../../context/ThemeContext';

export default function Settings() {
    const { colors } = useTheme();
    const { mode, setMode } = useThemeMode();

    return (
        <View style={styles.container}>
            <Text variant="titleMedium">Tema</Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                Con "Sistema" l'app segue il tema del telefono.
            </Text>
            <SegmentedButtons
                value={mode}
                onValueChange={(v) => setMode(v as ThemeMode)}
                buttons={[
                    { value: 'system', label: 'Sistema', icon: 'cellphone' },
                    { value: 'light', label: 'Chiaro', icon: 'white-balance-sunny' },
                    { value: 'dark', label: 'Scuro', icon: 'weather-night' },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 12 },
});