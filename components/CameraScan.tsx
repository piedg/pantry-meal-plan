import { CameraView } from 'expo-camera';
import { Button, StyleSheet, View } from 'react-native';

type CameraScanProps = {
    onScanned: (data: string) => void;
    onCancel: () => void;
};

export function CameraScan({ onScanned, onCancel }: CameraScanProps) {
    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a'] }}
                onBarcodeScanned={({ data }) => onScanned(data)}
            />
            <View style={styles.cancel}>
                <Button title="Annulla" color="#fff" onPress={onCancel} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    cancel: { position: 'absolute', bottom: 60, alignSelf: 'center' },
});