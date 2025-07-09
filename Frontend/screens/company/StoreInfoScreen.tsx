

import React, { useState, useRef, useEffect } from 'react';
import { Restaurant } from '../../types';
import { MOCK_RESTAURANTS } from '../../data';
import { ArrowUpTrayIcon, XMarkIcon, SparklesIcon } from '../../icons';
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PhotoPlaceholderIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-800/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </label>
);

const ImageUploadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onImageReady: (base64: string) => void;
    aiPromptSuggestion: string;
}> = ({ isOpen, onClose, onImageReady, aiPromptSuggestion }) => {
    const [aiPrompt, setAiPrompt] = useState(aiPromptSuggestion);
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isOpen) {
            setAiPrompt(aiPromptSuggestion);
        }
    }, [isOpen, aiPromptSuggestion]);
    
    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onImageReady(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateClick = async () => {
        if (!aiPrompt.trim()) {
            alert("Por favor, digite uma descrição para a imagem.");
            return;
        }
        setIsGenerating(true);
        try {
            // const response = await ai.models.generateImages({
            //     model: 'imagen-3.0-generate-002',
            //     prompt: aiPrompt,
            //     config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            // });
            // const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            // const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            // onImageReady(imageUrl);
            alert("Gerador de imagem de IA está desabilitado no momento.");
        } catch (error) {
            console.error("Erro ao gerar imagem:", error);
            alert("Ocorreu um erro ao gerar a imagem. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Escolha a imagem</h2>
          
          <div className="space-y-4">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowUpTrayIcon className="w-6 h-6 text-gray-600"/>
                <span className="font-semibold text-gray-700">Fazer Upload</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

              <div className="flex items-center">
                  <hr className="flex-grow border-gray-200"/>
                  <span className="mx-4 text-gray-400 text-sm">OU</span>
                  <hr className="flex-grow border-gray-200"/>
              </div>

              <div>
                <div className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50/50 flex-col">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-gray-600"/>
                        <span className="font-semibold text-gray-700">Gerar com IA</span>
                    </div>
                    <p className="text-sm text-gray-500 text-center -mt-2 mb-2">Descreva a imagem que você quer criar.</p>
                    <div className="w-full flex gap-2">
                        <input 
                            type="text" 
                            value={aiPrompt} 
                            onChange={e => setAiPrompt(e.target.value)} 
                            placeholder="Ex: Logo para hamburgueria" 
                            className="input flex-grow" 
                        />
                        <button 
                            type="button" 
                            onClick={handleGenerateClick} 
                            disabled={isGenerating} 
                            className="btn-primary whitespace-nowrap"
                        >
                            {isGenerating ? 'Gerando...' : 'Gerar'}
                        </button>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    );
};


const ImageDisplay: React.FC<{
  label: string;
  imageUrl?: string;
  onClick: () => void;
  isLogo?: boolean;
}> = ({ label, imageUrl, onClick, isLogo = false }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div
                onClick={onClick}
                className={`relative bg-gray-100 border-2 border-dashed border-gray-300 w-full ${isLogo ? 'h-32 w-32 rounded-full' : 'h-32 rounded-lg'} flex items-center justify-center cursor-pointer group`}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="Pré-visualização" className={`object-cover ${isLogo ? 'h-full w-full rounded-full' : 'h-full w-full rounded-lg'}`} />
                ) : (
                    <PhotoPlaceholderIcon className="h-12 w-12 text-gray-400" />
                )}
                <div
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold"
                >
                    Trocar Imagem
                </div>
            </div>
        </div>
    );
};


const availablePayments = ["Cartão de Crédito", "Cartão de Débito", "Pix", "Dinheiro", "Vale Refeição"];

interface StoreInfoScreenProps {
  isStoreOpen: boolean;
  onToggleStoreOpen: () => void;
}

const StoreInfoScreen: React.FC<StoreInfoScreenProps> = ({ isStoreOpen, onToggleStoreOpen }) => {
  const [restaurant, setRestaurant] = useState<Restaurant>(MOCK_RESTAURANTS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageTarget, setImageTarget] = useState<'logoUrl' | 'imageUrl' | null>(null);

  const handleOpenImageModal = (target: 'logoUrl' | 'imageUrl') => {
      setImageTarget(target);
      setIsImageModalOpen(true);
  };

  const handleImageChange = (base64: string) => {
    if (imageTarget) {
      setRestaurant(prev => ({ ...prev, [imageTarget]: base64 }));
    }
    setIsImageModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({ ...prev, [name]: name === 'deliveryFee' ? parseFloat(value) : value }));
  };
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setRestaurant(prev => ({
          ...prev,
          info: {
              ...(prev.info || { address: '', cnpj: '', paymentMethods: [] }),
              [name]: value
          }
      }));
  };

  const handlePaymentChange = (paymentMethod: string, isChecked: boolean) => {
      setRestaurant(prev => {
          const currentMethods = prev.info?.paymentMethods || [];
          const newMethods = isChecked
              ? [...new Set([...currentMethods, paymentMethod])]
              : currentMethods.filter(pm => pm !== paymentMethod);
          
          return {
              ...prev,
              info: {
                  ...(prev.info || { address: '', cnpj: '' }),
                  paymentMethods: newMethods
              }
          };
      });
  };

  const handleOpeningHoursChange = (dayOfWeek: string, field: 'opens' | 'closes' | 'isOpen', value: string | boolean) => {
    setRestaurant(prev => ({
        ...prev,
        openingHours: (prev.openingHours || []).map(d => 
            d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d
        ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    console.log("Saving restaurant data:", restaurant);
    setTimeout(() => {
        setIsSaving(false);
        alert("Informações salvas com sucesso! (Simulação)");
    }, 1000);
  };

  return (
    <>
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 h-full overflow-y-auto">
      <style>{`.input { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { ring: 1; border-color: #1f2937; outline:none; } .btn-primary { background-color: #1f2937; color: white; padding: 0.625rem 1.25rem; border-radius: 0.375rem; font-weight: 600; transition: background-color 0.2s; } .btn-primary:hover { background-color: #374151; } .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }`}</style>
      <header className="flex flex-wrap gap-4 justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Informações da Loja</h1>
            <p className="text-gray-600 mt-1">Atualize os dados que seus clientes veem no aplicativo.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${isStoreOpen ? 'text-green-600' : 'text-red-600'}`}>
                {isStoreOpen ? 'Loja Aberta' : 'Loja Fechada'}
            </span>
            <ToggleSwitch checked={isStoreOpen} onChange={onToggleStoreOpen} />
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          
          {/* Visual Identity Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Identidade Visual</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <ImageDisplay label="Logo da loja (Formato redondo)" imageUrl={restaurant.logoUrl} onClick={() => handleOpenImageModal('logoUrl')} isLogo />
                  <ImageDisplay label="Imagem de capa (Formato retangular)" imageUrl={restaurant.imageUrl} onClick={() => handleOpenImageModal('imageUrl')} />
              </div>
          </div>

          {/* Main Info Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Informações Principais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
                      <input type="text" name="name" id="name" value={restaurant.name} onChange={handleInputChange} className="input" required />
                  </div>
                  <div>
                      <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cozinha</label>
                      <input type="text" name="cuisine" id="cuisine" value={restaurant.cuisine} onChange={handleInputChange} className="input" placeholder="Ex: Hambúrguer, Pizza, Japonesa" required />
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
                      <textarea name="description" id="description" value={restaurant.description || ''} onChange={handleInputChange} rows={3} className="input" placeholder="Descreva sua loja em poucas palavras."></textarea>
                  </div>
              </div>
          </div>

          {/* Operating Hours Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Horários de Funcionamento</h2>
            <div className="space-y-3">
                {(restaurant.openingHours || []).map((day, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr,auto,auto,auto] gap-3 sm:gap-4 items-center">
                        <label className="font-medium text-gray-700 sm:col-auto">{day.dayOfWeek}</label>
                        <input
                            type="time"
                            value={day.opens}
                            onChange={(e) => handleOpeningHoursChange(day.dayOfWeek, 'opens', e.target.value)}
                            className="input w-full"
                            disabled={!day.isOpen}
                        />
                        <input
                            type="time"
                            value={day.closes}
                            onChange={(e) => handleOpeningHoursChange(day.dayOfWeek, 'closes', e.target.value)}
                            className="input w-full"
                            disabled={!day.isOpen}
                        />
                        <div className="flex items-center justify-end gap-2">
                            <ToggleSwitch
                                checked={day.isOpen}
                                onChange={(val) => handleOpeningHoursChange(day.dayOfWeek, 'isOpen', val)}
                            />
                             <span className={`text-xs w-14 text-right font-semibold ${day.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                {day.isOpen ? 'Aberto' : 'Fechado'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Delivery Info Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Informações de Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">Tempo de Entrega</label>
                      <input type="text" name="deliveryTime" id="deliveryTime" value={restaurant.deliveryTime} onChange={handleInputChange} className="input" placeholder="Ex: 30-45 min" required />
                  </div>
                  <div>
                      <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-1">Taxa de Entrega (R$)</label>
                      <input type="number" name="deliveryFee" id="deliveryFee" value={restaurant.deliveryFee} onChange={handleInputChange} className="input" step="0.50" required placeholder="Digite 0 para grátis" />
                  </div>
              </div>
          </div>
          
          {/* Business Info Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Informações do Negócio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                      <input type="text" name="address" id="address" value={restaurant.info?.address || ''} onChange={handleInfoChange} className="input" />
                  </div>
                  <div>
                      <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                      <input type="text" name="cnpj" id="cnpj" value={restaurant.info?.cnpj || ''} onChange={handleInfoChange} className="input" />
                  </div>
              </div>
          </div>

           {/* Payment Methods Section */}
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Formas de Pagamento</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {availablePayments.map(method => (
                      <label key={method} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input
                              type="checkbox"
                              checked={restaurant.info?.paymentMethods.includes(method) || false}
                              onChange={(e) => handlePaymentChange(method, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                          />
                          {method}
                      </label>
                  ))}
              </div>
           </div>

        </div>

        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={isSaving} className="btn-primary">
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
    <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageReady={handleImageChange}
        aiPromptSuggestion={imageTarget === 'logoUrl' ? `Logo para ${restaurant.cuisine.toLowerCase()} chamada ${restaurant.name}` : `Foto de capa para restaurante de ${restaurant.cuisine.toLowerCase()}`}
    />
    </>
  );
};

export default StoreInfoScreen;
