import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { List, SegmentedButtons, Snackbar, Text, useTheme } from 'react-native-paper';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useMealPlanContext } from '../../../context/MealPlanContext';
import { usePantryContext } from '../../../context/PantryContext';
import { ThemeMode, useThemeMode } from '../../../context/ThemeContext';
import { BackupData, BackupError, exportBackup, pickBackup } from '../../../services/backup';
import { MealPlan } from '../../../types/MealPlan';

type PendingAction =
    | { kind: 'clear-pantry' }
    | { kind: 'clear-meal-plan' }
    | { kind: 'import'; data: BackupData }
    | null;

function countMeals(plan: MealPlan): number {
    return Object.values(plan).reduce((n, day) => n + Object.keys(day).length, 0);
}

function errorMessage(e: unknown, fallback: string): string {
    return e instanceof BackupError ? e.message : fallback;
}

export default function Settings() {
    const { colors } = useTheme();
    const { mode, setMode } = useThemeMode();
    const { products, setProducts } = usePantryContext();
    const { plan, clearPlan, replacePlan } = useMealPlanContext();

    const [pending, setPending] = useState<PendingAction>(null);
    const [busy, setBusy] = useState(false);
    const [snack, setSnack] = useState('');

    const plannedMeals = countMeals(plan);
    const version = Constants.expoConfig?.version ?? '—';

    const handleExport = async () => {
        setBusy(true);
        try {
            await exportBackup({ products, mealPlan: plan }, version);
        } catch (e) {
            setSnack(errorMessage(e, 'Impossibile esportare il backup'));
        } finally {
            setBusy(false);
        }
    };

    const handleImport = async () => {
        setBusy(true);
        try {
            const data = await pickBackup();
            if (data) setPending({ kind: 'import', data });
        } catch (e) {
            setSnack(errorMessage(e, 'Impossibile leggere il file'));
        } finally {
            setBusy(false);
        }
    };

    const confirm = () => {
        if (pending?.kind === 'clear-pantry') {
            setProducts([]);
            setSnack('Dispensa svuotata');
        } else if (pending?.kind === 'clear-meal-plan') {
            clearPlan();
            setSnack('Meal Plan svuotato');
        } else if (pending?.kind === 'import') {
            setProducts(pending.data.products);
            replacePlan(pending.data.mealPlan);
            setSnack('Backup importato');
        }
        setPending(null);
    };

    const dialog = (() => {
        switch (pending?.kind) {
            case 'clear-pantry':
                return {
                    title: 'Svuotare la dispensa?',
                    message: 'Tutti i prodotti verranno eliminati. Non si può annullare.',
                    confirmLabel: 'Svuota',
                };
            case 'clear-meal-plan':
                return {
                    title: 'Svuotare il meal plan?',
                    message: 'Tutti i pasti pianificati verranno eliminati. Non si può annullare.',
                    confirmLabel: 'Svuota',
                };
            case 'import':
                return {
                    title: 'Importare il backup?',
                    message:
                        `Il backup contiene ${pending.data.products.length} prodotti e ` +
                        `${countMeals(pending.data.mealPlan)} pasti. ` +
                        'I dati attuali verranno sostituiti e non si potranno recuperare.',
                    confirmLabel: 'Sostituisci',
                };
            default:
                return { title: '', message: '', confirmLabel: '' };
        }
    })();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <List.Section>
                    <List.Subheader>Aspetto</List.Subheader>
                    <View style={styles.block}>
                        <Text variant="bodyLarge">Tema</Text>
                        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                            Con &quot;Sistema&quot; l&apos;app segue il tema del telefono.
                        </Text>
                        <SegmentedButtons
                            value={mode}
                            onValueChange={(v) => setMode(v as ThemeMode)}
                            buttons={[
                                { value: 'system', label: 'Sistema', icon: 'cellphone' },
                                { value: 'light', label: 'Chiaro', icon: 'white-balance-sunny' },
                                { value: 'dark', label: 'Scuro', icon: 'weather-night' },
                            ]}
                        />
                    </View>
                </List.Section>

                <List.Section>
                    <List.Subheader>Backup</List.Subheader>
                    <List.Item
                        title="Esporta backup"
                        description="Salva dispensa e meal plan in un file"
                        left={(props) => <List.Icon {...props} icon="export-variant" />}
                        onPress={handleExport}
                        disabled={busy}
                    />
                    <List.Item
                        title="Importa backup"
                        description="Ripristina i dati da un file esportato"
                        left={(props) => <List.Icon {...props} icon="import" />}
                        onPress={handleImport}
                        disabled={busy}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Dati</List.Subheader>
                    <List.Item
                        title="Svuota dispensa"
                        description={`${products.length} prodotti salvati`}
                        left={(props) => <List.Icon {...props} icon="basket-remove-outline" color={colors.error} />}
                        onPress={() => setPending({ kind: 'clear-pantry' })}
                        disabled={products.length === 0}
                    />
                    <List.Item
                        title="Svuota meal plan"
                        description={`${plannedMeals} pasti pianificati`}
                        left={(props) => <List.Icon {...props} icon="calendar-remove-outline" color={colors.error} />}
                        onPress={() => setPending({ kind: 'clear-meal-plan' })}
                        disabled={plannedMeals === 0}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Informazioni</List.Subheader>
                    <List.Item
                        title="Versione"
                        description={version}
                        left={(props) => <List.Icon {...props} icon="information-outline" />}
                    />
                </List.Section>
            </ScrollView>

            <ConfirmDialog
                visible={pending !== null}
                title={dialog.title}
                message={dialog.message}
                confirmLabel={dialog.confirmLabel}
                onConfirm={confirm}
                onCancel={() => setPending(null)}
            />

            <Snackbar visible={snack !== ''} onDismiss={() => setSnack('')} duration={3000}>
                {snack}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: 24 },
    block: { paddingHorizontal: 16, gap: 8 },
});
