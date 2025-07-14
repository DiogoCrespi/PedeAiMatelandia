

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Order, OrderStatus, Restaurant } from '../types';
import { ROUTE_PATHS } from '../constants';
import * as api from '../api';
import { ChevronLeftIcon, CartIcon as FooterCartIcon } from '../icons';
import OrderCard from '../components/OrderCard';

interface OrderHistoryScreenProps {
  orders: Order[];
}

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ orders }) => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    api.getRestaurants().then(setRestaurants);
  }, []);

  const restaurantImageMap = restaurants.reduce((map, rest) => {
    map[rest.id] = rest.imageUrl;
    return map;
  }, {} as Record<string, string>);

  const ongoingOrders = orders
    .filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pastOrders = orders
    .filter(o => o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col flex-1 bg-appBg min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <h1 className="text-xl font-bold text-appTextPrimary">Meus Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-4 flex-1">
          <FooterCartIcon className="w-24 h-24 text-appTextSecondary/30 mb-6" />
          <h2 className="text-2xl font-semibold text-appTextPrimary mb-2">Sem pedidos por aqui</h2>
          <p className="text-appTextSecondary mb-6">Você ainda não fez nenhum pedido.</p>
          <Link 
            to={ROUTE_PATHS.HOME} 
            className="px-6 py-3 bg-appPrimaryActionBg text-appPrimaryActionText rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Começar a comprar
          </Link>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {ongoingOrders.length > 0 && (
            <section>
              <h2 className="text-appTextPrimary text-lg font-bold leading-tight tracking-[-0.015em] mb-3">
                Pedidos em Andamento
              </h2>
              <div className="space-y-3">
                {ongoingOrders.map(order => (
                    <OrderCard key={order.id} order={order} restaurantImageUrl={restaurantImageMap[order.restaurantId]} />
                ))}
              </div>
            </section>
          )}

          {pastOrders.length > 0 && (
            <section>
              <h2 className="text-appTextPrimary text-lg font-bold leading-tight tracking-[-0.015em] mb-3">
                Pedidos Anteriores
              </h2>
              <div className="space-y-3">
                {pastOrders.map(order => (
                    <OrderCard key={order.id} order={order} restaurantImageUrl={restaurantImageMap[order.restaurantId]} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryScreen;
