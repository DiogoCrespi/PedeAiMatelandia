


import React, { useState, useRef, useEffect } from 'react';
import { Restaurant } from '../../types';
import * as api from '../../api';
import { ArrowUpTrayIcon, XMarkIcon, SparklesIcon } from '../../icons';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

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
                onClose();
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
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: aiPrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            onImageReady(imageUrl);
            onClose();
        } catch (error) {
            console.error("Erro ao gerar imagem:", error);
            alert("Ocorreu um erro ao gerar a imagem. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Escolher Imagem</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">Faça o upload de uma imagem ou gere uma nova com Inteligência Artificial.</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full btn-secondary flex items-center justify-center gap-2">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Fazer Upload
                    </button>
                    <div className="flex items-center gap-2">
                        <hr className="flex-grow border-gray-200" />
                        <span className="text-xs text-gray-500">OU</span>
                        <hr className="flex-grow border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700">Descrição para IA</label>
                        <textarea
                            id="ai-prompt"
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder="Ex: Fachada de uma hamburgueria moderna à noite"
                            rows={3}
                            className="input w-full"
                        />
                         <button type="button" onClick={handleGenerateClick} disabled={isGenerating} className="w-full btn-primary flex items-center justify-center gap-2">
                            <SparklesIcon className="w-5 h-5" />
                            {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Main screen component
const StoreInfoScreen: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImageFor, setEditingImageFor] = useState<'logo' | 'banner' | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getRestaurantById('rest1');
        setRestaurant(data || null);
      } catch (e) {
        console.error("Failed to fetch restaurant data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreData();
  }, []);

  if (isLoading || !restaurant) {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-gray-800 rounded-full animate-spin"></div>
        </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('info.')) {
        const infoField = name.split('.')[1];
        setRestaurant(prev => prev ? ({ ...prev, info: { ...(prev.info!), [infoField]: value }}) : null);
    } else {
        setRestaurant(prev => prev ? ({ ...prev, [name]: value }) : null);
    }
  };

  const handleToggleStoreOpen = (isOpen: boolean) => {
    setRestaurant(prev => prev ? ({ ...prev, isStoreOpenManually: isOpen }) : null);
  }

  const handleImageChange = (base64: string) => {
    if (editingImageFor === 'logo') {
        setRestaurant(prev => prev ? ({...prev, logoUrl: base64}) : null);
    } else if (editingImageFor === 'banner') {
        setRestaurant(prev => prev ? ({...prev, imageUrl: base64}) : null);
    }
    setIsModalOpen(false);
  }

  const handleSave = async () => {
      if (!restaurant) return;
      try {
        await api.updateRestaurant(restaurant.id, restaurant);
        alert("Informações salvas com sucesso!");
      } catch(error) {
        console.error("Failed to save restaurant info:", error);
        alert("Erro ao salvar informações.");
      }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 h-full overflow-y-auto">
        <style>{`.input { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { outline:none; } .btn-primary { background-color: #1f2937; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; } .btn-secondary { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }`}</style>
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Informações da Loja</h1>
        <p className="text-gray-600 mt-1">Edite os dados principais, horários e aparência da sua loja no app.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados Principais</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
                        <input type="text" name="name" value={restaurant.name} onChange={handleInputChange} className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Culinária/Segmento</label>
                        <input type="text" name="cuisine" value={restaurant.cuisine} onChange={handleInputChange} className="input" placeholder="Ex: Hambúrguer, Pizza, Lanches"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
                        <textarea name="description" value={restaurant.description} onChange={handleInputChange} rows={3} className="input"></textarea>
                    </div>
                </div>
            </div>
            
             <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados de Contato e Fiscais</h2>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <input type="text" name="info.address" value={restaurant.info?.address} onChange={handleInputChange} className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                        <input type="text" name="info.cnpj" value={restaurant.info?.cnpj} onChange={handleInputChange} className="input" />
                    </div>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Horário de Funcionamento</h2>
                <div className="space-y-3">
                    {restaurant.openingHours?.map((hour, index) => (
                        <div key={index} className="grid grid-cols-4 gap-3 items-center">
                            <label className="font-medium text-gray-700">{hour.dayOfWeek}</label>
                             <ToggleSwitch checked={hour.isOpen} onChange={() => { /* Implement state change */ }} />
                            <input type="time" value={hour.opens} disabled={!hour.isOpen} className="input" />
                            <input type="time" value={hour.closes} disabled={!hour.isOpen} className="input" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Loja Aberta/Fechada</h2>
                <div className="flex justify-between items-center">
                    <span className={`font-semibold ${restaurant.isStoreOpenManually ? 'text-green-600' : 'text-red-600'}`}>
                        {restaurant.isStoreOpenManually ? 'Aberta no app' : 'Fechada no app'}
                    </span>
                    <ToggleSwitch checked={restaurant.isStoreOpenManually || false} onChange={handleToggleStoreOpen} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Use esta opção para fechar a loja manualmente em caso de imprevistos.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Imagens da Loja</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                        <div onClick={() => { setEditingImageFor('logo'); setIsModalOpen(true); }} className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed">
                             {restaurant.logoUrl ? <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full rounded-full object-cover"/> : <PhotoPlaceholderIcon className="w-10 h-10 text-gray-400" />}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
                         <div onClick={() => { setEditingImageFor('banner'); setIsModalOpen(true); }} className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed">
                            {restaurant.imageUrl ? <img src={restaurant.imageUrl} alt="Banner" className="w-full h-full rounded-lg object-cover"/> : <PhotoPlaceholderIcon className="w-12 h-12 text-gray-400" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} className="btn-primary px-8 py-3 text-lg">Salvar Alterações</button>
      </div>
      
       <ImageUploadModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onImageReady={handleImageChange}
            aiPromptSuggestion={
                editingImageFor === 'logo' ? `logo para uma loja chamada ${restaurant.name}` :
                editingImageFor === 'banner' ? `fachada ou prato principal para uma loja de ${restaurant.cuisine}` : ''
            }
       />
    </div>
  );
};

export default StoreInfoScreen;