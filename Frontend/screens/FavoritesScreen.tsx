import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants';
import * as api from '../api';
import { Restaurant } from '../types';
import RestaurantCard from '../components/RestaurantCard';
import { ChevronLeftIcon, HeartIcon } from '../icons';

interface FavoritesScreenProps {
  favoriteRestaurants: string[];
  onToggleFavorite: (restaurantId: string) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ favoriteRestaurants, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await api.getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);
  
  const favoriteRestaurantDetails = restaurants.filter(restaurant => 
    favoriteRestaurants.includes(restaurant.id)
  );

  return (
    <div className="flex flex-col flex-1 bg-appBg min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <h1 className="text-xl font-bold text-appTextPrimary">Meus Favoritos</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-12 h-12 border-4 border-t-transparent border-appTextSecondary rounded-full animate-spin"></div>
        </div>
      ) : favoriteRestaurantDetails.length > 0 ? (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {favoriteRestaurantDetails.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorited={true} // Always favorited on this screen
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-4 flex-1">
          <HeartIcon isFilled className="w-24 h-24 text-appTextSecondary/30 mb-6" />
          <h2 className="text-2xl font-semibold text-appTextPrimary mb-2">Sem favoritos por aqui</h2>
          <p className="text-appTextSecondary mb-6 max-w-xs">Clique no coração de um restaurante para salvá-lo nesta lista.</p>
          <Link 
            to={ROUTE_PATHS.HOME} 
            className="px-6 py-3 bg-appPrimaryActionBg text-appPrimaryActionText rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Ver Restaurantes
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesScreen;
