

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Product, SelectedProductOption, User, ProductOptionChoice } from '../types';
import { ROUTE_PATHS } from '../constants';
import * as api from '../api';
import { PlusIcon, MinusIcon, ChevronLeftIcon, GoogleIcon } from '../icons';

interface ProductScreenProps {
  addToCart: (product: Product, quantity: number, selectedOptions?: SelectedProductOption[], observations?: string) => void;
  currentUser: User | null;
  onSocialLogin: (user: User, fromPath?: string) => void;
}

const ProductScreen: React.FC<ProductScreenProps> = ({ addToCart, currentUser, onSocialLogin }) => {
  const { storeId, productId } = useParams<{ storeId: string, productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedProductOption[]>([]);
  const [observations, setObservations] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
        if (productId) {
            setIsLoading(true);
            try {
                const foundProduct = await api.getProductById(productId);
                if (foundProduct && foundProduct.restaurantId === storeId) {
                    setProduct(foundProduct);
                    setTotalPrice(foundProduct.price);
                    const initialSelected: SelectedProductOption[] = [];
                    foundProduct.options?.forEach(group => {
                        if (group.type === 'single' && group.required && group.choices.length > 0) {
                            initialSelected.push({ groupName: group.name, choiceName: group.choices[0].name, priceAdjustment: group.choices[0].priceAdjustment || 0 });
                        }
                    });
                    setSelectedOptions(initialSelected);
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        }
    };
    fetchProduct();
  }, [storeId, productId]);

  useEffect(() => {
    if (product) {
      let currentPrice = product.price;
      selectedOptions.forEach(opt => {
        currentPrice += opt.priceAdjustment || 0;
      });
      setTotalPrice(currentPrice * quantity);
    }
  }, [product, quantity, selectedOptions]);

  const handleOptionChange = (groupName: string, choice: ProductOptionChoice, groupType: 'single' | 'multiple', isSelected?: boolean) => {
    setSelectedOptions(prev => {
      let newOptions = [...prev];
      if (groupType === 'single') {
        newOptions = newOptions.filter(opt => opt.groupName !== groupName);
        newOptions.push({ groupName, choiceName: choice.name, priceAdjustment: choice.priceAdjustment || 0 });
      } else { 
        const existingIndex = newOptions.findIndex(opt => opt.groupName === groupName && opt.choiceName === choice.name);
        if (isSelected && existingIndex === -1) { 
          newOptions.push({ groupName, choiceName: choice.name, priceAdjustment: choice.priceAdjustment || 0 });
        } else if (!isSelected && existingIndex > -1) { 
          newOptions.splice(existingIndex, 1);
        }
      }
      return newOptions;
    });
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (!product) return;
    
    const requiredGroups = product.options?.filter(g => g.required).map(g => g.name) || [];
    const selectedGroups = [...new Set(selectedOptions.map(o => o.groupName))];
    const missingRequired = requiredGroups.filter(rg => !selectedGroups.includes(rg));

    if (missingRequired.length > 0) {
      alert(`Por favor, selecione uma opção para: ${missingRequired.join(', ')}`);
      return;
    }
    
    addToCart(product, quantity, selectedOptions, observations);
  };

  const handleGoogleLogin = async () => {
    try {
        const user = await api.login('social@example.com', 'password'); // Mock social login
        if (user) {
            onSocialLogin(user, location.pathname);
            setShowLoginPrompt(false);
        }
    } catch (error) {
        console.error("Social login failed:", error);
        alert("Falha no login com Google.");
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-t-transparent border-appTextSecondary rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!product) {
    return <div className="p-4 text-center">Produto não encontrado.</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 bg-appFooterBg backdrop-blur-md rounded-full shadow-lg hover:bg-appHeaderButtonBg transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-grow">
        <h1 className="text-2xl font-bold text-appTextPrimary">{product.name}</h1>
        <p className="text-appTextSecondary">{product.description}</p>
        
        {product.options && product.options.map((group) => (
          <div key={group.id} className="border-t border-appBorderLight pt-4">
            <h2 className="text-lg font-semibold text-appTextPrimary">{group.name} {group.required && <span className="text-red-500 text-sm ml-1">*</span>}</h2>
            <p className="text-sm text-appTextSecondary mb-2">{group.type === 'single' ? 'Escolha 1 opção' : 'Escolha quantas desejar'}</p>
            <div className="space-y-2">
              {group.choices.map((choice, index) => {
                const isChecked = selectedOptions.some(opt => opt.groupName === group.name && opt.choiceName === choice.name);
                const inputType = group.type === 'single' ? 'radio' : 'checkbox';
                const inputId = `${group.id}-${index}`;
                
                return (
                  <label htmlFor={inputId} key={index} className="flex items-center justify-between p-3 border rounded-lg hover:border-appTextPrimary cursor-pointer transition-colors has-[:checked]:border-appTextPrimary has-[:checked]:bg-appHeaderButtonBg/30">
                    <div className="flex items-center">
                      <input
                        type={inputType}
                        id={inputId}
                        name={group.id} // use group id for radio button grouping
                        checked={isChecked}
                        onChange={(e) => handleOptionChange(group.name, choice, group.type, e.target.checked)}
                        className={`h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary border-gray-300 ${inputType === 'checkbox' ? 'rounded' : 'rounded-full'}`}
                      />
                      <span className="ml-3 text-appTextPrimary">{choice.name}</span>
                    </div>
                    {choice.priceAdjustment && (
                      <span className="text-sm text-green-600 font-medium">
                        + R$ {choice.priceAdjustment.toFixed(2)}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="border-t border-appBorderLight pt-4">
            <label htmlFor="observations" className="text-lg font-semibold text-appTextPrimary">Observações</label>
            <textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
                placeholder="Ex: sem cebola, ponto da carne, etc."
                className="mt-2 w-full p-3 border border-appBorderLight rounded-lg focus:ring-appTextPrimary focus:border-appTextPrimary bg-white text-appTextPrimary placeholder-appTextSecondary"
            ></textarea>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-appFooterBg backdrop-blur-md p-4 border-t border-appBorderLight shadow-lg mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 bg-appHeaderButtonBg rounded-full text-appTextPrimary hover:bg-appHeaderButtonBgHover transition-colors" aria-label="Diminuir quantidade">
              <MinusIcon className="w-5 h-5"/>
            </button>
            <span className="text-xl font-bold w-8 text-center text-appTextPrimary">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="p-2 bg-appHeaderButtonBg rounded-full text-appTextPrimary hover:bg-appHeaderButtonBgHover transition-colors" aria-label="Aumentar quantidade">
              <PlusIcon className="w-5 h-5"/>
            </button>
          </div>
          <button onClick={handleAddToCart} className="flex-1 ml-4 bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Adicionar R$ {totalPrice.toFixed(2)}
          </button>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-sm">
            <h3 className="text-lg font-semibold text-appTextPrimary mb-2">Faça Login para Continuar</h3>
            <p className="text-appTextSecondary mb-4">Você precisa estar logado para adicionar itens ao carrinho.</p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <button onClick={() => setShowLoginPrompt(false)} className="flex-1 px-4 py-2 border border-appBorderLight rounded-md text-appTextPrimary hover:bg-appHeaderButtonBg">Agora não</button>
                <button onClick={() => navigate(ROUTE_PATHS.LOGIN, { state: { from: location } })} className="flex-1 px-4 py-2 bg-appPrimaryActionBg text-appPrimaryActionText rounded-md">Fazer Login</button>
              </div>
              <div className="flex items-center">
                <hr className="flex-grow border-appBorderLight"/>
                <span className="mx-4 text-appTextSecondary text-xs">OU</span>
                <hr className="flex-grow border-appBorderLight"/>
              </div>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-2.5 border border-appBorderLight rounded-lg hover:bg-appHeaderButtonBg text-appTextPrimary transition-colors"
              >
                <GoogleIcon className="w-5 h-5 mr-3" />
                Entrar com Google
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
