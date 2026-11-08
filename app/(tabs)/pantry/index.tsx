import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { usePantryContext } from '../../../context/PantryContext';

export default function PantryHome() {
    const { colors } = useTheme();
    const { products } = usePantryContext();

    const missing = products.filter((p) => p.quantity === 0).length;
    const owned = products.length - missing;

    return (
        <View style={styles.container}>
            <Card mode="contained" style={{ backgroundColor: colors.primaryContainer }}>
                <Card.Content style={styles.summary}>
                    <View style={styles.stat}>
                        <Text variant="displaySmall" style={{ color: colors.onPrimaryContainer }}>
                            {owned}
                        </Text>
                        <Text variant="labelLarge" style={{ color: colors.onPrimaryContainer }}>
                            In casa
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <Text variant="displaySmall" style={{ color: colors.onPrimaryContainer }}>
                            {missing}
                        </Text>
                        <Text variant="labelLarge" style={{ color: colors.onPrimaryContainer }}>
                            Mi manca
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <Button
                mode="contained-tonal"
                icon="format-list-bulleted"
                contentStyle={styles.buttonContent}
                onPress={() => router.navigate('/pantry/products')}
            >
                Tutti i prodotti
            </Button>
            <Button
                mode="contained"
                icon="plus"
                contentStyle={styles.buttonContent}
                onPress={() => router.navigate('/pantry/add')}
            >
                Aggiungi prodotto
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 12 },
    summary: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 },
    stat: { alignItems: 'center' },
    buttonContent: { height: 56 },
});