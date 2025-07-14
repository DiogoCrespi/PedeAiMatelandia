import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Category, PromotionBanner, Restaurant } from '../types';
import { ROUTE_PATHS } from '../constants';
import * as api from '../api';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import RestaurantCard from '../components/RestaurantCard';
import InfoFooter from '../components/InfoFooter';

interface HomeScreenProps {
  favoriteRestaurants: string[];
  onToggleFavorite: (restaurantId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ favoriteRestaurants, onToggleFavorite }) => {
  const [promotions, setPromotions] = useState<PromotionBanner[]>([]);
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openRestaurants, setOpenRestaurants] = useState<Restaurant[]>([]);
  const [closedRestaurants, setClosedRestaurants] = useState<Restaurant[]>([]);
  const [orderAgainRestaurants, setOrderAgainRestaurants] = useState<Restaurant[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          promoData,
          categoryData,
          openRestaurantsData,
          closedRestaurantsData,
          orderAgainData,
        ] = await Promise.all([
          api.getPromotions(),
          api.getCategories(),
          api.getOpenRestaurants(),
          api.getClosedRestaurants(),
          api.getOrderAgainRestaurants(),
        ]);
        
        setPromotions(promoData);
        setCategories(categoryData);
        setOrderAgainRestaurants(orderAgainData);
        setOpenRestaurants(openRestaurantsData);
        setClosedRestaurants(closedRestaurantsData);

        if (categoryData.length > 0) {
          setActiveCategory(categoryData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch home screen data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Carousel Logic ---
  const handleNext = useCallback(() => {
    if (promotions.length > 0) {
      setCurrentPromotionIndex(prevIndex => (prevIndex + 1) % promotions.length);
    }
  }, [promotions.length]);

  const handlePrev = () => {
    if (promotions.length > 0) {
      setCurrentPromotionIndex(prevIndex => (prevIndex - 1 + promotions.length) % promotions.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentPromotionIndex(index);
  }

  useEffect(() => {
    if (promotions.length <= 1 || isHovering) return;

    const timer = setInterval(() => {
        handleNext();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, [promotions.length, isHovering, handleNext]);


  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-t-transparent border-appTextSecondary rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Banners Promocionais Carousel */}
      {promotions.length > 0 && (
        <section className="px-0 sm:px-4 pt-2">
            <div
                className="relative group h-40 sm:h-48 overflow-hidden sm:rounded-lg shadow-sm"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {promotions.map((promo, index) => (
                <Link
                    key={promo.id}
                    to={promo.linkTo}
                    className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out ${index === currentPromotionIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    aria-hidden={index !== currentPromotionIndex}
                >
                    <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                    />
                </Link>
                ))}

                {/* Carousel Controls */}
                {promotions.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-1 sm:left-3 -translate-y-1/2 z-20 text-white p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 hover:scale-110"
                        aria-label="Banner anterior"
                    >
                    <ChevronLeftIcon className="w-6 h-6 sm:w-7 sm:h-7 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.6))]" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-1 sm:right-3 -translate-y-1/2 z-20 text-white p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 hover:scale-110"
                        aria-label="Próximo banner"
                    >
                    <ChevronRightIcon className="w-6 h-6 sm:w-7 sm:h-7 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.6))]" />
                    </button>
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {promotions.map((_, index) => (
                        <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${currentPromotionIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                        aria-label={`Ir para o banner ${index + 1}`}
                        />
                    ))}
                    </div>
                </>
                )}
          </div>
        </section>
      )}

      {/* Categorias */}
      <section>
        <h2 className="text-appTextPrimary text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-5">Categorias</h2>
        <div className="pb-3">
          <div className="flex flex-row overflow-x-auto gap-3 sm:gap-6 px-4 border-b border-appBorderLight scrollbar-hide w-full">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`${ROUTE_PATHS.SEARCH}?category=${encodeURIComponent(category.name)}`}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center justify-center border-b-[3px] ${activeCategory === category.id ? 'border-b-appCategoryActiveBorder text-appTextPrimary' : 'border-b-transparent text-appTextSecondary'} gap-2 pb-[7px] pt-2.5 min-w-[80px] sm:min-w-[90px] group`}
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 sm:size-12 group-hover:opacity-80 transition-opacity"
                  style={{ backgroundImage: `url("${category.imageUrl}")` }}
                ></div>
                <p className={`text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] group-hover:text-appTextPrimary transition-colors`}>{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Peça de Novo */}
      {orderAgainRestaurants.length > 0 && (
         <section>
          <h2 className="text-appTextPrimary text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Peça de Novo</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4">
            {orderAgainRestaurants.map(restaurant => (
              <RestaurantCard 
                key={`order-again-${restaurant.id}`} 
                restaurant={restaurant}
                isFavorited={favoriteRestaurants.includes(restaurant.id)}
                onToggleFavorite={onToggleFavorite}
                isClosed={restaurant.isStoreOpenManually === false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Restaurantes Abertos */}
      {openRestaurants.length > 0 && (
        <section>
          <h2 className="text-appTextPrimary text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Restaurantes Abertos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4">
            {openRestaurants.map(restaurant => (
              <RestaurantCard 
                key={`open-${restaurant.id}`} 
                restaurant={restaurant}
                isFavorited={favoriteRestaurants.includes(restaurant.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Restaurantes Fechados */}
      {closedRestaurants.length > 0 && (
        <section>
          <h2 className="text-appTextPrimary text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Restaurantes Fechados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4">
            {closedRestaurants.map(restaurant => (
              <RestaurantCard 
                key={`closed-${restaurant.id}`} 
                restaurant={restaurant} 
                isClosed={true}
                isFavorited={favoriteRestaurants.includes(restaurant.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      <InfoFooter />
    </div>
  );
};

export default HomeScreen;