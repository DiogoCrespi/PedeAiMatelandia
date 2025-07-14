

import React from 'react';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { ROUTE_PATHS } from '../constants';
import { ChevronRightIcon } from '../icons';

interface OrderCardProps {
  order: Order;
  restaurantImageUrl?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, restaurantImageUrl }) => {
  const imageToShow = restaurantImageUrl || 'https://picsum.photos/seed/placeholder/200/200';

  const getStatusClasses = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Link 
      to={ROUTE_PATHS.ORDER_TRACKING.replace(':orderId', order.id)}
      className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-4 border border-appBorderLight hover:shadow-md hover:border-appCategoryActiveBorder transition-all group"
    >
      <img 
        src={imageToShow} 
        alt={order.restaurantName} 
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-appTextPrimary truncate">{order.restaurantName}</h3>
        <p className="text-sm text-appTextSecondary">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
        <p className="text-sm font-semibold text-appTextPrimary mt-1">Total: R$ {order.total.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end justify-between self-stretch">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusClasses(order.status)}`}>
          {order.status}
        </span>
        <div className="flex items-center text-sm text-appTextPrimary font-medium group-hover:underline">
            Ver Detalhes
            <ChevronRightIcon className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
