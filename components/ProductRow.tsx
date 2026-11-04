import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/Product';

type ProductRowProps = {
    product: Product;
    onChangeQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onRename: (product: Product) => void;
};

export function ProductRow({ product, onChangeQuantity, onRemove, onRename }: ProductRowProps) {
    return (
        <View style={styles.itemRow}>
            <Pressable style={styles.itemName} onPress={() => onRename(product)}>
                <Text style={styles.itemNameText}>{product.name}</Text>
            </Pressable>
            <Button title="−" onPress={() => onChangeQuantity(product.id, -1)} />
            <Text style={styles.qty}>{product.quantity}</Text>
            <Button title="+" onPress={() => onChangeQuantity(product.id, 1)} />
            <Button title="🗑" onPress={() => onRemove(product.id)} />
        </View>
    );
}

const styles = StyleSheet.create({
    itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    itemName: { flex: 1 },
    itemNameText: { fontSize: 18 },
    qty: { fontSize: 18, width: 30, textAlign: 'center' },
});