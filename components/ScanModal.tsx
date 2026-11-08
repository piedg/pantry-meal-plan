import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, StyleSheet } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
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

    const { colors } = useTheme();

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
                <KeyboardAvoidingView
                    style={[styles.container, { backgroundColor: colors.background }]}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <Text variant="headlineSmall" style={styles.title}>
                        Scansiona barcode
                    </Text>
                    {busy && <ActivityIndicator size="large" />}

                    <Button mode="contained" icon="camera" onPress={startScan} disabled={busy}>
                        Apri la fotocamera
                    </Button>

                    <TextInput
                        mode="outlined"
                        label="Codice a barre"
                        keyboardType="numeric"
                        value={barcode}
                        onChangeText={setBarcode}
                    />
                    <Button
                        mode="contained-tonal"
                        icon="magnify"
                        onPress={search}
                        disabled={busy || barcode.trim() === ''}
                    >
                        Cerca
                    </Button>
                    <Button mode="text" icon="close" onPress={close}>
                        Chiudi
                    </Button>
                </KeyboardAvoidingView>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 12 },
    title: { textAlign: 'center' },
});