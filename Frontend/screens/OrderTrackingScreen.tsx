
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, OrderStatus, CartItem } from '../types';
import { ROUTE_PATHS } from '../constants';
import { MapPinIcon } from '../icons';

interface OrderTrackingScreenProps {
    orders: Order[];
}

const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ orders }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId, orders]);

  if (!order) {
    return (
        <div className="p-4 text-center text-appTextSecondary flex-1">
            <p>Pedido não encontrado.</p>
            <Link to={ROUTE_PATHS.HOME} className="text-appTextPrimary hover:underline mt-4 block">Voltar para Home</Link>
        </div>
    );
  }

  const getStatusIndex = (status: OrderStatus): number => {
    const orderStatuses = [OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED];
    if (status === OrderStatus.CANCELLED) return -1; // Special case for cancelled
    return orderStatuses.indexOf(status);
  };
  
  const currentStatusIndex = getStatusIndex(order.status);

  const statusSteps = [
    { name: OrderStatus.PLACED, description: "Seu pedido foi recebido pela loja." },
    { name: OrderStatus.PREPARING, description: "A loja está preparando seu pedido." },
    { name: OrderStatus.OUT_FOR_DELIVERY, description: "Seu pedido saiu para entrega." },
    { name: OrderStatus.DELIVERED, description: "Seu pedido foi entregue! Bom apetite!" },
  ];
  
  if(order.status === OrderStatus.CANCELLED){
    // If cancelled, show a specific message instead of steps or modify steps
  }


  return (
    <div className="p-4 space-y-6 bg-appBg min-h-full flex-1">
      <div className="bg-white p-6 rounded-lg shadow-xl border border-appBorderLight">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-appTextPrimary">Acompanhe seu Pedido</h1>
          <p className="text-sm text-appTextSecondary">Pedido #{order.id.substring(order.id.length - 6)}</p>
          <p className="text-lg font-semibold text-appTextPrimary mt-1">{order.restaurantName}</p>
        </div>

        {order.status !== OrderStatus.CANCELLED && (
            <div className="space-y-4 mb-8">
                {statusSteps.map((step, index) => {
                    const isActive = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const logEntry = order.trackingLog?.find(log => log.status === step.name);

                    return (
                        <div key={step.name} className="flex items-start">
                            <div className="flex flex-col items-center mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                                ${isActive ? 'bg-appTextPrimary border-appTextPrimary text-white' : 'bg-gray-200 border-gray-300 text-appTextSecondary'}`}>
                                {index + 1}
                            </div>
                            {index < statusSteps.length - 1 && (
                                <div className={`w-0.5 h-12 mt-1 ${index < currentStatusIndex ? 'bg-appTextPrimary' : 'bg-gray-300'}`}></div>
                            )}
                            </div>
                            <div className="pt-1">
                            <h3 className={`font-semibold ${isActive ? 'text-appTextPrimary' : 'text-appTextSecondary'}`}>{step.name}</h3>
                            {isCurrent && <p className="text-sm text-appTextSecondary">{step.description}</p>}
                            {logEntry && <p className="text-xs text-gray-400">{new Date(logEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        
        {order.status === OrderStatus.CANCELLED && (
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md my-6">
                <p className="text-red-700 font-semibold text-lg">Este pedido foi cancelado.</p>
                {/* Optionally, show cancellation reason if available */}
            </div>
        )}


        {order.status === OrderStatus.OUT_FOR_DELIVERY && (
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-appTextSecondary shadow border border-appBorderLight">
            <MapPinIcon className="w-12 h-12 mr-2"/>
            <p>Localização do entregador (simulação)</p>
          </div>
        )}

        <div className="mt-8 border-t border-appBorderLight pt-6">
          <h2 className="text-lg font-semibold text-appTextPrimary mb-3">Detalhes do Pedido</h2>
          <div className="space-y-1 text-sm text-appTextSecondary">
            {order.items.map((item: CartItem, index: number) => (
              <div key={index} className="flex justify-between">
                <span>{item.quantity}x {item.product.name}</span>
                <span className="text-appTextPrimary">R$ {item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-1 border-appBorderLight/50"/>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-appTextPrimary">R$ {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de entrega</span>
              <span className="text-appTextPrimary">R$ {order.deliveryFee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Desconto</span>
                <span>- R$ {order.discount.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-1 border-appBorderLight/50"/>
            <div className="flex justify-between font-bold text-appTextPrimary">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-3">
          <button 
            onClick={() => alert('Função de ajuda não implementada.')}
            className="px-6 py-2 bg-appHeaderButtonBg text-appTextPrimary rounded-lg hover:bg-appHeaderButtonBgHover transition-colors"
          >
            Ajuda com o pedido
          </button>
           <div>
            <Link to={ROUTE_PATHS.HOME} className="text-appTextPrimary hover:underline">Voltar para Home</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingScreen;
