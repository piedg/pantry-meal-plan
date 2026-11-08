import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

type ConfirmDialogProps = {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
    visible,
    title,
    message,
    confirmLabel,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const { colors } = useTheme();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>Annulla</Button>
                    <Button onPress={onConfirm} textColor={colors.error}>
                        {confirmLabel}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}