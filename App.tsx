import { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Product } from './types/Product';
import { Filter } from './types/Filter';
import { ProductRow } from './components/ProductRow';
import { ProductModal } from './components/ProductModal';
import { Draft } from './types/Draft';

import { usePantry } from './hooks/usePantry';

const NEW = 'new';
const emptyDraft: Draft = { name: '', quantity: '1', packSize: '', packUnit: 'g' };

export default function App() {

  const [filter, setFilter] = useState<Filter>('all');

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const scanLock = useRef(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const { products, setProducts, barcode, setBarcode, addFromBarcode, changeQuantity, removeProduct, busy } = usePantry();

  const startAdding = () => {
    setEditingId(NEW);
    setDraft(emptyDraft);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      quantity: String(product.quantity),
      packSize: product.packSize !== undefined ? String(product.packSize) : '',
      packUnit: product.packUnit ?? 'g',
    });
  };

  const saveProduct = () => {
    const name = draft.name.trim();
    if (name === '') return;

    const quantity = Math.max(parseInt(draft.quantity, 10) || 0, 0);
    const size = parseFloat(draft.packSize.replace(',', '.'));
    const hasPack = !isNaN(size) && size > 0;

    const fields = {
      name,
      quantity,
      packSize: hasPack ? size : undefined,
      packUnit: hasPack ? draft.packUnit : undefined,
    };

    if (editingId === NEW) {
      setProducts((prev) => [...prev, { id: Date.now().toString(), ...fields }]);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...fields } : p))
      );
    }
    setEditingId(null);
  };

  const startScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permesso negato', 'Senza fotocamera non posso scansionare.');
        return;
      }
    }
    scanLock.current = false;
    setScanning(true);
  };

  const handleScanned = ({ data }: { data: string }) => {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanning(false);
    addFromBarcode(data);
  };

  const cancelEditing = () => setEditingId(null);

  const missingCount = products.filter((p) => p.quantity === 0).length;
  const ownedCount = products.filter((p) => p.quantity > 0).length;
  const visibleProducts =
    filter === 'missing' ? products.filter((p) => p.quantity === 0) : filter === 'owned' ? products.filter((p) => p.quantity > 0) : products;


  if (scanning) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a'] }}
          onBarcodeScanned={handleScanned}
        />
        <View style={{ position: 'absolute', bottom: 60, alignSelf: 'center' }}>
          <Button title="Annulla" color="#fff" onPress={() => setScanning(false)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>La mia dispensa</Text>
      {busy && <ActivityIndicator size="large" style={{ marginBottom: 8 }} />}


      <Button title="➕ Aggiungi a mano" onPress={startAdding} />

      <TextInput
        style={styles.input}
        placeholder="Codice a barre"
        keyboardType="numeric"
        value={barcode}
        onChangeText={setBarcode}
      />
      <Button title="Cerca da codice" onPress={() => addFromBarcode(barcode.trim())} disabled={busy} />
      <Button title="📷 Scansiona" onPress={startScan} disabled={busy} />

      <View style={styles.filterRow}>
        <Button title="Tutti" onPress={() => setFilter('all')} />
        <Button title={`In casa (${ownedCount})`} onPress={() => setFilter('owned')} />
        <Button
          title={`Mi manca (${missingCount})`}
          onPress={() => setFilter('missing')}
        />
      </View>

      <FlatList
        data={visibleProducts}
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

      <ProductModal
        visible={editingId !== null}
        title={editingId === NEW ? 'Nuovo prodotto' : 'Modifica prodotto'}
        draft={draft}
        onChange={setDraft}
        onSave={saveProduct}
        onCancel={cancelEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70, paddingHorizontal: 20 },
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