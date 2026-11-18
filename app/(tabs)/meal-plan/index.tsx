import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { MealEditDialog } from '../../../components/MealEditDialog';
import { MealSlotRow, SLOT_LABELS } from '../../../components/MealSlotRow';
import { useMealPlanContext } from '../../../context/MealPlanContext';
import { MealSlot } from '../../../types/MealPlan';
import { addDays, dayName, shortDate, startOfWeek, toDateKey, weekDays, weekLabel } from '../../../utils/week';

const SLOTS: MealSlot[] = ['lunch', 'dinner'];

type Editing = { dateKey: string; slot: MealSlot; title: string };

export default function MealPlanScreen() {
    const { colors } = useTheme();
    const { getMeal, setMeal } = useMealPlanContext();

    const todayKey = toDateKey(new Date());
    const currentWeekStart = startOfWeek(new Date());
    const [weekStart, setWeekStart] = useState(currentWeekStart);
    const [editing, setEditing] = useState<Editing | null>(null);

    const isCurrentWeek = toDateKey(weekStart) === toDateKey(currentWeekStart);
    const editingMeal = editing ? getMeal(editing.dateKey, editing.slot) : undefined;

    return (
        <View style={styles.container}>
            <View style={[styles.weekBar, { backgroundColor: colors.surface }]}>
                <IconButton
                    icon="chevron-left"
                    accessibilityLabel="Settimana precedente"
                    onPress={() => setWeekStart((w) => addDays(w, -7))}
                />
                <View style={styles.weekCenter}>
                    <Text variant="titleMedium">{weekLabel(weekStart)}</Text>
                    {isCurrentWeek ? (
                        <Text variant="labelMedium" style={{ color: colors.primary }}>
                            Questa settimana
                        </Text>
                    ) : (
                        <Button compact onPress={() => setWeekStart(currentWeekStart)}>
                            Torna a oggi
                        </Button>
                    )}
                </View>
                <IconButton
                    icon="chevron-right"
                    accessibilityLabel="Settimana successiva"
                    onPress={() => setWeekStart((w) => addDays(w, 7))}
                />
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {weekDays(weekStart).map((day) => {
                    const dateKey = toDateKey(day);
                    const isToday = dateKey === todayKey;

                    return (
                        <Card
                            key={dateKey}
                            mode={isToday ? 'contained' : 'outlined'}
                            style={isToday ? { backgroundColor: colors.secondaryContainer } : undefined}
                        >
                            <View style={styles.dayHeader}>
                                <Text variant="titleSmall">{dayName(day)}</Text>
                                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                                    {isToday ? `Oggi · ${shortDate(day)}` : shortDate(day)}
                                </Text>
                            </View>
                            {SLOTS.map((slot, i) => (
                                <View key={slot}>
                                    {i > 0 && <Divider style={styles.divider} />}
                                    <MealSlotRow
                                        slot={slot}
                                        meal={getMeal(dateKey, slot)}
                                        onPress={() =>
                                            setEditing({
                                                dateKey,
                                                slot,
                                                title: `${SLOT_LABELS[slot]} · ${dayName(day)} ${shortDate(day)}`,
                                            })
                                        }
                                    />
                                </View>
                            ))}
                        </Card>
                    );
                })}
            </ScrollView>

            <MealEditDialog
                key={editing ? `${editing.dateKey}-${editing.slot}` : 'closed'}
                visible={editing !== null}
                title={editing?.title ?? ''}
                initialText={editingMeal?.text ?? ''}
                canDelete={editingMeal !== undefined}
                onCancel={() => setEditing(null)}
                onDelete={() => {
                    if (editing) setMeal(editing.dateKey, editing.slot, null);
                    setEditing(null);
                }}
                onSave={(text) => {
                    if (editing) {
                        // Mantiene un eventuale recipeId già collegato
                        setMeal(editing.dateKey, editing.slot, { ...editingMeal, text });
                    }
                    setEditing(null);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    weekBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, paddingBottom: 4 },
    weekCenter: { flex: 1, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
    list: { padding: 16, gap: 12 },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 2,
    },
    divider: { marginHorizontal: 16 },
});
