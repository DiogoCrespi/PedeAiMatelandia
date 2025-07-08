
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Product } from '../types';
import { ROUTE_PATHS } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const linkStoreId = storeId || product.restaurantId;

  return (
    <Link 
      to={ROUTE_PATHS.PRODUCT_DETAIL.replace(':storeId', linkStoreId).replace(':productId', product.id)}
      className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-appBorderLight hover:border-appCategoryActiveBorder group"
    >
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md mr-3 sm:mr-4" />
      )}
      <div className="flex-1">
        <h4 className="text-sm sm:text-md font-semibold text-appTextPrimary group-hover:text-appPrimaryActionBg">{product.name}</h4>
        <p className="text-xs sm:text-sm text-appTextSecondary mt-1 line-clamp-2">{product.description}</p>
        <p className="text-sm sm:text-md font-bold text-green-600 mt-2">R$ {product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
