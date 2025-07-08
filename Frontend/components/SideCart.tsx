
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, DeliveryType, Coupon, SelectedProductOption } from '../types';
import { ROUTE_PATHS } from '../constants';
import { MOCK_RESTAURANTS } from '../data';
import {
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
  TicketIcon,
  QuestionMarkCircleIcon,
  CartIcon
} from '../icons';

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateCartItemQuantity: (productId: string, newQuantity: number, selectedOptions?: SelectedProductOption[]) => void;
  removeFromCart: (productId: string, selectedOptions?: SelectedProductOption[]) => void;
  deliveryType: DeliveryType;
  userCoupons: Coupon[];
}

const SideCart: React.FC<SideCartProps> = ({ isOpen, onClose, cartItems, updateCartItemQuantity, removeFromCart, deliveryType, userCoupons }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const restaurantId = cartItems[0]?.product.restaurantId;
  const restaurant = restaurantId ? MOCK_RESTAURANTS.find(r => r.id === restaurantId) : null;
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceFee = 0.99; // As per user request
  const deliveryFee = deliveryType === 'DELIVERY' ? (restaurant?.deliveryFee ?? 0) : 0;
  const total = subtotal + serviceFee + deliveryFee;

  const handleCheckout = () => {
    onClose();
    navigate(ROUTE_PATHS.CHECKOUT);
  }

  const handleEditItem = (item: CartItem) => {
    onClose();
    navigate(ROUTE_PATHS.PRODUCT_DETAIL.replace(':storeId', item.product.restaurantId).replace(':productId', item.product.id));
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="side-cart-title">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 side-cart-overlay z-50"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      ></div>
      
      {/* Panel */}
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-appBg flex flex-col side-cart-panel z-[60] shadow-2xl"
        style={{ transform: isOpen ? 'translateX(0%)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-appBorderLight">
            <h2 id="side-cart-title" className="text-xl font-bold text-appTextPrimary">Seu Pedido</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-appHeaderButtonBg" aria-label="Fechar carrinho">
                <ChevronRightIcon className="w-6 h-6 text-appTextSecondary" />
            </button>
        </div>

        {cartItems.length > 0 && restaurant ? (
          <>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* Restaurant Info */}
                <div className="text-center">
                    <p className="text-sm text-appTextSecondary">Seu pedido em</p>
                    <h3 className="text-lg font-semibold text-appTextPrimary">{restaurant.name}</h3>
                    <Link to={ROUTE_PATHS.STORE_DETAIL.replace(':storeId', restaurant.id)} onClick={onClose} className="text-sm text-appTextPrimary hover:underline">
                        Ver Cardápio
                    </Link>
                </div>
              
                {/* Items */}
                <div className="space-y-3">
                    {cartItems.map((item, index) => (
                        <div key={`${item.product.id}-${index}-${JSON.stringify(item.selectedOptions)}`} className="bg-white p-3 rounded-lg flex gap-3 border border-appBorderLight">
                            <div className="flex-shrink-0">
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-appTextPrimary truncate">{item.product.name}</p>
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                    <p className="text-xs text-appTextSecondary truncate">
                                        {item.selectedOptions.map(opt => opt.choiceName).join(', ')}
                                    </p>
                                )}
                                <p className="font-bold text-green-600">R$ {item.totalPrice.toFixed(2)}</p>
                                <div className="flex items-center gap-4 text-xs mt-1">
                                    <button onClick={() => handleEditItem(item)} className="text-appTextSecondary hover:underline">Editar</button>
                                    <button onClick={() => removeFromCart(item.product.id, item.selectedOptions)} className="text-red-600 hover:underline">Remover</button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <button onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1, item.selectedOptions)} className="p-1.5" aria-label="Aumentar quantidade"><PlusIcon className="w-4 h-4 text-appTextPrimary" /></button>
                                <span className="font-bold text-lg">{item.quantity}</span>
                                <button onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1, item.selectedOptions)} className="p-1.5" aria-label="Diminuir quantidade"><MinusIcon className="w-4 h-4 text-appTextPrimary" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coupon */}
                <div className="bg-white p-3 rounded-lg border border-appBorderLight flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <TicketIcon className="w-5 h-5 text-appTextSecondary" />
                        <span className="text-appTextPrimary font-medium">Cupom</span>
                    </div>
                    {userCoupons.length > 0 ? (
                        <Link to={ROUTE_PATHS.COUPONS} onClick={onClose} className="text-sm text-green-600 hover:underline font-semibold">
                            {userCoupons.length} cupom disponível
                        </Link>
                    ) : (
                         <Link to={ROUTE_PATHS.COUPONS} onClick={onClose} className="text-sm text-appTextPrimary hover:underline">
                            Adicionar cupom
                        </Link>
                    )}
                </div>
            </div>

            {/* Footer / Summary */}
            <div className="p-4 border-t border-appBorderLight bg-white space-y-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-appTextSecondary">Subtotal</span>
                  <span className="text-appTextPrimary">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-appTextSecondary">
                    Taxa de Serviço
                    <span title="Taxa para manutenção da plataforma.">
                        <QuestionMarkCircleIcon className="w-4 h-4"/>
                    </span>
                  </span>
                  <span className="text-appTextPrimary">R$ {serviceFee.toFixed(2)}</span>
                </div>
                {deliveryType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span className="text-appTextSecondary">Taxa de entrega</span>
                    <span className="text-appTextPrimary">R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-lg font-bold text-appTextPrimary">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Escolher forma de pagamento
              </button>
            </div>
          </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <CartIcon className="w-24 h-24 text-appTextSecondary/30 mb-6" />
                <h2 className="text-2xl font-semibold text-appTextPrimary mb-2">Seu carrinho está vazio</h2>
                <p className="text-appTextSecondary mb-6">Adicione itens para fazer um pedido.</p>
                <Link 
                  to={ROUTE_PATHS.HOME} 
                  onClick={onClose}
                  className="px-6 py-3 bg-appPrimaryActionBg text-appPrimaryActionText rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Ver restaurantes
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default SideCart;
