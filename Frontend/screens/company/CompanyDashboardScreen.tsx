

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Order, OrderStatus, DeliveryType, CartItem, Product, SelectedProductOption, Address, Table } from '../../types';
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_RESTAURANTS, MOCK_USER, MOCK_TABLES } from '../../data';
import { 
    PlusIcon, PhoneIcon, ComputerDesktopIcon, PrinterIcon, XMarkIcon, 
    TrashIcon, PencilIcon, DeliveryScooterIcon, PickupBuildingIcon, SearchIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon,
    ChevronDoubleLeftIcon, ChevronDoubleRightIcon, TableCellsIcon
} from '../../icons';


// --- Reusable Components ---
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-800/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </label>
);

// --- KANBAN CARD ---
const KanbanOrderCard: React.FC<{ order: Order; onCardClick: (order: Order) => void; }> = ({ order, onCardClick }) => {
    const [isExpanded, setIsExpanded] = useState(
        order.status === OrderStatus.PLACED || order.status === OrderStatus.PREPARING
    );

    const timeSinceOrder = useMemo(() => {
        const minutes = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);
        if (minutes < 1) return "agora";
        return `${minutes} min`;
    }, [order.createdAt]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("orderId", order.id);
    };
    
    const toggleExpansion = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the detail modal when clicking the arrow
        setIsExpanded(prev => !prev);
    };
    
    const cardColorClass = order.tableName ? 'border-t-purple-500' : (order.isLocal ? 'border-t-green-500' : 'border-t-blue-500');

    return (
        <div 
            draggable 
            onDragStart={handleDragStart}
            onClick={() => onCardClick(order)}
            className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-3 cursor-pointer hover:shadow-md hover:border-gray-800 transition-all ${cardColorClass} border-t-4`}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 truncate pr-2">{order.customerName}</h4>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">#{order.id.slice(-6)}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                {order.tableName ? (
                    <div className="flex items-center gap-1 text-purple-700 font-medium" title={`Pedido da ${order.tableName}`}>
                        <TableCellsIcon className="w-4 h-4"/>
                        <span>{order.tableName}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1" title={order.isLocal ? 'Pedido Local' : 'Pedido do App'}>
                        {order.isLocal ? <PhoneIcon className="w-4 h-4"/> : <ComputerDesktopIcon className="w-4 h-4"/>}
                        <span>{order.isLocal ? 'Local' : 'App'}</span>
                    </div>
                )}

                <div className="flex items-center gap-1" title={order.deliveryType === 'DELIVERY' ? 'Entrega' : 'Retirada'}>
                    {order.deliveryType === 'DELIVERY' ? <DeliveryScooterIcon className="w-4 h-4"/> : <PickupBuildingIcon className="w-4 h-4"/>}
                    <span>{order.deliveryType}</span>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-700 space-y-1.5">
                    <h5 className="font-semibold text-gray-800">Itens:</h5>
                    {order.items.map((item, index) => (
                        <div key={index}>
                            <p><span className="font-semibold">{item.quantity}x</span> {item.product.name}</p>
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                <p className="pl-3 text-gray-500 text-[11px]">&#9679; {item.selectedOptions.map(opt => opt.choiceName).join(', ')}</p>
                            )}
                            {item.observations && (
                                <p className="pl-3 text-gray-500 text-[11px] italic">Obs: {item.observations}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <div className="flex justify-between items-end mt-3">
                <span className="text-sm font-semibold text-green-600">R$ {order.total.toFixed(2)}</span>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">{timeSinceOrder}</span>
                    <button onClick={toggleExpansion} className="p-1 -mr-1 rounded-full hover:bg-gray-200" aria-label={isExpanded ? 'Recolher' : 'Expandir'}>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPLETED ORDER CARD ---
const CompletedOrderCard: React.FC<{ order: Order; onCardClick: (order: Order) => void; }> = ({ order, onCardClick }) => {
    const isDelivered = order.status === OrderStatus.DELIVERED;
    return (
        <div onClick={() => onCardClick(order)} className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 mb-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0">
                     {isDelivered ? <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" /> : <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    <span className="font-semibold text-sm text-gray-700 truncate">{order.customerName}</span>
                </div>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">#{order.id.slice(-6)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-gray-800">R$ {order.total.toFixed(2)}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDelivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {order.status}
                </span>
            </div>
        </div>
    );
};


// --- ORDER DETAIL MODAL ---
const OrderDetailModal: React.FC<{
    order: Order | null;
    onClose: () => void;
    onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
    onCancelOrder: (orderId: string) => void;
}> = ({ order, onClose, onUpdateStatus, onCancelOrder }) => {
    if (!order) return null;

    const handlePrint = () => alert("Simulando impressão do pedido para a cozinha...");
    
    const handleCancel = () => {
        if (window.confirm(`Tem certeza que deseja cancelar o pedido #${order.id.slice(-6)}?`)) {
            onCancelOrder(order.id);
        }
    }

    const renderActionButtons = () => {
        switch (order.status) {
            case OrderStatus.PLACED:
                return (
                    <button onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)} className="w-full btn-primary">
                        Aceitar e Preparar
                    </button>
                );
            case OrderStatus.PREPARING:
                return (
                    <button onClick={() => onUpdateStatus(order.id, OrderStatus.READY)} className="w-full btn-primary">
                        Marcar como Pronto
                    </button>
                );
            case OrderStatus.READY:
                if (order.deliveryType === 'DELIVERY') {
                    return (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)} className="w-full btn-primary flex items-center justify-center gap-2">
                            <DeliveryScooterIcon className="w-5 h-5"/>
                            Enviar para Entrega
                        </button>
                    );
                } else { // PICKUP
                    return (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)} className="w-full btn-primary flex items-center justify-center gap-2">
                            <CheckCircleIcon className="w-5 h-5"/>
                            Confirmar Retirada
                        </button>
                    );
                }
            case OrderStatus.OUT_FOR_DELIVERY:
                 return (
                    <button onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)} className="w-full btn-primary flex items-center justify-center gap-2">
                        <CheckCircleIcon className="w-5 h-5"/>
                        Confirmar Entrega
                    </button>
                );
            default:
                return null;
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-xl">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Detalhes do Pedido</h2>
                        <p className="text-sm text-gray-500 font-mono">#{order.id.slice(-6)}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto">
                    {/* Customer Info */}
                    <div className="bg-white p-3 rounded-lg border text-sm text-gray-700">
                        <h3 className="font-semibold text-gray-900 mb-2 text-base">Cliente</h3>
                        <p><strong>Nome:</strong> {order.customerName}</p>
                        {order.customerPhone && <p><strong>Telefone:</strong> {order.customerPhone}</p>}
                        {order.deliveryType === 'DELIVERY' && 
                            <p><strong>Endereço:</strong> {`${order.deliveryAddress.street}, ${order.deliveryAddress.number}`}</p>
                        }
                         <p><strong>Tipo:</strong> {order.deliveryType === 'DELIVERY' ? 'Entrega' : 'Retirada'}</p>
                    </div>
                    {/* Items */}
                    <div className="bg-white p-3 rounded-lg border">
                         <h3 className="font-semibold text-gray-900 mb-2 text-base">Itens do Pedido</h3>
                         <div className="space-y-3">
                             {order.items.map((item, index) => (
                                 <div key={index} className="flex gap-3 items-start">
                                     <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 object-cover rounded-md flex-shrink-0"/>
                                     <div className="flex-1">
                                        <p className="font-semibold text-sm text-gray-900">{item.quantity}x {item.product.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.product.description}</p>
                                        {item.selectedOptions && item.selectedOptions.length > 0 &&
                                            <p className="text-xs text-gray-600 mt-1">&#9679; {item.selectedOptions.map(opt => opt.choiceName).join(', ')}</p>
                                        }
                                        {item.observations && (
                                            <p className="text-xs text-gray-500 italic mt-1">Obs: {item.observations}</p>
                                        )}
                                     </div>
                                     <p className="text-sm font-semibold text-gray-900">R$ {item.totalPrice.toFixed(2)}</p>
                                 </div>
                             ))}
                         </div>
                    </div>
                    {/* Summary */}
                    <div className="bg-white p-3 rounded-lg border text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-900">R$ {order.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Taxa de Entrega</span><span className="font-medium text-gray-900">R$ {order.deliveryFee.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Desconto</span><span className="font-medium text-red-600">- R$ {order.discount.toFixed(2)}</span></div>
                        <hr className="my-1"/>
                        <div className="flex justify-between font-bold text-base text-gray-900"><span>Total</span><span>R$ {order.total.toFixed(2)}</span></div>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white border-t rounded-b-xl">
                    <button onClick={handlePrint} className="btn-secondary flex items-center justify-center gap-2"><PrinterIcon className="w-5 h-5"/>Imprimir</button>
                    {order.isLocal && <button className="btn-secondary flex items-center justify-center gap-2"><PencilIcon className="w-5 h-5"/>Editar</button>}
                    {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED &&
                        <button onClick={handleCancel} className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-500">Cancelar</button>
                    }
                    <div className="col-span-full sm:col-span-1 sm:col-start-3">
                         {renderActionButtons()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CREATE ORDER MODAL ---
const CreateOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: Order) => void;
  tables: Table[];
}> = ({ isOpen, onClose, onCreateOrder, tables }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deliveryType, setDeliveryType] = useState<DeliveryType>('PICKUP');
    const [address, setAddress] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [initialStatus, setInitialStatus] = useState<OrderStatus>(OrderStatus.PLACED);
    const [selectedTableId, setSelectedTableId] = useState('');

    const availableTables = useMemo(() => tables.filter(t => t.status === 'Livre'), [tables]);

    useEffect(() => {
        if (selectedTableId) {
            const table = tables.find(t => t.id === selectedTableId);
            if (table) {
                setCustomerName(table.name);
                setDeliveryType('PICKUP');
            }
        } else {
            // Optional: reset name if user deselects table, or leave it for manual editing
            // setCustomerName(''); 
        }
    }, [selectedTableId, tables]);

    const filteredProducts = useMemo(() => {
        if (!productSearch) return [];
        return MOCK_PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [productSearch]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
    const deliveryFee = deliveryType === 'DELIVERY' ? 5.00 : 0; // Fixed fee for local orders
    const total = subtotal + deliveryFee;

    const resetState = useCallback(() => {
        setCustomerName('');
        setCustomerPhone('');
        setDeliveryType('PICKUP');
        setAddress('');
        setCart([]);
        setProductSearch('');
        setInitialStatus(OrderStatus.PLACED);
        setSelectedTableId('');
    }, []);

    useEffect(() => {
        if (isOpen) {
            resetState();
        }
    }, [isOpen, resetState]);

    const addToCart = (product: Product, quantity: number, selectedOptions: SelectedProductOption[], observations?: string) => {
        const priceWithOptions = product.price + (selectedOptions.reduce((sum, opt) => sum + (opt.priceAdjustment || 0), 0));
        const newItem: CartItem = {
            product,
            quantity,
            selectedOptions,
            observations,
            totalPrice: priceWithOptions * quantity,
        };
        setCart(prev => [...prev, newItem]);
        setProductSearch('');
    };
    
    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    }
    
    const handleCreateOrder = () => {
        if (!customerName || cart.length === 0) {
            alert("Nome do cliente e pelo menos um item são obrigatórios.");
            return;
        }

        const table = selectedTableId ? tables.find(t => t.id === selectedTableId) : null;

        const newOrder: Order = {
            id: `local-${Date.now()}`,
            userId: 'local',
            restaurantId: 'rest1',
            restaurantName: MOCK_RESTAURANTS[0].name,
            items: cart,
            subtotal,
            deliveryFee,
            discount: 0,
            total,
            status: initialStatus,
            deliveryAddress: { id:'local', street: address, number: '', city: '', state: '', zip: '', neighborhood:'' },
            paymentMethod: 'Local',
            createdAt: new Date().toISOString(),
            deliveryType: table ? 'PICKUP' : deliveryType,
            isLocal: true,
            customerName,
            customerPhone,
            tableId: table?.id,
            tableName: table?.name,
        };
        onCreateOrder(newOrder);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-xl">
                    <h2 className="text-lg font-bold text-gray-800">Criar Pedido Local</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Customer & Delivery */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mesa (Opcional)</label>
                            <select
                                value={selectedTableId}
                                onChange={e => setSelectedTableId(e.target.value)}
                                className="input px-3 py-2 bg-white"
                            >
                                <option value="">Pedido avulso (sem mesa)</option>
                                {availableTables.map(table => (
                                    <option key={table.id} value={table.id}>{table.name}</option>
                                ))}
                            </select>
                        </div>
                        <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Telefone (Opcional)" className="input px-3 py-2 self-end" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nome do Cliente*" className="input px-3 py-2" required disabled={!!selectedTableId}/>
                        <div className="flex gap-2">
                            <button onClick={() => setDeliveryType('PICKUP')} className={`flex-1 btn-secondary ${deliveryType === 'PICKUP' && 'bg-gray-800 text-white border-gray-800'}`} disabled={!!selectedTableId}>Retirada</button>
                            <button onClick={() => setDeliveryType('DELIVERY')} className={`flex-1 btn-secondary ${deliveryType === 'DELIVERY' && 'bg-gray-800 text-white border-gray-800'}`} disabled={!!selectedTableId}>Entrega</button>
                        </div>
                    </div>
                    {deliveryType === 'DELIVERY' && !selectedTableId && <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Endereço de Entrega*" className="input px-3 py-2" required />}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status Inicial do Pedido</label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setInitialStatus(OrderStatus.PLACED)}
                                className={`flex-1 btn-secondary text-sm py-2 ${initialStatus === OrderStatus.PLACED ? 'bg-gray-800 text-white border-gray-800' : ''}`}
                            >
                                Novo
                            </button>
                            <button
                                type="button"
                                onClick={() => setInitialStatus(OrderStatus.PREPARING)}
                                className={`flex-1 btn-secondary text-sm py-2 ${initialStatus === OrderStatus.PREPARING ? 'bg-gray-800 text-white border-gray-800' : ''}`}
                            >
                                Em Preparo
                            </button>
                            <button
                                type="button"
                                onClick={() => setInitialStatus(OrderStatus.READY)}
                                className={`flex-1 btn-secondary text-sm py-2 ${initialStatus === OrderStatus.READY ? 'bg-gray-800 text-white border-gray-800' : ''}`}
                            >
                                Pronto
                            </button>
                            <button
                                type="button"
                                onClick={() => setInitialStatus(OrderStatus.OUT_FOR_DELIVERY)}
                                className={`flex-1 btn-secondary text-sm py-2 ${initialStatus === OrderStatus.OUT_FOR_DELIVERY ? 'bg-gray-800 text-white border-gray-800' : ''}`}
                            >
                                Saiu p/ Entrega
                            </button>
                        </div>
                    </div>
                    
                    {/* Add Product */}
                    <div>
                        <div className="relative">
                            <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Buscar produto..." className="input py-2 pl-10 pr-3" />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {filteredProducts.length > 0 && (
                            <div className="border rounded-md mt-1 max-h-48 overflow-y-auto bg-white shadow">
                                {filteredProducts.map(p => <ProductSelectorItem key={p.id} product={p} onSelect={addToCart} />)}
                            </div>
                        )}
                    </div>

                    {/* Cart */}
                    <div className="space-y-2">
                        {cart.length === 0 ? <p className="text-center text-gray-500 py-4">O carrinho está vazio.</p> :
                         cart.map((item, index) => (
                            <div key={index} className="bg-white p-2 rounded-md border flex items-center gap-3">
                                <img src={item.product.imageUrl} className="w-10 h-10 rounded object-cover" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-800">{item.product.name}</p>
                                    <p className="text-xs text-gray-500">{item.selectedOptions?.map(o => o.choiceName).join(', ')}</p>
                                </div>
                                <p className="font-semibold text-sm">{item.quantity}x</p>
                                <p className="font-semibold text-sm">R${item.totalPrice.toFixed(2)}</p>
                                <button onClick={() => removeFromCart(index)} className="p-1.5 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                         ))
                        }
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-between items-center bg-white border-t rounded-b-xl">
                    <div>
                        <span className="text-sm text-gray-600">Total:</span>
                        <p className="text-xl font-bold text-gray-900">R$ {total.toFixed(2)}</p>
                    </div>
                    <button onClick={handleCreateOrder} className="btn-primary">Criar Pedido</button>
                </div>
            </div>
        </div>
    )
}

const ProductSelectorItem: React.FC<{product: Product; onSelect: Function}> = ({product, onSelect}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<SelectedProductOption[]>([]);
    const [isConfiguring, setIsConfiguring] = useState(false);
    
    const handleSelect = () => {
        if (!product.options || product.options.length === 0) {
            onSelect(product, 1, []);
        } else {
            setIsConfiguring(true);
        }
    }
    
    const handleConfirmSelection = () => {
        const requiredGroups = product.options?.filter(g => g.required).map(g => g.name) || [];
        const selectedGroups = [...new Set(selectedOptions.map(o => o.groupName))];
        const missingRequired = requiredGroups.filter(rg => !selectedGroups.includes(rg));
        if (missingRequired.length > 0) {
            alert(`Selecione uma opção para: ${missingRequired.join(', ')}`);
            return;
        }
        onSelect(product, quantity, selectedOptions);
        setIsConfiguring(false);
    }
    
    const handleOptionChange = (groupName: string, choiceName: string, price:number, type:'single'|'multiple', isSelected:boolean) => {
        setSelectedOptions(prev => {
            let newOptions = [...prev];
            if (type === 'single') newOptions = newOptions.filter(o => o.groupName !== groupName);
            if (isSelected) newOptions.push({groupName, choiceName, priceAdjustment: price});
            else newOptions = newOptions.filter(o => !(o.groupName === groupName && o.choiceName === choiceName));
            return newOptions;
        })
    }

    if(isConfiguring){
        return (
            <div className="p-3 border-t">
                 <p className="font-bold text-gray-800">{product.name}</p>
                 {product.options?.map(group => (
                     <div key={group.id} className="my-2">
                        <h4 className="font-semibold text-sm text-gray-800">{group.name} {group.required && '*'}</h4>
                        {group.choices.map(choice => (
                            <label key={choice.name} className="flex items-center gap-2 text-sm text-gray-700">
                                <input type={group.type === 'single' ? 'radio' : 'checkbox'} name={group.id} onChange={e => handleOptionChange(group.name, choice.name, choice.priceAdjustment || 0, group.type, e.target.checked)} />
                                {choice.name} {choice.priceAdjustment ? `(+R$${choice.priceAdjustment.toFixed(2)})` : ''}
                            </label>
                        ))}
                     </div>
                 ))}
                 <div className="flex items-center gap-4 mt-2">
                    <button onClick={handleConfirmSelection} className="btn-primary text-sm py-1">Adicionar ao Pedido</button>
                    <button onClick={() => setIsConfiguring(false)} className="btn-secondary text-sm py-1">Cancelar</button>
                 </div>
            </div>
        )
    }

    return (
        <div onClick={handleSelect} className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between items-center">
            <span className="text-gray-700">{product.name}</span>
            <span className="text-gray-700 font-semibold">R${product.price.toFixed(2)}</span>
        </div>
    )
}

interface CompanyDashboardScreenProps {
  isStoreOpen: boolean;
  onToggleStoreOpen: () => void;
}

const CompanyDashboardScreen: React.FC<CompanyDashboardScreenProps> = ({ isStoreOpen, onToggleStoreOpen }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  const [activeColumns] = useState<OrderStatus[]>([OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.OUT_FOR_DELIVERY]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCompletedSidebarCollapsed, setIsCompletedSidebarCollapsed] = useState(false);
  const [draggingOverColumn, setDraggingOverColumn] = useState<OrderStatus | null>(null);
  const [isDraggingOverCompleted, setIsDraggingOverCompleted] = useState(false);
  
  const updateLocalTableStatus = useCallback((tableId: string, status: Table['status'], orderId?: string) => {
    setTables(prevTables => prevTables.map(t => 
        t.id === tableId ? { ...t, status, currentOrderId: status === 'Livre' ? undefined : (orderId || t.currentOrderId) } : t
    ));
  }, []);

  useEffect(() => {
    const newOrderSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaXRyYXRlCTEyOCBrYnBzAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAAASwAAMPVAAA1QAAAAPgAZGZmp945Yk9jZlpjTTNBTd2g2tBwAANIAAAAAINm/9k=');

    const timeoutId = setTimeout(() => {
        const newOrder: Order = {
            id: `order-${Date.now()}`,
            userId: 'user1',
            restaurantId: 'rest1',
            restaurantName: 'Burguer Queen',
            items: [{
                product: MOCK_PRODUCTS[0],
                quantity: 1,
                totalPrice: MOCK_PRODUCTS[0].price,
            }],
            subtotal: MOCK_PRODUCTS[0].price,
            deliveryFee: 5.00,
            discount: 0,
            total: MOCK_PRODUCTS[0].price + 5.00,
            status: OrderStatus.PLACED,
            deliveryAddress: { id: 'addr1', street: 'Rua Teste', number: '123', neighborhood: 'Bairro', city: 'Matelândia', state: 'PR', zip: '85887-000' },
            paymentMethod: 'Pix',
            createdAt: new Date().toISOString(),
            deliveryType: 'DELIVERY',
            isLocal: false,
            customerName: 'Novo Cliente App',
        };
        setOrders(prev => [newOrder, ...prev]);
        newOrderSound.play().catch(e => console.error("Erro ao reproduzir som:", e));
    }, 20000); // New order every 20 seconds for demo

    return () => clearTimeout(timeoutId);
  }, []);

  const { activeOrders, completedOrders } = useMemo(() => {
        const active: Order[] = [];
        const completed: Order[] = [];
        for (const order of orders) {
            if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
                completed.push(order);
            } else {
                active.push(order);
            }
        }
        completed.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return { activeOrders: active, completedOrders: completed };
    }, [orders]);


  const columnMap: { [key in OrderStatus]?: string } = {
    [OrderStatus.PLACED]: 'Novos',
    [OrderStatus.PREPARING]: 'Em Preparo',
    [OrderStatus.READY]: 'Prontos',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Em Entrega',
  };

  const columnStyles: { [key in OrderStatus]?: { bg: string, text: string, countBg: string, countText: string } } = {
    [OrderStatus.PLACED]: { bg: 'bg-blue-100', text: 'text-blue-800', countBg: 'bg-blue-200', countText: 'text-blue-900' },
    [OrderStatus.PREPARING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', countBg: 'bg-yellow-200', countText: 'text-yellow-900' },
    [OrderStatus.READY]: { bg: 'bg-purple-100', text: 'text-purple-800', countBg: 'bg-purple-200', countText: 'text-purple-900' },
    [OrderStatus.OUT_FOR_DELIVERY]: { bg: 'bg-cyan-100', text: 'text-cyan-800', countBg: 'bg-cyan-200', countText: 'text-cyan-900' },
  };


  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    let orderToUpdate: Order | undefined;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        orderToUpdate = o;
        return { ...o, status: newStatus, trackingLog: [...(o.trackingLog || []), { status: newStatus, timestamp: new Date().toISOString() }] };
      }
      return o;
    }));
    
    if (newStatus === OrderStatus.DELIVERED || newStatus === OrderStatus.CANCELLED) {
        if (orderToUpdate?.tableId) {
            updateLocalTableStatus(orderToUpdate.tableId, 'Livre');
        }
        setSelectedOrder(null);
    } else {
        setSelectedOrder(prev => (prev && prev.id === orderId ? { ...prev, status: newStatus } : prev));
    }
  };
  
  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.CANCELLED);
  }

  const handleCreateOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    if (order.tableId) {
      updateLocalTableStatus(order.tableId, 'Ocupada', order.id);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: OrderStatus) => {
    e.preventDefault();
    setDraggingOverColumn(null);
    const orderId = e.dataTransfer.getData("orderId");
    if (orderId && ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(newStatus)) {
        updateOrderStatus(orderId, newStatus);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: OrderStatus) => {
    e.preventDefault();
    setDraggingOverColumn(status);
  };
  
  const handleDragLeave = () => {
      setDraggingOverColumn(null);
  }

  const handleDropOnCompleted = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverCompleted(false);
    const orderId = e.dataTransfer.getData("orderId");
    const order = orders.find(o => o.id === orderId);
    if (order && ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
        updateOrderStatus(orderId, OrderStatus.DELIVERED);
        if (isCompletedSidebarCollapsed) {
            setIsCompletedSidebarCollapsed(false);
        }
    }
  };

  const handleDragOverCompleted = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverCompleted(true);
  };

  const handleDragLeaveCompleted = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingOverCompleted(false);
  };

  return (
    <div className="flex h-full bg-gray-100">
      <style>{`.btn-primary { background-color: #1f2937; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s; } .btn-primary:hover { background-color: #374151; } .btn-secondary { background-color: white; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; border: 1px solid #d1d5db; transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; } .btn-secondary:hover { background-color: #f3f4f6; } .input { border: 1px solid #d1d5db; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { ring: 1; border-color: #1f2937; outline:none; }`}</style>
      <div className="flex-1 flex flex-col">
        <header className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Painel de Pedidos</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isStoreOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {isStoreOpen ? 'Loja Aberta' : 'Loja Fechada'}
                    </span>
                    <ToggleSwitch checked={isStoreOpen} onChange={onToggleStoreOpen} />
                </div>
                <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
                >
                <PlusIcon className="w-5 h-5"/>
                Criar Pedido Local
                </button>
            </div>
        </header>

        <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
            {activeColumns.map(status => {
            const ordersInColumn = activeOrders.filter(o => o.status === status);
            const columnStyle = columnStyles[status] || { bg: 'bg-gray-100', text: 'text-gray-800', countBg: 'bg-gray-200', countText: 'text-gray-900'};

            return (
                <div 
                    key={status}
                    onDrop={(e) => handleDrop(e, status)}
                    onDragOver={(e) => handleDragOver(e, status)}
                    onDragLeave={handleDragLeave}
                    className={`bg-gray-200/70 p-3 rounded-lg flex flex-col border-2 transition-colors ${draggingOverColumn === status ? 'border-blue-500' : 'border-transparent'}`}
                >
                <h3 className={`font-bold p-2 mb-2 flex items-center justify-between rounded-md ${columnStyle.bg} ${columnStyle.text}`}>
                    <span>{columnMap[status]}</span>
                    <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${columnStyle.countBg} ${columnStyle.countText}`}>{ordersInColumn.length}</span>
                </h3>
                <div className="flex-1 overflow-y-auto pr-1">
                    {ordersInColumn
                        .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map(order => (
                        <KanbanOrderCard key={order.id} order={order} onCardClick={setSelectedOrder} />
                    ))}
                </div>
                </div>
            )
            })}
        </main>
      </div>
      
      <aside
        onDrop={handleDropOnCompleted}
        onDragOver={handleDragOverCompleted}
        onDragLeave={handleDragLeaveCompleted}
        className={`bg-gray-200 border-l border-gray-300 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${isCompletedSidebarCollapsed ? 'w-20' : 'w-72'} ${isDraggingOverCompleted ? 'bg-blue-100 border-l-blue-500' : ''}`}
      >
          <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between">
                <h2 className={`font-bold text-gray-700 text-lg whitespace-nowrap overflow-hidden transition-all duration-200 ${isCompletedSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    Finalizados
                </h2>
                <button
                    onClick={() => setIsCompletedSidebarCollapsed(prev => !prev)}
                    className="p-1 rounded-full hover:bg-gray-200"
                    title={isCompletedSidebarCollapsed ? 'Expandir' : 'Recolher'}
                >
                    {isCompletedSidebarCollapsed ? <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-600" /> : <ChevronDoubleRightIcon className="w-5 h-5 text-gray-600" />}
                </button>
          </div>
            <div className="flex-1 overflow-hidden relative">
                <div className={`h-full overflow-y-auto p-2 transition-opacity duration-200 ${isCompletedSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {completedOrders.length > 0 ? (
                        completedOrders.map(order => (
                            <CompletedOrderCard key={order.id} order={order} onCardClick={setSelectedOrder} />
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500 p-4">Nenhum pedido finalizado.</p>
                    )}
                </div>
                {isCompletedSidebarCollapsed && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <CheckCircleIcon className={`w-10 h-10 text-gray-400 transition-transform duration-200 ${isDraggingOverCompleted ? 'scale-125 text-blue-500' : ''}`} />
                    </div>
                )}
            </div>
      </aside>

      {selectedOrder && (
          <OrderDetailModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onUpdateStatus={updateOrderStatus}
            onCancelOrder={cancelOrder}
          />
      )}
      
      <CreateOrderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateOrder={handleCreateOrder}
        tables={tables}
      />

    </div>
  );
};

export default CompanyDashboardScreen;
