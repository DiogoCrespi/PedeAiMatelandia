import React from 'react';
import { Link } from 'react-router-dom';
import { Product, Restaurant } from '../types';
import { ROUTE_PATHS } from '../constants';

interface PopularProductCardProps {
  product: Product;
  restaurant?: Restaurant;
}

const PopularProductCard: React.FC<PopularProductCardProps> = ({ product, restaurant }) => {

  return (
    <Link
      to={ROUTE_PATHS.PRODUCT_DETAIL.replace(':storeId', product.restaurantId).replace(':productId', product.id)}
      className="flex-shrink-0 w-48 bg-white rounded-xl p-3 shadow-sm transition-all duration-200 hover:shadow-md group"
    >
      <div
        className="w-full h-24 bg-center bg-no-repeat bg-cover rounded-lg mb-2"
        style={{ backgroundImage: `url("${product.imageUrl}")` }}
        aria-label={product.name}
      ></div>
      <div className="flex flex-col">
        <h3 className="text-appTextPrimary text-sm font-bold leading-tight truncate">{product.name}</h3>
        {restaurant && <p className="text-appTextSecondary text-xs truncate">{restaurant.name}</p>}
        <p className="text-green-600 text-sm font-bold mt-1">R$ {product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default PopularProductCard;
