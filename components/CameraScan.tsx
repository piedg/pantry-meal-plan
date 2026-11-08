import { CameraView } from 'expo-camera';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

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
                <Button mode="contained" onPress={onCancel}>Annulla</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    cancel: { position: 'absolute', bottom: 60, alignSelf: 'center' },
});