import { CameraView } from "expo-camera";
import { Button, StyleSheet, View } from "react-native";

type CameraScanProps = {
    onScanned: (data: string) => void;
    onCancel: () => void;
};

export function CameraScan({ onScanned, onCancel }: CameraScanProps) {
    return (
        <View style={StyleSheet.absoluteFill}>
            <CameraView
                style={StyleSheet.absoluteFill}
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a'] }}
                onBarcodeScanned={({ data }) => onScanned(data)}
            />
            <View style={styles.buttonContainer}>
                <Button title="Annulla" color="#000" onPress={onCancel} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: { position: 'absolute', bottom: 60, alignSelf: 'center' }
})