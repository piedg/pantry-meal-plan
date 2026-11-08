import { FlatList, StyleSheet, View } from 'react-native';
import { usePantryContext } from '../../../context/PantryContext';
import { ProductRow } from '../../../components/ProductRow';
import { useState } from 'react';
import { Filter } from '../../../types/Filter';
import { ProductDraft } from '../../../types/ProductDraft';
import { useProductEditor } from '../../../hooks/useProductEditor';
import { ProductModal } from '../../../components/ProductModal';
import { SegmentedButtons, Text } from 'react-native-paper';

const emptyDraft: ProductDraft = { name: '', quantity: '1', packSize: '', packUnit: 'g' };

export default function Products() {

    const { products, changeQuantity, removeProduct } = usePantryContext();
    const { startEditing, modalProps } = useProductEditor();
    const [filter, setFilter] = useState<Filter>('all');

    const visibleProducts =
        filter === 'missing' ? products.filter((p) => p.quantity === 0) : filter === 'owned' ? products.filter((p) => p.quantity > 0) : products;
    const missingCount = products.filter((p) => p.quantity === 0).length;
    const ownedCount = products.filter((p) => p.quantity > 0).length;



    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={filter}
                onValueChange={(v) => setFilter(v as Filter)}
                buttons={[
                    { value: 'all', label: 'Tutti' },
                    { value: 'owned', label: `In casa (${ownedCount})` },
                    { value: 'missing', label: `Mi manca (${missingCount})` },
                ]}
            />


            <FlatList
                data={visibleProducts}
                contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 16, paddingTop: 8 }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        {filter === 'missing' ? 'Non manca nulla' : 'Dispensa vuota'}
                    </Text>
                }
                renderItem={({ item }) => (
                    <ProductRow
                        product={item}
                        onChangeQuantity={changeQuantity}
                        onRemove={removeProduct}
                        onRename={startEditing}
                    />
                )}
            />

            <ProductModal {...modalProps} />
        </View>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20, paddingHorizontal: 16 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        marginBottom: 8,
    },
    row: { fontSize: 18, paddingVertical: 8 },
    filterRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
    empty: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 24 },
});