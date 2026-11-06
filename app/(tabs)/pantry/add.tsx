import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useProductEditor } from '../../../hooks/useProductEditor';
import { ProductModal } from '../../../components/ProductModal';
import { ScanModal } from '../../../components/ScanModal';

export default function Add() {
    const { startAdding, modalProps } = useProductEditor();
    const [scanOpen, setScanOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aggiungi prodotto</Text>
            <Button title="Aggiungi manualmente" onPress={startAdding} />
            <Button title="Scansiona barcode" onPress={() => setScanOpen(true)} />

            <ProductModal {...modalProps} />
            <ScanModal
                visible={scanOpen}
                onClose={() => setScanOpen(false)}
                onAdded={() => router.replace('/pantry/products')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 16, paddingHorizontal: 20, gap: 12 },
    title: { fontSize: 28, fontWeight: 'bold' },
});