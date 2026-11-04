import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { fetchProductName } from "../services/api";

export function usePantry() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [busy, setBusy] = useState(false)

    const STORAGE_KEY = "pantry-products";

    // All'avvio
    useEffect(() => {
        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    setProducts(JSON.parse(raw) as Product[])
                }
            } catch (e) {
                console.warn("Errore nel caricamento", e)
            }
            setLoaded(true);
        };
        load();
    }, []);

    // Ogni volta che i prodotti cambiano
    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }, [products, loaded])


    const addFromBarcode = async (code: string) => {
        if (code === '') return;
        setBusy(true)

        try {
            const productName = await fetchProductName(code);
            if (productName === null) {
                Alert.alert('Non trovato', 'Questo codice non è nel database.');
                return;
            }
            setProducts((prev) => {
                const existing = prev.find((p) => p.barcode === code);
                if (existing) {
                    return prev.map((p) =>
                        p.barcode === code ? { ...p, quantity: p.quantity + 1 } : p
                    );
                }
                return [
                    ...prev,
                    { id: Date.now().toString(), name: productName, barcode: code, quantity: 1 },
                ];
            });
            setBarcode('');
        } catch (e) {
            Alert.alert('Errore', 'Controlla la connessione e riprova.');
        } finally {
            setBusy(false)
        }
    };

    const changeQuantity = (id: string, delta: number) => {
        setProducts(prev =>
            prev.map((p) =>
                p.id === id ? { ...p, quantity: Math.max(p.quantity + delta, 0) } : p
            )
        );
    };

    const removeProduct = (id: string) => {
        setProducts(prev => prev.filter((p) => p.id !== id));
    };

    return { addFromBarcode, changeQuantity, removeProduct, products, setProducts, barcode, setBarcode, busy }
}