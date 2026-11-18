import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useKeyboardHeight } from '../hooks/useKeyboardHeight';

type MealEditDialogProps = {
    visible: boolean;
    title: string;
    initialText: string;
    canDelete: boolean;
    onSave: (text: string) => void;
    onDelete: () => void;
    onCancel: () => void;
};

export function MealEditDialog({
    visible,
    title,
    initialText,
    canDelete,
    onSave,
    onDelete,
    onCancel,
}: MealEditDialogProps) {
    const keyboardHeight = useKeyboardHeight();
    // Il genitore passa una `key` diversa per ogni slot, così il testo riparte da initialText
    const [text, setText] = useState(initialText);

    const trimmed = text.trim();
    const save = () => {
        if (trimmed === '') {
            if (canDelete) onDelete();
            else onCancel();
            return;
        }
        onSave(trimmed);
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel} style={{ marginBottom: keyboardHeight }}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        mode="outlined"
                        label="Cosa si mangia?"
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={save}
                        returnKeyType="done"
                        autoFocus
                        style={styles.input}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    {canDelete && (
                        <Button onPress={onDelete} style={styles.delete}>
                            Elimina
                        </Button>
                    )}
                    <Button onPress={onCancel}>Annulla</Button>
                    <Button onPress={save}>Salva</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    input: { marginTop: 4 },
    delete: { marginRight: 'auto' },
});
