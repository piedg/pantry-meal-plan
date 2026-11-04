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
import { RenameModal } from './components/RenameModal';
import { usePantry } from './hooks/usePantry';


export default function App() {
  const [name, setName] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const scanLock = useRef(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');


  const { products, setProducts, barcode, setBarcode, addFromBarcode, changeQuantity, removeProduct, busy } = usePantry();

  const addProduct = () => {
    if (name.trim() === '') return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity: 1,
    };

    setProducts(prev => [...prev, newProduct]);
    setName('');
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

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditingName(product.name);
  };

  const saveName = () => {
    const trimmed = editingName.trim();
    if (trimmed === '') return;
    setProducts((prev) =>
      prev.map((p) => (p.id === editingId ? { ...p, name: trimmed } : p))
    );
    setEditingId(null);
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

      <TextInput
        style={styles.input}
        placeholder="Nome prodotto"
        value={name}
        onChangeText={setName}
      />
      <Button title="Aggiungi" onPress={addProduct} />

      <TextInput
        style={styles.input}
        placeholder="Codice a barre"
        keyboardType="numeric"
        value={barcode}
        onChangeText={setBarcode}
      />
      <Button title="Cerca da codice" onPress={() => addFromBarcode(barcode.trim())} />
      <Button title="📷 Scansiona" onPress={startScan} />

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

      <RenameModal
        visible={editingId !== null}
        value={editingName}
        onChangeText={setEditingName}
        onSave={saveName}
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