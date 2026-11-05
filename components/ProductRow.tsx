import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/Product';
import { formatAmount, totalLabel } from '../units';

type ProductRowProps = {
    product: Product;
    onChangeQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onRename: (product: Product) => void;
};

export function ProductRow({ product, onChangeQuantity, onRemove, onRename }: ProductRowProps) {
    const { quantity, packSize, packUnit } = product;
    const hasPack = packSize !== undefined && packUnit !== undefined;

    let subtitle: string | null = null;
    if (hasPack) {
        const pack = formatAmount(packSize, packUnit);
        if (quantity === 0) {
            subtitle = 'Mancante';
        } else if (quantity === 1) {
            subtitle = `${quantity} × ${pack}`;
        } else {
            subtitle = `${quantity} × ${pack} = ${totalLabel(product)}`;
        }
    }

    return (
        <View style={styles.itemRow}>
            <Pressable style={styles.itemName} onPress={() => onRename(product)}>
                <Text style={styles.itemNameText}>{product.name}</Text>
                {subtitle !== null && <Text style={styles.subtitle}>{subtitle}</Text>}
            </Pressable>
            <Button title="−" onPress={() => onChangeQuantity(product.id, -1)} />
            <Button title="+" onPress={() => onChangeQuantity(product.id, 1)} />
            <Button title="🗑" onPress={() => onRemove(product.id)} />
        </View>
    );
}

const styles = StyleSheet.create({
    itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    itemName: { flex: 1 },
    itemNameText: { fontSize: 18 },
    qty: { fontSize: 18, minWidth: 60, textAlign: 'center' },
    unit: { fontWeight: 'bold', color: '#007AFF' },
    subtitle: { fontSize: 15, color: '#888' }
});