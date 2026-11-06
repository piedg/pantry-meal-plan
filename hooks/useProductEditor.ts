import { useState } from 'react';
import { usePantryContext } from '../context/PantryContext';
import { Product } from '../types/Product';
import { ProductDraft } from '../types/ProductDraft';

const emptyDraft: ProductDraft = { name: '', quantity: '1', packSize: '', packUnit: 'g' };

export function useProductEditor() {
    const { addProduct, updateProduct } = usePantryContext();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [draft, setDraft] = useState<ProductDraft>(emptyDraft);

    const startAdding = () => {
        setIsNew(true);
        setEditingId(null);
        setDraft(emptyDraft);
    };

    const startEditing = (product: Product) => {
        setIsNew(false);
        setEditingId(product.id);
        setDraft({
            name: product.name,
            quantity: String(product.quantity),
            packSize: product.packSize !== undefined ? String(product.packSize) : '',
            packUnit: product.packUnit ?? 'g',
        });
    };

    const cancel = () => {
        setIsNew(false);
        setEditingId(null);
    };

    const save = () => {
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

        if (isNew) addProduct(fields);
        else if (editingId !== null) updateProduct(editingId, fields);
        cancel();
    };

    const visible = isNew || editingId !== null;

    return {
        startAdding,
        startEditing,
        modalProps: {
            visible,
            title: isNew ? 'Nuovo prodotto' : 'Modifica prodotto',
            draft,
            onChange: setDraft,
            onSave: save,
            onCancel: cancel,
        },
    };
}