import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';
import { Product } from '../types/Product';
import { formatAmount, totalLabel } from '../units';

type ProductRowProps = {
    product: Product;
    onChangeQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onRename: (product: Product) => void;
};

export function ProductRow({ product, onChangeQuantity, onRemove, onRename }: ProductRowProps) {
    const { colors } = useTheme();
    const { quantity, packSize, packUnit } = product;

    let subtitle: string;
    if (quantity === 0) {
        subtitle = 'Mancante';
    } else if (packSize !== undefined && packUnit !== undefined) {
        const pack = formatAmount(packSize, packUnit);
        subtitle = quantity === 1 ? pack : `${quantity} × ${pack} = ${totalLabel(product)}`;
    } else {
        subtitle = `${quantity} pz`;
    }

    const missing = quantity === 0;

    return (
        <Card
            mode="contained"
            onPress={() => onRename(product)}
            style={{ backgroundColor: colors.elevation.level1 }}
        >
            <View style={styles.content}>
                <View style={styles.info}>
                    <Text variant="titleMedium">{product.name}</Text>
                    <Text
                        variant="bodyMedium"
                        style={{ color: missing ? colors.error : colors.onSurfaceVariant }}
                    >
                        {subtitle}
                    </Text>
                </View>
                <IconButton icon="minus" onPress={() => onChangeQuantity(product.id, -1)} />
                <IconButton icon="plus" onPress={() => onChangeQuantity(product.id, 1)} />
                <IconButton icon="delete-outline" onPress={() => onRemove(product.id)} />
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    content: { flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingVertical: 4 },
    info: { flex: 1 },
});