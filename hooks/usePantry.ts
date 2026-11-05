import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { fetchProduct } from "../services/api";
import { parsePack } from "../units";

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
        if (busy) return;
        setBusy(true)

        try {
            const productFound = await fetchProduct(code);
            if (productFound === null) {
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
                    {
                        id: Date.now().toString(),
                        name: productFound.name,
                        barcode: code,
                        quantity: 1,
                        ...parsePack(productFound.packText)
                    },
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
            prev.map((p) => {
                if (p.id !== id) return p;
                return { ...p, quantity: Math.max(p.quantity + delta, 0) };
            })
        );
    };

    const removeProduct = (id: string) => {
        setProducts(prev => prev.filter((p) => p.id !== id));
    };



    return { addFromBarcode, changeQuantity, removeProduct, products, setProducts, barcode, setBarcode, busy }
}