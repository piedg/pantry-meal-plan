import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { usePantryContext } from '../context/PantryContext';
import { CameraScan } from './CameraScan';

type ScanModalProps = {
    visible: boolean;
    onClose: () => void;
    onAdded: () => void;
};

export function ScanModal({ visible, onClose, onAdded }: ScanModalProps) {
    const { addFromBarcode, busy } = usePantryContext();
    const [barcode, setBarcode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const scanLock = useRef(false);

    const close = () => {
        setScanning(false);
        setBarcode('');
        onClose();
    };

    const startScan = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert('Permesso negato', 'Senza fotocamera non posso scansionare.');
                return;
            }
        }
        scanLock.current = false;
        setScanning(true);
    };

    const handleScanned = async (data: string) => {
        if (scanLock.current) return;
        scanLock.current = true;
        setScanning(false);
        const ok = await addFromBarcode(data);
        if (ok) {
            close();
            onAdded();
        }
    };

    const search = async () => {
        const ok = await addFromBarcode(barcode.trim());
        if (ok) {
            close();
            onAdded();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={close}>
            {scanning ? (
                <CameraScan onScanned={handleScanned} onCancel={() => setScanning(false)} />
            ) : (
                <View style={styles.container}>
                    <Text style={styles.title}>Scansiona barcode</Text>
                    {busy && <ActivityIndicator size="large" />}

                    <Button title="Scan barcode" onPress={startScan} disabled={busy} />

                    <TextInput
                        style={styles.input}
                        placeholder="Codice a barre"
                        keyboardType="numeric"
                        value={barcode}
                        onChangeText={setBarcode}
                    />
                    <Button title="Cerca" onPress={search} disabled={busy} />
                    <Button title="Chiudi" onPress={close} color="#888" />
                </View>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 70, paddingHorizontal: 20, gap: 12 },
    title: { fontSize: 24, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
    },
});