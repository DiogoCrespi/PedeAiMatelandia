
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Address, Order, OrderStatus, PaymentMethod, DeliveryType } from '../types';
import { ROUTE_PATHS } from '../constants';
import { MOCK_USER, MOCK_RESTAURANTS } from '../data';
import { MapPinIcon, CreditCardIcon, VisaIcon, MastercardIcon, PixIcon, PickupBuildingIcon } from '../icons'; 

interface CheckoutScreenProps {
  cartItems: CartItem[];
  deliveryAddress: Address;
  paymentMethods: PaymentMethod[];
  onPlaceOrder: (order: Order) => void;
  deliveryType: DeliveryType;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ cartItems, deliveryAddress, paymentMethods, onPlaceOrder, deliveryType }) => {
  const navigate = useNavigate();
  
  const defaultPayment = paymentMethods.find(pm => pm.isDefault);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(defaultPayment ? `card-${defaultPayment.id}` : 'pix');
  
  const restaurantId = cartItems[0]?.product.restaurantId;
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === restaurantId); 
  const restaurantName = restaurant?.name || 'Restaurante Desconhecido';

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = deliveryType === 'DELIVERY' ? (restaurant?.deliveryFee ?? 5.00) : 0;
  const discount = 0; 
  const total = subtotal + deliveryFee - discount;

  const handlePlaceOrder = () => {
    if (!MOCK_USER) {
        alert("Usuário não encontrado. Faça login novamente.");
        navigate(ROUTE_PATHS.LOGIN);
        return;
    }

    let paymentMethodDescription = 'Não definido';
    if(selectedPaymentId.startsWith('card-')) {
        const cardId = selectedPaymentId.replace('card-', '');
        const card = paymentMethods.find(pm => pm.id === cardId);
        if (card) {
            paymentMethodDescription = `${card.cardType === 'visa' ? 'Visa' : 'Mastercard'} final ${card.last4}`;
        }
    } else if (selectedPaymentId === 'pix') {
        paymentMethodDescription = 'Pix';
    } else if (selectedPaymentId === 'on_delivery_card') {
        paymentMethodDescription = 'Pagar na entrega (cartão)';
    }


    const newOrder: Order = {
      id: `order-${Date.now()}`, 
      userId: MOCK_USER.id,
      restaurantId: restaurantId || 'unknown-rest',
      restaurantName: restaurantName,
      items: cartItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: OrderStatus.PLACED,
      deliveryAddress,
      paymentMethod: paymentMethodDescription,
      createdAt: new Date().toISOString(),
      trackingLog: [{ status: OrderStatus.PLACED, timestamp: new Date().toISOString() }],
      deliveryType: deliveryType,
      isLocal: false,
      customerName: MOCK_USER.name,
    };
    onPlaceOrder(newOrder);
  };

  if (cartItems.length === 0) {
    navigate(ROUTE_PATHS.HOME); 
    return null;
  }

  const getCardIcon = (cardType: 'visa' | 'mastercard' | 'other') => {
      switch(cardType) {
          case 'visa': return <VisaIcon />;
          case 'mastercard': return <MastercardIcon />;
          default: return <CreditCardIcon className="w-8 h-8 text-appTextSecondary" />;
      }
  }

  return (
    <div className="p-4 space-y-6 bg-appBg min-h-full flex-1">
      <h1 className="text-appTextPrimary text-[22px] font-bold leading-tight tracking-[-0.015em]">Finalizar Pedido</h1>

      {deliveryType === 'DELIVERY' ? (
        <section className="bg-white p-4 rounded-lg shadow border border-appBorderLight">
            <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-appTextPrimary">Endereço de Entrega</h2>
            <button 
                onClick={() => navigate(ROUTE_PATHS.ADDRESS_MANAGEMENT)} 
                className="text-sm text-appTextPrimary hover:underline"
            >
                Trocar
            </button>
            </div>
            <div className="flex items-start text-sm text-appTextSecondary">
            <MapPinIcon className="w-5 h-5 mr-2 mt-0.5 text-appTextSecondary shrink-0" />
            <div>
                <p>{deliveryAddress.street}, {deliveryAddress.number} {deliveryAddress.complement && `- ${deliveryAddress.complement}`}</p>
                <p>{deliveryAddress.neighborhood} - {deliveryAddress.city}, {deliveryAddress.state}</p>
            </div>
            </div>
        </section>
      ) : (
        <section className="bg-white p-4 rounded-lg shadow border border-appBorderLight">
            <h2 className="text-lg font-semibold text-appTextPrimary mb-2">Local de Retirada</h2>
            <div className="flex items-start text-sm text-appTextSecondary">
                <PickupBuildingIcon className="w-5 h-5 mr-2 mt-0.5 text-appTextSecondary shrink-0" />
                <div>
                    <p className="font-semibold text-appTextPrimary">{restaurant?.name}</p>
                    <p>{restaurant?.info?.address}</p>
                </div>
            </div>
        </section>
      )}


      <section className="bg-white p-4 rounded-lg shadow border border-appBorderLight">
        <h2 className="text-lg font-semibold text-appTextPrimary mb-3">Forma de Pagamento</h2>
        <div className="space-y-3">
          {paymentMethods.map(pm => (
            <label key={pm.id} className={`flex items-center p-3 border rounded-lg hover:border-appTextPrimary cursor-pointer transition-colors ${selectedPaymentId === `card-${pm.id}` ? 'border-appTextPrimary bg-appHeaderButtonBg/30' : 'border-appBorderLight'}`}>
              <input type="radio" name="paymentMethod" value={`card-${pm.id}`} checked={selectedPaymentId === `card-${pm.id}`} onChange={(e) => setSelectedPaymentId(e.target.value)} className="mr-3 h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary"/>
              {getCardIcon(pm.cardType)}
              <span className="ml-3 text-appTextPrimary flex-1">**** {pm.last4}</span>
              {pm.isDefault && <span className="text-xs bg-gray-200 text-appTextSecondary px-2 py-0.5 rounded-full">Padrão</span>}
            </label>
          ))}
          <label className={`flex items-center p-3 border rounded-lg hover:border-appTextPrimary cursor-pointer transition-colors ${selectedPaymentId === 'pix' ? 'border-appTextPrimary bg-appHeaderButtonBg/30' : 'border-appBorderLight'}`}>
            <input type="radio" name="paymentMethod" value="pix" checked={selectedPaymentId === 'pix'} onChange={(e) => setSelectedPaymentId(e.target.value)} className="mr-3 h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary"/>
            <PixIcon className="w-5 h-5 mr-2 text-appTextSecondary"/>
            <span className="text-appTextPrimary">Pix</span>
          </label>
           <label className={`flex items-center p-3 border rounded-lg hover:border-appTextPrimary cursor-pointer transition-colors ${selectedPaymentId === 'on_delivery_card' ? 'border-appTextPrimary bg-appHeaderButtonBg/30' : 'border-appBorderLight'}`}>
            <input type="radio" name="paymentMethod" value="on_delivery_card" checked={selectedPaymentId === 'on_delivery_card'} onChange={(e) => setSelectedPaymentId(e.target.value)} className="mr-3 h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary"/>
            <CreditCardIcon className="w-5 h-5 mr-2 text-appTextSecondary"/>
            <span className="text-appTextPrimary">Pagar na entrega (cartão)</span>
          </label>
          <button 
            onClick={() => navigate(ROUTE_PATHS.PAYMENT_MANAGEMENT)} 
            className="w-full text-sm text-appTextPrimary py-2 mt-2 hover:underline"
          >
            Adicionar/Gerenciar cartões
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg shadow border border-appBorderLight">
        <h2 className="text-lg font-semibold text-appTextPrimary mb-3">Resumo do Pedido</h2>
        {cartItems.map((item, index) => (
          <div key={`${item.product.id}-${index}`} className="flex justify-between items-center text-sm py-1 border-b border-appBg last:border-b-0">
            <span className="text-appTextSecondary truncate max-w-[200px]">{item.quantity}x {item.product.name}</span>
            <span className="text-appTextPrimary">R$ {item.totalPrice.toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-2 border-appBg"/>
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
            <span>Desconto</span>
            <span>- R$ {discount.toFixed(2)}</span>
          </div>
        )}
        <hr className="my-2 border-appBg"/>
        <div className="flex justify-between text-xl font-bold text-appTextPrimary">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </section>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-brandGreen text-white py-3.5 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg shadow-md"
      >
        Fazer Pedido
      </button>
    </div>
  );
};

export default CheckoutScreen;
