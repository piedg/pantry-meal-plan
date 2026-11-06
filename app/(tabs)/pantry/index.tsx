import { Button, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function PantryHome() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dispensa</Text>
            <Button title="Tutti i prodotti" onPress={() => router.navigate('/pantry/products')} />
            <Button title="Aggiungi prodotto" onPress={() => router.navigate('/pantry/add')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 70, paddingHorizontal: 20, gap: 12 },
    title: { fontSize: 28, fontWeight: 'bold' },
});