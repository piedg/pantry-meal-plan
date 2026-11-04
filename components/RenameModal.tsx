import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

type RenameModalProps = {
    visible: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export function RenameModal({ visible, value, onChangeText, onSave, onCancel }: RenameModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalBackdrop}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>Rinomina prodotto</Text>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        autoFocus
                    />
                    <View style={styles.modalButtons}>
                        <Button title="Annulla" onPress={onCancel} />
                        <Button title="Salva" onPress={onSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 24,
    },
    modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        marginBottom: 8,
    },
});