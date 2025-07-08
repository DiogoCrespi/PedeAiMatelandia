import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Order, CartItem, Product, SelectedProductOption, OrderStatus } from '../../types';
import { MOCK_PRODUCTS } from '../../data';
import { ROUTE_PATHS } from '../../constants';
import { PlusIcon, MinusIcon, TrashIcon, XMarkIcon, SearchIcon, ChevronLeftIcon, PrinterIcon, CurrencyDollarIcon, CheckCircleIcon } from '../../icons';

// Simplified Product Selection Component
const ProductSelector: React.FC<{ onAddProduct: (product: Product, quantity: number) => void }> = ({ onAddProduct }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => [...new Set(MOCK_PRODUCTS.map(p => p.category || 'Outros'))], []);

    const filteredProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter(p => {
            const matchesCategory = selectedCategory ? (p.category || 'Outros') === selectedCategory : true;
            const matchesSearch = search ? p.name.toLowerCase().includes(search.toLowerCase()) : true;
            return matchesCategory && matchesSearch;
        });
    }, [search, selectedCategory]);

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
                    <button key={product.id} onClick={() => onAddProduct(product, 1)} className="w-full flex items-center gap-3 p-2 bg-gray-800 rounded-md hover:bg-gray-600 transition-colors text-left">
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

interface TableDetailScreenProps {
    tables: Table[];
    orders: Order[];
    onPlaceOrder: (order: Order) => void;
    onUpdateTableStatus: (tableId: string, status: Table['status'], orderId?: string) => void;
}

const TableDetailScreen: React.FC<TableDetailScreenProps> = ({ tables, orders, onPlaceOrder, onUpdateTableStatus }) => {
    const { tableId } = useParams<{ tableId: string }>();
    const navigate = useNavigate();
    
    const table = useMemo(() => tables.find(t => t.id === tableId), [tables, tableId]);
    const [currentOrderItems, setCurrentOrderItems] = useState<CartItem[]>([]);
    
    const order = useMemo(() => {
        if (!table || !table.currentOrderId) {
            setCurrentOrderItems([]);
            return null;
        }
        const existingOrder = orders.find(o => o.id === table.currentOrderId);
        if (existingOrder) {
            setCurrentOrderItems(existingOrder.items);
        } else {
             setCurrentOrderItems([]);
        }
        return existingOrder || null;
    }, [orders, table]);

    const subtotal = useMemo(() => currentOrderItems.reduce((sum, item) => sum + item.totalPrice, 0), [currentOrderItems]);
    const serviceFee = subtotal * 0.10;
    const total = subtotal + serviceFee;

    const handleAddProduct = useCallback((product: Product, quantity: number) => {
        setCurrentOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id && !item.selectedOptions); // Simple check for now
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * product.price }
                        : item
                );
            } else {
                return [...prevItems, { product, quantity, totalPrice: product.price * quantity, selectedOptions: [] }];
            }
        });
    }, []);

    const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCurrentOrderItems(prev => prev.filter(item => item.product.id !== productId));
        } else {
            setCurrentOrderItems(prev => prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.product.price }
                    : item
            ));
        }
    }, []);

    const handleStartOrder = () => {
        if (!table) return;
        
        const newOrder: Order = {
            id: `order-table-${table.id}-${Date.now()}`,
            userId: 'employee',
            restaurantId: 'rest1',
            restaurantName: 'Burguer Queen',
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
        onPlaceOrder(newOrder);
        // Note: The parent component (App.tsx) will update the table status when it receives the new order.
    };

    const handleUpdateOrder = () => {
        // In a real app, this would be a PATCH request to the backend with the new `currentOrderItems`.
        // For this mock, we can update the parent state if we pass down a handler.
        // Or, for simplicity, just alert the user.
        console.log("Updating order with items:", currentOrderItems);
        alert("Comanda atualizada! (simulação)");
    };

    const handleCloseBill = () => {
        if (!table) return;
        onUpdateTableStatus(table.id, 'Pagando');
    };

    const handleFinalizePayment = () => {
        if (!table) return;
        onUpdateTableStatus(table.id, 'Livre');
        // Here you would also update the order status to DELIVERED
        navigate(ROUTE_PATHS.EMPLOYEE_DASHBOARD);
    };

    if (!table) return <div>Mesa não encontrada</div>;

    const hasActiveOrder = table.status !== 'Livre';

    return (
        <div className="flex h-[calc(100vh-60px)]">
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
                            {currentOrderItems.map(item => (
                                <div key={item.product.id} className="bg-gray-700 p-3 rounded-md flex items-center gap-3">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-md object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{item.product.name}</p>
                                        <p className="text-xs text-gray-400">R$ {item.product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)} className="p-1 bg-gray-600 rounded-full"><MinusIcon className="w-4 h-4"/></button>
                                        <span className="w-6 text-center font-bold">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)} className="p-1 bg-gray-600 rounded-full"><PlusIcon className="w-4 h-4"/></button>
                                    </div>
                                    <p className="font-bold w-16 text-right">R$ {item.totalPrice.toFixed(2)}</p>
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
                                    <button onClick={handleUpdateOrder} className="w-full py-3 bg-blue-600 rounded-md font-semibold hover:bg-blue-500">
                                        Atualizar Comanda
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="py-3 bg-gray-600 rounded-md font-semibold hover:bg-gray-500 flex items-center justify-center gap-2">
                                            <PrinterIcon className="w-5 h-5"/>
                                            Imprimir
                                        </button>
                                        <button onClick={handleCloseBill} className="py-3 bg-yellow-600 rounded-md font-semibold hover:bg-yellow-500 flex items-center justify-center gap-2">
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
                    <ProductSelector onAddProduct={handleAddProduct} />
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