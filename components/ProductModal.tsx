import {
    Button,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { ProductDraft } from '../types/ProductDraft';
import { PackUnit } from '../types/PackUnit';

type ProductModalProps = {
    visible: boolean;
    title: string;
    draft: ProductDraft;
    onChange: (draft: ProductDraft) => void;
    onSave: () => void;
    onCancel: () => void;
};

const PACK_UNITS: PackUnit[] = ['g', 'ml'];

export function ProductModal({ visible, title, draft, onChange, onSave, onCancel }: ProductModalProps) {
    return (
        <Modal visible={visible} animationType="slide">
            <KeyboardAvoidingView
                style={styles.backdrop}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.box}>
                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={draft.name}
                        onChangeText={(text) => onChange({ ...draft, name: text })}
                        autoFocus
                    />

                    <Text style={styles.label}>Quantità</Text>
                    <TextInput
                        style={styles.input}
                        value={draft.quantity}
                        onChangeText={(text) => onChange({ ...draft, quantity: text })}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Formato di una confezione (opzionale)</Text>
                    <View style={styles.packRow}>
                        <TextInput
                            style={[styles.input, styles.packInput]}
                            value={draft.packSize}
                            onChangeText={(text) => onChange({ ...draft, packSize: text })}
                            keyboardType="decimal-pad"
                            placeholder="es. 250"
                        />
                        {PACK_UNITS.map((u) => (
                            <Pressable
                                key={u}
                                style={[styles.unitBtn, draft.packUnit === u && styles.unitBtnActive]}
                                onPress={() => onChange({ ...draft, packUnit: u })}
                            >
                                <Text style={draft.packUnit === u ? styles.unitTextActive : styles.unitText}>
                                    {u}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.buttons}>
                        <Button title="Annulla" onPress={onCancel} />
                        <Button title="Salva" onPress={onSave} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 24,
    },
    box: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    label: { fontSize: 14, color: '#666', marginBottom: 4 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        marginBottom: 12,
    },
    packRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    packInput: { flex: 1 },
    unitBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    unitBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    unitText: { fontSize: 18, color: '#333' },
    unitTextActive: { fontSize: 18, color: '#fff' },
    buttons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
});