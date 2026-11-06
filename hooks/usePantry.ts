import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { fetchProduct } from "../services/api";
import { parsePack } from "../units";
import { ProductFields } from "../types/ProductFields";

export function usePantry() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loaded, setLoaded] = useState(false);
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

    const addProduct = (fields: ProductFields) => {
        setProducts(prev => [...prev, { id: Date.now().toString(), ...fields }]);
    };

    const updateProduct = (id: string, fields: ProductFields) => {
        setProducts(prev => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
    };

    const addFromBarcode = async (code: string): Promise<boolean> => {
        if (code === '') return false;
        if (busy) return false;

        setBusy(true)

        try {
            const productFound = await fetchProduct(code);
            if (productFound === null) {
                Alert.alert('Non trovato', 'Questo codice non è nel database.');
                return false;
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
                    {
                        id: Date.now().toString(),
                        name: productFound.name,
                        barcode: code,
                        quantity: 1,
                        ...parsePack(productFound.packText)
                    },
                ];
            });
            return true
        } catch (e) {
            Alert.alert('Errore', 'Controlla la connessione e riprova.');
            return false
        } finally {
            setBusy(false)
        }
    };

    const changeQuantity = (id: string, delta: number) => {
        setProducts(prev =>
            prev.map((p) => {
                if (p.id !== id) return p;
                return { ...p, quantity: Math.max(p.quantity + delta, 0) };
            })
        );
    };

    const removeProduct = (id: string) => {
        setProducts(prev => prev.filter((p) => p.id !== id));
    };



    return { addFromBarcode, changeQuantity, removeProduct, products, setProducts, busy, addProduct, updateProduct }
}