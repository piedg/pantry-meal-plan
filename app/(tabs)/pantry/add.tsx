import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useProductEditor } from '../../../hooks/useProductEditor';
import { ProductModal } from '../../../components/ProductModal';
import { ScanModal } from '../../../components/ScanModal';
import { Button } from 'react-native-paper';

export default function Add() {
    const { startAdding, modalProps } = useProductEditor();
    const [scanOpen, setScanOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Button mode="contained-tonal" icon="pencil-outline" contentStyle={styles.buttonContent} onPress={startAdding}>
                Aggiungi manualmente
            </Button>
            <Button mode="contained" icon="barcode-scan" contentStyle={styles.buttonContent} onPress={() => setScanOpen(true)}>
                Scansiona barcode
            </Button>

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
    container: { flex: 1, padding: 16, gap: 12 },
    buttonContent: { height: 56 },
});