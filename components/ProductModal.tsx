import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Dialog, Portal, SegmentedButtons, TextInput } from 'react-native-paper';
import { useKeyboardHeight } from '../hooks/useKeyboardHeight';
import { PackUnit } from '../types/PackUnit';
import { ProductDraft } from '../types/ProductDraft';

type ProductModalProps = {
    visible: boolean;
    title: string;
    draft: ProductDraft;
    onChange: (draft: ProductDraft) => void;
    onSave: () => void;
    onCancel: () => void;
};

export function ProductModal({ visible, title, draft, onChange, onSave, onCancel }: ProductModalProps) {
    const keyboardHeight = useKeyboardHeight();
    const { height: windowHeight } = useWindowDimensions();

    const scrollMaxHeight = Math.max(windowHeight - keyboardHeight - 220, 160);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel} style={{ marginBottom: keyboardHeight }}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.ScrollArea style={{ maxHeight: scrollMaxHeight }}>
                    <ScrollView
                        contentContainerStyle={styles.content}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TextInput
                            mode="outlined"
                            label="Nome"
                            value={draft.name}
                            onChangeText={(text) => onChange({ ...draft, name: text })}
                            autoFocus
                        />
                        <TextInput
                            mode="outlined"
                            label="Confezioni"
                            value={draft.quantity}
                            onChangeText={(text) => onChange({ ...draft, quantity: text })}
                            keyboardType="numeric"
                        />
                        <TextInput
                            mode="outlined"
                            label="Formato di una confezione (opzionale)"
                            value={draft.packSize}
                            onChangeText={(text) => onChange({ ...draft, packSize: text })}
                            keyboardType="decimal-pad"
                        />
                        <SegmentedButtons
                            value={draft.packUnit}
                            onValueChange={(v) => onChange({ ...draft, packUnit: v as PackUnit })}
                            buttons={[
                                { value: 'g', label: 'g' },
                                { value: 'ml', label: 'ml' },
                            ]}
                        />
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={onCancel}>Annulla</Button>
                    <Button onPress={onSave}>Salva</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    content: { gap: 12, paddingVertical: 8 },
});