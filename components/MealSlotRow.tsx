import { StyleSheet, View } from 'react-native';
import { Icon, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Meal, MealSlot } from '../types/MealPlan';

export const SLOT_LABELS: Record<MealSlot, string> = {
    lunch: 'Pranzo',
    dinner: 'Cena',
};

const SLOT_ICONS: Record<MealSlot, string> = {
    lunch: 'white-balance-sunny',
    dinner: 'weather-night',
};

type MealSlotRowProps = {
    slot: MealSlot;
    meal?: Meal;
    onPress: () => void;
};

export function MealSlotRow({ slot, meal, onPress }: MealSlotRowProps) {
    const { colors } = useTheme();

    return (
        <TouchableRipple
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${SLOT_LABELS[slot]}: ${meal ? meal.text : 'vuoto'}`}
            style={styles.row}
        >
            <View style={styles.inner}>
                <Icon source={SLOT_ICONS[slot]} size={20} color={colors.onSurfaceVariant} />
                <View style={styles.texts}>
                    <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
                        {SLOT_LABELS[slot]}
                    </Text>
                    {meal ? (
                        <Text variant="bodyLarge" numberOfLines={2}>
                            {meal.text}
                        </Text>
                    ) : (
                        <Text variant="bodyLarge" style={{ color: colors.outline }}>
                            Aggiungi…
                        </Text>
                    )}
                </View>
                <Icon source={meal ? 'pencil-outline' : 'plus'} size={20} color={colors.onSurfaceVariant} />
            </View>
        </TouchableRipple>
    );
}

const styles = StyleSheet.create({
    row: { paddingHorizontal: 16, paddingVertical: 10 },
    inner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    texts: { flex: 1 },
});
