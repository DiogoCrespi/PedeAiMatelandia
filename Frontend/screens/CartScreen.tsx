


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, SelectedProductOption, DeliveryType, Restaurant, Coupon } from '../types';
import { ROUTE_PATHS } from '../constants';
import * as api from '../api';
import { PlusIcon, MinusIcon, TrashIcon, CartIcon } from '../icons';
import DeliveryTypeSelector from '../components/DeliveryTypeSelector';
import CouponInputForm from '../components/CouponInputForm';


interface CartScreenProps {
  cartItems: CartItem[];
  updateCartItemQuantity: (productId: string, newQuantity: number, selectedOptions?: SelectedProductOption[]) => void;
  removeFromCart: (productId: string, selectedOptions?: SelectedProductOption[]) => void;
  clearCart: () => void;
  deliveryType: DeliveryType;
  onDeliveryTypeChange: (type: DeliveryType) => void;
  appliedCoupon: Coupon | null;
  couponError: string;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  isCouponLoading: boolean;
}

const CartScreen: React.FC<CartScreenProps> = ({ cartItems, updateCartItemQuantity, removeFromCart, clearCart, deliveryType, onDeliveryTypeChange, appliedCoupon, couponError, onApplyCoupon, onRemoveCoupon, isCouponLoading }) => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const restaurantId = cartItems[0]?.product.restaurantId;

  useEffect(() => {
    if (restaurantId) {
      api.getRestaurantById(restaurantId).then(data => {
        setRestaurant(data || null);
      });
    }
  }, [restaurantId]);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center flex-1">
        <CartIcon className="w-24 h-24 text-appTextSecondary/30 mb-6" />
        <h2 className="text-2xl font-semibold text-appTextPrimary mb-2">Seu carrinho está vazio</h2>
        <p className="text-appTextSecondary mb-6">Adicione itens para fazer um pedido.</p>
        <Link 
          to={ROUTE_PATHS.HOME} 
          className="px-6 py-3 bg-appPrimaryActionBg text-appPrimaryActionText rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Ver restaurantes
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = deliveryType === 'DELIVERY' ? (restaurant?.deliveryFee ?? 5.00) : 0;
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
        discount = appliedCoupon.discountValue;
    } else { // percentage
        discount = subtotal * (appliedCoupon.discountValue / 100);
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleClearCart = () => {
    if (window.confirm("Tem certeza que deseja limpar o carrinho?")) {
        clearCart();
    }
  }

  return (
    <div className="p-4 space-y-6 flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-appTextPrimary text-[22px] font-bold leading-tight tracking-[-0.015em]">Seu Carrinho</h1>
        <button 
            onClick={handleClearCart} 
            className="text-sm text-red-600 hover:underline flex items-center"
        >
            <TrashIcon className="w-4 h-4 mr-1"/> Limpar Carrinho
        </button>
      </div>
      
      {restaurant && <p className="text-lg font-semibold text-appTextPrimary">{restaurant.name}</p>}

      <DeliveryTypeSelector selectedType={deliveryType} onSelectType={onDeliveryTypeChange} />

      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div key={`${item.product.id}-${index}-${JSON.stringify(item.selectedOptions)}`} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm flex items-center space-x-3 border border-appBorderLight">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" />
            <div className="flex-1">
              <h3 className="text-sm sm:text-md font-semibold text-appTextPrimary">{item.product.name}</h3>
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <p className="text-xs text-appTextSecondary">
                  {item.selectedOptions.map(opt => `${opt.groupName}: ${opt.choiceName}`).join(', ')}
                </p>
              )}
              {item.observations && <p className="text-xs text-appTextSecondary italic">Obs: {item.observations}</p>}
              <p className="text-sm font-bold text-green-600 mt-1">R$ {item.totalPrice.toFixed(2)}</p>
            </div>
             <div className="flex items-center">
              <button
                onClick={() => {
                  if (item.quantity > 1) {
                    updateCartItemQuantity(item.product.id, item.quantity - 1, item.selectedOptions);
                  } else {
                    removeFromCart(item.product.id, item.selectedOptions);
                  }
                }}
                className="p-1.5 bg-appHeaderButtonBg rounded-full text-appTextPrimary hover:bg-appHeaderButtonBgHover transition-colors"
                aria-label={item.quantity > 1 ? 'Diminuir quantidade' : 'Remover item'}
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="mx-3 text-md font-semibold w-6 text-center text-appTextPrimary">{item.quantity}</span>
              <button
                onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1, item.selectedOptions)}
                className="p-1.5 bg-appHeaderButtonBg rounded-full text-appTextPrimary hover:bg-appHeaderButtonBgHover transition-colors"
                aria-label="Aumentar quantidade"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate(ROUTE_PATHS.STORE_DETAIL.replace(':storeId', restaurantId || ''))}
        className="w-full text-appTextPrimary py-2 border border-appTextPrimary rounded-lg hover:bg-appTextPrimary/5 transition-colors"
      >
        Adicionar mais itens
      </button>
      
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 border border-appBorderLight">
        <h2 className="text-lg font-semibold text-appTextPrimary mb-2">Cupom de Desconto</h2>
         <CouponInputForm
            appliedCoupon={appliedCoupon}
            error={couponError}
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
            isLoading={isCouponLoading}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-2 border border-appBorderLight">
        <h2 className="text-lg font-semibold text-appTextPrimary mb-2">Resumo</h2>
        <div className="flex justify-between text-sm text-appTextSecondary">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        {deliveryType === 'DELIVERY' ? (
            <div className="flex justify-between text-sm text-appTextSecondary">
                <span>Taxa de entrega</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
            </div>
        ) : (
            <div className="flex justify-between text-sm text-appTextSecondary">
                <span>Retirada</span>
                <span className="text-green-600 font-semibold">Grátis</span>
            </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-red-500">
            <span>Desconto Cupom</span>
            <span>- R$ {discount.toFixed(2)}</span>
          </div>
        )}
        <hr className="my-2 border-appBorderLight"/>
        <div className="flex justify-between text-lg font-bold text-appTextPrimary">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(ROUTE_PATHS.CHECKOUT)}
        className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
      >
        Continuar
      </button>
    </div>
  );
};

export default CartScreen;