

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Order, CartItem, Product, SelectedProductOption, OrderStatus, ProductOptionChoice } from '../../types';
import * as api from '../../api';
import { ROUTE_PATHS } from '../../constants';
import { PlusIcon, MinusIcon, TrashIcon, XMarkIcon, SearchIcon, ChevronLeftIcon, PrinterIcon, CurrencyDollarIcon, CheckCircleIcon } from '../../icons';

// --- Product Options Modal ---
const ProductOptionsModal: React.FC<{
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number, options: SelectedProductOption[], observations: string) => void;
}> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<SelectedProductOption[]>([]);
    const [observations, setObservations] = useState('');

    useEffect(() => {
        // Pre-select required single options
        const initialSelected: SelectedProductOption[] = [];
        product.options?.forEach(group => {
            if (group.type === 'single' && group.required && group.choices.length > 0) {
                initialSelected.push({ 
                    groupName: group.name, 
                    choiceName: group.choices[0].name, 
                    priceAdjustment: group.choices[0].priceAdjustment || 0 
                });
            }
        });
        setSelectedOptions(initialSelected);
    }, [product]);

    const totalPrice = useMemo(() => {
        let currentPrice = product.price;
        selectedOptions.forEach(opt => {
            currentPrice += opt.priceAdjustment || 0;
        });
        return currentPrice * quantity;
    }, [product, quantity, selectedOptions]);

    const handleOptionChange = (groupName: string, choice: ProductOptionChoice, groupType: 'single' | 'multiple', isSelected?: boolean) => {
        setSelectedOptions(prev => {
            let newOptions = [...prev];
            if (groupType === 'single') {
                newOptions = newOptions.filter(opt => opt.groupName !== groupName);
                newOptions.push({ groupName, choiceName: choice.name, priceAdjustment: choice.priceAdjustment || 0 });
            } else {
                const existingIndex = newOptions.findIndex(opt => opt.groupName === groupName && opt.choiceName === choice.name);
                if (isSelected && existingIndex === -1) {
                    newOptions.push({ groupName, choiceName: choice.name, priceAdjustment: choice.priceAdjustment || 0 });
                } else if (!isSelected && existingIndex > -1) {
                    newOptions.splice(existingIndex, 1);
                }
            }
            return newOptions;
        });
    };
    
    const handleConfirm = () => {
        const requiredGroups = product.options?.filter(g => g.required).map(g => g.name) || [];
        const selectedGroups = [...new Set(selectedOptions.map(o => o.groupName))];
        const missingRequired = requiredGroups.filter(rg => !selectedGroups.includes(rg));
        if (missingRequired.length > 0) {
            alert(`Por favor, selecione uma opção para: ${missingRequired.join(', ')}`);
            return;
        }
        onAddToCart(product, quantity, selectedOptions, observations);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {product.options?.map(group => (
                        <div key={group.id} className="border-t border-gray-700 pt-4">
                            <h3 className="text-lg font-semibold">{group.name} {group.required && <span className="text-red-400 text-sm">*</span>}</h3>
                            <p className="text-sm text-gray-400 mb-2">{group.type === 'single' ? 'Escolha 1' : 'Escolha quantos desejar'}</p>
                            <div className="space-y-2">
                                {group.choices.map((choice, index) => {
                                    const isChecked = selectedOptions.some(opt => opt.groupName === group.name && opt.choiceName === choice.name);
                                    return (
                                        <label key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer has-[:checked]:bg-green-600/30 has-[:checked]:border-green-500 border border-transparent">
                                            <div className="flex items-center">
                                                <input
                                                    type={group.type === 'single' ? 'radio' : 'checkbox'}
                                                    name={group.id}
                                                    checked={isChecked}
                                                    onChange={(e) => handleOptionChange(group.name, choice, group.type, e.target.checked)}
                                                    className="h-4 w-4 text-green-500 bg-gray-600 border-gray-500 focus:ring-green-500"
                                                />
                                                <span className="ml-3">{choice.name}</span>
                                            </div>
                                            {choice.priceAdjustment && <span className="font-medium text-sm">+ R$ {choice.priceAdjustment.toFixed(2)}</span>}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    <div className="border-t border-gray-700 pt-4">
                        <label htmlFor="observations" className="text-lg font-semibold">Observações</label>
                        <textarea
                            id="observations"
                            value={observations}
                            onChange={e => setObservations(e.target.value)}
                            rows={2}
                            placeholder="Ex: sem cebola, ponto da carne..."
                            className="mt-2 w-full bg-gray-700 rounded-lg p-2 border border-gray-600 focus:ring-green-500 focus:border-green-500"
                        ></textarea>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><MinusIcon className="w-5 h-5"/></button>
                        <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><PlusIcon className="w-5 h-5"/></button>
                    </div>
                    <button onClick={handleConfirm} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition-opacity">
                        Adicionar por R$ {totalPrice.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simplified Product Selection Component
const ProductSelector: React.FC<{ products: Product[], onAddProduct: (product: Product) => void }> = ({ products, onAddProduct }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => [...new Set(products.map(p => p.category || 'Outros'))], [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = selectedCategory ? (p.category || 'Outros') === selectedCategory : true;
            const matchesSearch = search ? p.name.toLowerCase().includes(search.toLowerCase()) : true;
            return matchesCategory && matchesSearch;
        });
    }, [search, selectedCategory, products]);

    return (
        <div className="bg-gray-700 p-4 rounded-lg flex flex-col h-full">
            <div className="relative mb-4">
                <input
                    type="search"
                    placeholder="Buscar produto..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
                <button onClick={() => setSelectedCategory(null)} className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-green-600 text-white font-semibold' : 'bg-gray-800 text-gray-300'}`}>Todos</button>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-green-600 text-white font-semibold' : 'bg-gray-800 text-gray-300'}`}>{cat}</button>
                ))}
            </div>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                {filteredProducts.map(product => (
                    <button key={product.id} onClick={() => onAddProduct(product)} className="w-full flex items-center gap-3 p-2 bg-gray-800 rounded-md hover:bg-gray-600 transition-colors text-left">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                            <p className="text-xs text-gray-400">R$ {product.price.toFixed(2)}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const TableDetailScreen: React.FC = () => {
    const { tableId } = useParams<{ tableId: string }>();
    const navigate = useNavigate();
    
    const [table, setTable] = useState<Table | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentOrderItems, setCurrentOrderItems] = useState<CartItem[]>([]);
    
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [productForOptions, setProductForOptions] = useState<Product | null>(null);

    const fetchData = useCallback(async () => {
        if (!tableId) return;
        setIsLoading(true);
        try {
            const [tableData, productsData] = await Promise.all([
                api.getTableById(tableId),
                api.getProducts()
            ]);
            
            setTable(tableData || null);
            setAllProducts(productsData.filter(p => p.isAvailable));

            if (tableData?.currentOrderId) {
                const orderData = await api.getOrderById(tableData.currentOrderId);
                setOrder(orderData || null);
                setCurrentOrderItems(orderData?.items || []);
            } else {
                setOrder(null);
                setCurrentOrderItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch table detail:", error);
        } finally {
            setIsLoading(false);
        }
    }, [tableId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const subtotal = useMemo(() => currentOrderItems.reduce((sum, item) => sum + item.totalPrice, 0), [currentOrderItems]);
    const serviceFee = subtotal * 0.10;
    const total = subtotal + serviceFee;
    
    const confirmAddToCart = useCallback((product: Product, quantity: number, options: SelectedProductOption[], observations: string) => {
        setCurrentOrderItems(prevItems => {
            const optionsKey = JSON.stringify([...options].sort((a, b) => a.groupName.localeCompare(b.groupName)));

            const existingItemIndex = prevItems.findIndex(item =>
                item.product.id === product.id &&
                JSON.stringify([...(item.selectedOptions || [])].sort((a, b) => a.groupName.localeCompare(b.groupName))) === optionsKey
            );

            let priceWithOptions = product.price;
            options.forEach(opt => { priceWithOptions += opt.priceAdjustment || 0; });
            
            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: newQuantity,
                    totalPrice: priceWithOptions * newQuantity,
                    observations: observations || updatedItems[existingItemIndex].observations
                };
                return updatedItems;
            } else {
                const totalItemPrice = priceWithOptions * quantity;
                return [...prevItems, { product, quantity, selectedOptions: options, observations, totalPrice: totalItemPrice }];
            }
        });
        setIsOptionsModalOpen(false);
    }, []);


    const handleAddProduct = useCallback((product: Product) => {
        if (product.options && product.options.length > 0) {
            setProductForOptions(product);
            setIsOptionsModalOpen(true);
        } else {
            confirmAddToCart(product, 1, [], '');
        }
    }, [confirmAddToCart]);

    const handleUpdateQuantity = useCallback((itemIndex: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCurrentOrderItems(prev => prev.filter((_, index) => index !== itemIndex));
        } else {
            setCurrentOrderItems(prev => prev.map((item, index) => {
                if (index === itemIndex) {
                    let priceWithOptions = item.product.price;
                    item.selectedOptions?.forEach(opt => { priceWithOptions += opt.priceAdjustment || 0; });
                    return { ...item, quantity: newQuantity, totalPrice: newQuantity * priceWithOptions };
                }
                return item;
            }));
        }
    }, []);

    const handleStartOrder = async () => {
        if (!table) return;
        
        const newOrderData: Omit<Order, 'id'> = {
            userId: 'employee',
            restaurantId: 'rest1',
            restaurantName: 'Burguer Queen', // This could be fetched
            items: [],
            subtotal: 0,
            deliveryFee: 0,
            discount: 0,
            total: 0,
            status: OrderStatus.PREPARING,
            deliveryAddress: { id: '', street: '', number: '', city: '', state: '', zip: '', neighborhood:'' },
            paymentMethod: 'Local',
            createdAt: new Date().toISOString(),
            isLocal: true,
            customerName: table.name,
            tableId: table.id,
            tableName: table.name,
            deliveryType: 'PICKUP',
        };
        try {
            const newOrder = await api.placeOrder({ ...newOrderData, id: `order-table-${table.id}-${Date.now()}`});
            await api.updateTableStatus(table.id, 'Ocupada', newOrder.id);
            await fetchData(); // Refresh data from "backend"
        } catch (error) {
            console.error("Failed to start order:", error);
            alert("Erro ao iniciar pedido.");
        }
    };

    const handleUpdateOrder = async () => {
        if (!order) {
            alert("Nenhum pedido ativo para atualizar.");
            return;
        }
        try {
            await api.updateOrder(order.id, { items: currentOrderItems, subtotal, total });
            alert("Comanda atualizada!");
            await fetchData();
        } catch(error) {
            console.error("Failed to update order:", error);
            alert("Erro ao atualizar comanda.");
        }
    };

    const handleCloseBill = async () => {
        if (!table) return;
        try {
            await api.updateTableStatus(table.id, 'Pagando');
            await fetchData();
        } catch (error) {
            console.error("Failed to update table status:", error);
        }
    };

    const handleFinalizePayment = async () => {
        if (!table || !order) return;
        try {
            await api.updateOrder(order.id, { status: OrderStatus.DELIVERED });
            await api.updateTableStatus(table.id, 'Livre');
            navigate(ROUTE_PATHS.EMPLOYEE_DASHBOARD);
        } catch(error) {
            console.error("Failed to finalize payment:", error);
        }
    };

    if (isLoading) {
        return <div className="bg-gray-900 text-white flex items-center justify-center h-full">Carregando...</div>;
    }

    if (!table) {
        return <div className="bg-gray-900 text-white flex items-center justify-center h-full">Mesa não encontrada.</div>;
    }

    const hasActiveOrder = table.status !== 'Livre';

    return (
        <div className="flex h-[calc(100vh-60px)]">
            {isOptionsModalOpen && productForOptions && (
                <ProductOptionsModal
                    product={productForOptions}
                    onClose={() => setIsOptionsModalOpen(false)}
                    onAddToCart={confirmAddToCart}
                />
            )}

            {/* Left Panel: Order Details */}
            <div className="w-1/2 flex flex-col bg-gray-800 p-4">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(ROUTE_PATHS.EMPLOYEE_DASHBOARD)} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                        <ChevronLeftIcon className="w-6 h-6 text-white"/>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold">{table.name}</h2>
                        <p className="text-sm text-gray-400">Status: {table.status}</p>
                    </div>
                </div>

                {!hasActiveOrder ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <p className="text-gray-400 mb-4">Mesa livre.</p>
                        <button onClick={handleStartOrder} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors">
                            Iniciar Novo Pedido
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                            {currentOrderItems.length === 0 && <p className="text-center text-gray-400 py-8">Nenhum item na comanda.</p>}
                            {currentOrderItems.map((item, index) => (
                                <div key={`${item.product.id}-${index}`} className="bg-gray-700 p-3 rounded-md flex items-center gap-3">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-md object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{item.product.name}</p>
                                        {item.selectedOptions && item.selectedOptions.length > 0 && 
                                            <p className="text-xs text-gray-400 truncate">{item.selectedOptions.map(o => o.choiceName).join(', ')}</p>
                                        }
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleUpdateQuantity(index, item.quantity - 1)} className="p-1 bg-gray-600 rounded-full"><MinusIcon className="w-4 h-4"/></button>
                                        <span className="w-6 text-center font-bold">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(index, item.quantity + 1)} className="p-1 bg-gray-600 rounded-full"><PlusIcon className="w-4 h-4"/></button>
                                    </div>
                                    <p className="font-bold w-20 text-right">R$ {item.totalPrice.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700 text-sm space-y-1">
                            <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Serviço (10%)</span><span>R$ {serviceFee.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg mt-2"><span >Total</span><span>R$ {total.toFixed(2)}</span></div>
                        </div>
                        <div className="mt-4 space-y-3">
                            {table.status === 'Pagando' ? (
                                <button onClick={handleFinalizePayment} className="w-full py-4 bg-green-600 rounded-md font-bold text-lg hover:bg-green-500 flex items-center justify-center gap-2">
                                    <CheckCircleIcon className="w-6 h-6" />
                                    Finalizar Pagamento
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleUpdateOrder} className="w-full py-3 bg-blue-600 rounded-md font-semibold hover:bg-blue-500 disabled:opacity-50" disabled={currentOrderItems.length === 0}>
                                        Atualizar Comanda
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="py-3 bg-gray-600 rounded-md font-semibold hover:bg-gray-500 flex items-center justify-center gap-2">
                                            <PrinterIcon className="w-5 h-5"/>
                                            Imprimir
                                        </button>
                                        <button onClick={handleCloseBill} className="py-3 bg-yellow-600 rounded-md font-semibold hover:bg-yellow-500 flex items-center justify-center gap-2 disabled:opacity-50" disabled={currentOrderItems.length === 0}>
                                            <CurrencyDollarIcon className="w-5 h-5"/>
                                            Fechar Conta
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Right Panel: Product Selection */}
            <div className="w-1/2 bg-gray-900 p-4">
                 {hasActiveOrder ? (
                    isLoading ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Carregando produtos...</div>
                    ) : (
                        <ProductSelector products={allProducts} onAddProduct={handleAddProduct} />
                    )
                 ) : (
                    <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                        <p>Inicie um pedido para adicionar itens.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default TableDetailScreen;
