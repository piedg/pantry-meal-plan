import { FlatList, StyleSheet, View } from 'react-native';
import { usePantryContext } from '../../../context/PantryContext';
import { ProductRow } from '../../../components/ProductRow';
import { useState } from 'react';
import { Filter } from '../../../types/Filter';
import { ProductDraft } from '../../../types/ProductDraft';
import { useProductEditor } from '../../../hooks/useProductEditor';
import { ProductModal } from '../../../components/ProductModal';
import { FAB, SegmentedButtons, Text } from 'react-native-paper';
import { ScanModal } from '../../../components/ScanModal';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

const emptyDraft: ProductDraft = { name: '', quantity: '1', packSize: '', packUnit: 'g' };

export default function Products() {

    const { products, changeQuantity, removeProduct } = usePantryContext();
    const { startEditing, startAdding, modalProps } = useProductEditor();
    const [fabOpen, setFabOpen] = useState(false);
    const [scanOpen, setScanOpen] = useState(false);
    const [filter, setFilter] = useState<Filter>('all');
    const [deletingProductId, setdeletingProductId] = useState<string | null>(null);

    const deletingProduct = products.find((p) => p.id === deletingProductId);

    const visibleProducts =
        filter === 'missing' ? products.filter((p) => p.quantity === 0) : filter === 'owned' ? products.filter((p) => p.quantity > 0) : products;
    const missingCount = products.filter((p) => p.quantity === 0).length;
    const ownedCount = products.filter((p) => p.quantity > 0).length;

    const confirmDelete = () => {
        if (deletingProduct) removeProduct(deletingProduct.id);
        setdeletingProductId(null);
    };

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={filter}
                onValueChange={(v) => setFilter(v as Filter)}
                buttons={[
                    { value: 'all', label: 'Tutti' },
                    { value: 'owned', label: `In casa (${ownedCount})` },
                    { value: 'missing', label: `Manca (${missingCount})` },
                ]}
            />


            <FlatList
                data={visibleProducts}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 96, paddingTop: 8 }}
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
                        onRemove={setdeletingProductId}
                        onRename={startEditing}
                    />
                )}
            />

            <ConfirmDialog
                visible={deletingProduct !== undefined}
                title="Eliminare il prodotto?"
                message={deletingProduct ? `"${deletingProduct.name}" verrà rimosso definitivamente dalla dispensa.` : ''}
                confirmLabel="Elimina"
                onConfirm={confirmDelete}
                onCancel={() => setdeletingProductId(null)}
            />

            <ProductModal {...modalProps} />
            <ScanModal
                visible={scanOpen}
                onClose={() => setScanOpen(false)}
                onAdded={() => { }}
            />

            <FAB.Group
                visible
                open={fabOpen}
                icon={fabOpen ? 'close' : 'plus'}
                actions={[
                    { icon: 'pencil-outline', label: 'Aggiungi manualmente', onPress: startAdding },
                    { icon: 'barcode-scan', label: 'Scansiona barcode', onPress: () => setScanOpen(true) },
                ]}
                onStateChange={({ open }) => setFabOpen(open)}
            />
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