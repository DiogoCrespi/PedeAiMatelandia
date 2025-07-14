



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Restaurant, Product, DeliveryType } from '../types';
import * as api from '../api';
import { StarIcon, ChevronLeftIcon, SearchIcon } from '../icons';
import ProductCard from '../components/ProductCard';
import DeliveryTypeSelector from '../components/DeliveryTypeSelector';

interface StoreScreenProps {
  deliveryType: DeliveryType;
  onDeliveryTypeChange: (type: DeliveryType) => void;
}

const StoreScreen: React.FC<StoreScreenProps> = ({ deliveryType, onDeliveryTypeChange }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'cardapio' | 'informacoes'>('cardapio');
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
        if (storeId) {
            setIsLoading(true);
            try {
                const [restaurantData, menuData] = await Promise.all([
                    api.getRestaurantById(storeId),
                    api.getProductsByRestaurant(storeId)
                ]);

                if (restaurantData) {
                    setRestaurant(restaurantData);
                    setMenu(menuData);
                } else {
                    // Handle restaurant not found
                    setRestaurant(null);
                    setMenu([]);
                }
            } catch (error) {
                console.error("Failed to fetch store data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    fetchStoreData();
  }, [storeId]);

  const menuByCategories: { [category: string]: Product[] } = menu.reduce((acc, product) => {
    const category = product.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as { [category: string]: Product[] });

  const filteredMenuByCategories = Object.entries(menuByCategories).reduce((acc, [category, products]) => {
    if (!menuSearchTerm.trim()) {
      acc[category] = products;
      return acc;
    }
    
    const lowercasedFilter = menuSearchTerm.toLowerCase();
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(lowercasedFilter) ||
      product.description.toLowerCase().includes(lowercasedFilter)
    );

    if (filteredProducts.length > 0) {
      acc[category] = filteredProducts;
    }
    
    return acc;
  }, {} as { [category: string]: Product[] });

  const totalFilteredProducts = Object.values(filteredMenuByCategories).flat().length;


  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-t-transparent border-appTextSecondary rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!restaurant) {
    return <div className="p-4 text-center text-appTextSecondary">Restaurante não encontrado.</div>;
  }

  return (
    <div className="bg-appBg min-h-full">
      <div className="relative">
        <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-48 object-cover" />
        <button 
            onClick={() => navigate(-1)} 
            className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 bg-appFooterBg backdrop-blur-md rounded-full shadow-lg hover:bg-appHeaderButtonBg transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          {restaurant.logoUrl && 
            <img src={restaurant.logoUrl} alt={`${restaurant.name} logo`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-lg relative -bottom-4"/>
          }
        </div>
      </div>
      
      <div className="p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="pt-8 flex-1">
            <h1 className="text-2xl font-bold text-appTextPrimary mt-2">{restaurant.name}</h1>
            {restaurant.description && (
                <p className="text-appTextSecondary mt-1">{restaurant.description}</p>
            )}
            <div className="flex items-center text-sm text-yellow-400 my-2">
            <StarIcon className="w-4 h-4 mr-1" />
            <span className="text-appTextPrimary">{restaurant.rating.toFixed(1)}</span>
            <span className="text-appTextSecondary mx-2">&bull;</span>
            <span className="text-appTextSecondary">{restaurant.cuisine}</span>
            </div>
            <div className="text-xs text-appTextSecondary flex items-center mt-1">
            <span>{restaurant.deliveryTime}</span>
            {deliveryType === 'DELIVERY' && (
                <>
                <span className="mx-2">&bull;</span>
                <span className={restaurant.deliveryFee === 0 ? 'text-green-600 font-semibold' : 'text-appTextSecondary'}>
                    {restaurant.deliveryFee === 0 ? 'Entrega Grátis' : `Entrega R$ ${restaurant.deliveryFee.toFixed(2)}`}
                </span>
                </>
            )}
            </div>
        </div>
        
        <div className="w-full sm:max-w-[280px] sm:pt-8 shrink-0">
          <DeliveryTypeSelector selectedType={deliveryType} onSelectType={onDeliveryTypeChange} size="small" />
        </div>
      </div>

      <div className="bg-appBg z-10 border-b border-appBorderLight">
        <div className="flex">
          <button
            onClick={() => setActiveTab('cardapio')}
            className={`flex-1 py-3 text-center font-medium transition-colors duration-150 ${activeTab === 'cardapio' ? 'border-b-2 border-appTextPrimary text-appTextPrimary' : 'text-appTextSecondary hover:bg-appHeaderButtonBg'}`}
            aria-pressed={activeTab === 'cardapio'}
          >
            Cardápio
          </button>
          <button
            onClick={() => setActiveTab('informacoes')}
            className={`flex-1 py-3 text-center font-medium transition-colors duration-150 ${activeTab === 'informacoes' ? 'border-b-2 border-appTextPrimary text-appTextPrimary' : 'text-appTextSecondary hover:bg-appHeaderButtonBg'}`}
            aria-pressed={activeTab === 'informacoes'}
          >
            Informações
          </button>
        </div>
      </div>

      {activeTab === 'cardapio' && (
        <div className="sticky top-[60px] z-20 bg-appBg p-4 border-b border-appBorderLight shadow-sm">
          <div className="relative">
            <input
              type="search"
              value={menuSearchTerm}
              onChange={(e) => setMenuSearchTerm(e.target.value)}
              placeholder="Buscar no cardápio..."
              className="w-full pl-10 pr-4 py-2 border border-appBorderLight rounded-lg shadow-sm focus:ring-appTextPrimary focus:border-appTextPrimary bg-white text-appTextPrimary placeholder-appTextSecondary"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-appTextSecondary" />
          </div>
        </div>
      )}

      <div className="p-4">
        {activeTab === 'cardapio' && (
          <div className="space-y-6">
            {menu.length === 0 && <p className="text-appTextSecondary">Nenhum item no cardápio no momento.</p>}
            
            {menu.length > 0 && totalFilteredProducts > 0 && (
              Object.entries(filteredMenuByCategories).map(([category, products]) => (
                <section key={category}>
                  <h2 className="text-appTextPrimary text-[20px] font-bold leading-tight tracking-[-0.015em] mb-3 sticky top-[128px] bg-appBg py-2 z-10">{category}</h2>
                  <div className="space-y-3">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))
            )}
            
            {menu.length > 0 && totalFilteredProducts === 0 && (
              <div className="text-center py-10">
                  <SearchIcon className="w-16 h-16 text-appTextSecondary/30 mx-auto mb-4"/>
                  <p className="text-appTextSecondary text-lg">Nenhum item encontrado.</p>
                  <p className="text-appTextSecondary/80">Tente buscar por outro termo no cardápio.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'informacoes' && restaurant.info && (
          <div className="bg-white p-4 rounded-lg shadow space-y-3 text-sm text-appTextSecondary border border-appBorderLight">
            <h2 className="text-appTextPrimary text-xl font-semibold mb-2">Informações da Loja</h2>
            <p><strong>Endereço:</strong> {restaurant.info.address}</p>
            <p><strong>CNPJ:</strong> {restaurant.info.cnpj}</p>
            <p><strong>Formas de Pagamento:</strong> {restaurant.info.paymentMethods.join(', ')}</p>
          </div>
        )}
         {activeTab === 'informacoes' && !restaurant.info && (
            <p className="text-appTextSecondary">Informações da loja não disponíveis.</p>
         )}
      </div>
    </div>
  );
};

export default StoreScreen;
