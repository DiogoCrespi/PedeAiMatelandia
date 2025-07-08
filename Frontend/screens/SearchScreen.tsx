
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Restaurant, Product, Category } from '../types';
import { ROUTE_PATHS } from '../constants';
import { MOCK_RESTAURANTS, MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data';
import { SearchIcon, XMarkIcon, StarIcon } from '../icons';
import RestaurantCard from '../components/RestaurantCard';
import ProductCard from '../components/ProductCard'; 

interface SearchScreenProps {
  favoriteRestaurants: string[];
  onToggleFavorite: (restaurantId: string) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ favoriteRestaurants, onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ restaurants: Restaurant[], products: Product[] }>({ restaurants: [], products: [] });
  const [recentSearches, setRecentSearches] = useState<string[]>(['Pizza', 'Hambúrguer', 'Sushi', 'Salada']); 
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const performSearch = useCallback((term: string) => {
    if (!term.trim()) {
      setSearchResults({ restaurants: [], products: [] });
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filteredRestaurants = MOCK_RESTAURANTS.filter(r => 
      r.name.toLowerCase().includes(lowerTerm) || 
      r.cuisine.toLowerCase().includes(lowerTerm)
    );
    const filteredProducts = MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lowerTerm) ||
      p.description.toLowerCase().includes(lowerTerm) ||
      (p.category && p.category.toLowerCase().includes(lowerTerm))
    );
    setSearchResults({ restaurants: filteredRestaurants, products: filteredProducts });
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryQuery = queryParams.get('category');
    const searchQuery = queryParams.get('q');
    
    let initialSearch = '';
    if (categoryQuery) {
      initialSearch = categoryQuery;
    } else if (searchQuery) {
      initialSearch = searchQuery;
    }
    
    setSearchTerm(initialSearch);
    performSearch(initialSearch); 
    
    setPopularCategories(MOCK_CATEGORIES.slice(0, 6));
  }, [location.search, performSearch]); 

  const addTermToRecent = (term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm.length > 0) {
      setRecentSearches(prev => {
        const isAlreadyRecent = prev.some(rs => rs.toLowerCase() === trimmedTerm.toLowerCase());
        if (!isAlreadyRecent) {
          return [trimmedTerm, ...prev.slice(0, 4)];
        }
        return prev;
      });
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const termToSearch = searchTerm.trim();
    addTermToRecent(termToSearch);
    performSearch(termToSearch);
    
    if (termToSearch) {
      navigate(`${ROUTE_PATHS.SEARCH}?q=${encodeURIComponent(termToSearch)}`);
    } else {
      navigate(ROUTE_PATHS.SEARCH);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
    navigate(`${ROUTE_PATHS.SEARCH}?q=${encodeURIComponent(term)}`);
  }

  const handleRemoveRecentSearch = (termToRemove: string, event: React.MouseEvent) => {
    event.stopPropagation(); 
    setRecentSearches(prev => prev.filter(term => term !== termToRemove));
  };

  return (
    <div className="p-4 space-y-6 flex-1">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchInputChange}
          placeholder="Buscar lojas ou pratos..."
          className="w-full pl-10 pr-4 py-3 border border-appBorderLight rounded-lg shadow-sm focus:ring-appTextPrimary focus:border-appTextPrimary bg-white text-appTextPrimary placeholder-appTextSecondary"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-appTextSecondary" />
      </form>

      {searchTerm === '' && recentSearches.length > 0 && (
        <section>
          <h2 className="text-appTextPrimary text-lg font-semibold mb-2">Buscas Recentes</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <div 
                key={index} 
                onClick={() => handleRecentSearchClick(term)}
                className="flex items-center px-3 py-1 bg-appHeaderButtonBg text-appTextPrimary rounded-full text-sm hover:bg-appHeaderButtonBgHover cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRecentSearchClick(term);}}
              >
                <span>{term}</span>
                <button 
                    onClick={(e) => handleRemoveRecentSearch(term, e)}
                    className="ml-2 text-appTextSecondary hover:text-appTextPrimary opacity-50 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remover ${term} das buscas recentes`}
                >
                    <XMarkIcon className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {searchTerm === '' && popularCategories.length > 0 && (
         <section>
          <h2 className="text-appTextPrimary text-lg font-semibold mb-3">Categorias Populares</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {popularCategories.map(category => (
              <Link 
                key={category.id} 
                to={`${ROUTE_PATHS.SEARCH}?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center border border-appBorderLight hover:border-appCategoryActiveBorder group"
              >
                <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain mb-1 rounded-full" />
                <span className="text-xs text-appTextSecondary group-hover:text-appTextPrimary font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {searchTerm !== '' && (searchResults.restaurants.length > 0 || searchResults.products.length > 0) && (
        <section>
          <h2 className="text-appTextPrimary text-xl font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-2">Resultados para "{searchTerm}"</h2>
          {searchResults.restaurants.length > 0 && (
            <>
              <h3 className="text-appTextPrimary text-lg font-semibold mb-2">Lojas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {searchResults.restaurants.map(restaurant => (
                  <RestaurantCard 
                    key={restaurant.id} 
                    restaurant={restaurant} 
                    isFavorited={favoriteRestaurants.includes(restaurant.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </>
          )}
          {searchResults.products.length > 0 && (
            <>
              <h3 className="text-appTextPrimary text-lg font-semibold mb-2">Pratos</h3>
              <div className="space-y-3">
                {searchResults.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </section>
      )}
      {searchTerm !== '' && searchResults.restaurants.length === 0 && searchResults.products.length === 0 && (
        <div className="text-center py-10">
            <SearchIcon className="w-16 h-16 text-appTextSecondary/50 mx-auto mb-4"/>
            <p className="text-appTextSecondary text-lg">Nenhum resultado encontrado para "{searchTerm}".</p>
            <p className="text-appTextSecondary/80">Tente buscar por outros termos.</p>
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
