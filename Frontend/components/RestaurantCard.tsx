
import React from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import { ROUTE_PATHS } from '../constants';
import { StarIcon, HeartIcon } from '../icons';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isClosed?: boolean; // To handle closed restaurants style
  isFavorited: boolean;
  onToggleFavorite: (restaurantId: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, isClosed, isFavorited, onToggleFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(restaurant.id);
  };

  return (
    <Link
      to={ROUTE_PATHS.STORE_DETAIL.replace(':storeId', restaurant.id)}
      className={`relative flex gap-3 sm:gap-4 bg-white rounded-xl p-3 shadow-sm transition-all duration-200 hover:shadow-md group ${isClosed ? 'opacity-70' : ''}`}
    >
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition-opacity duration-200 ${isFavorited ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <HeartIcon 
          className="w-5 h-5" 
          isFilled={isFavorited} 
        />
      </button>

      <div 
        className={`w-20 h-20 sm:w-24 sm:h-24 bg-center bg-no-repeat bg-cover rounded-lg ${isClosed ? 'grayscale' : ''}`}
        style={{ backgroundImage: `url("${restaurant.imageUrl}")` }}
        aria-label={restaurant.name}
      ></div>
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-appTextPrimary text-sm sm:text-base font-bold leading-tight truncate">{restaurant.name}</h3>
          <p className="text-appTextSecondary text-xs sm:text-sm truncate">{restaurant.cuisine}</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 mt-1">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-appTextPrimary text-xs sm:text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
          </div>
          <span className="text-appTextSecondary text-xs sm:text-sm">•</span>
          <span className="text-appTextSecondary text-xs sm:text-sm truncate">
            {isClosed ? `Abre às ${restaurant.deliveryTime}` : restaurant.deliveryTime} 
            {/* Assuming deliveryTime can hold opening time for closed ones, adjust as needed */}
          </span>
           {!isClosed && restaurant.deliveryFee > 0 && (
            <>
              <span className="text-appTextSecondary text-xs sm:text-sm">•</span>
              <span className="text-appTextSecondary text-xs sm:text-sm">
                R${restaurant.deliveryFee.toFixed(2)}
              </span>
            </>
          )}
          {!isClosed && restaurant.deliveryFee === 0 && (
             <>
              <span className="text-appTextSecondary text-xs sm:text-sm">•</span>
              <span className="text-green-600 text-xs sm:text-sm font-semibold">Grátis</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
