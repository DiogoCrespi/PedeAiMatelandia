


import React, { useState, useEffect } from 'react';
import { Product, Category as CategoryType, ProductOptionGroup, ProductOptionChoice } from '../../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../data';
import { 
    PlusIcon, TrashIcon, PencilIcon, XMarkIcon, ChevronDownIcon,
    DocumentArrowUpIcon, CameraIcon, SparklesIcon, ArrowUpTrayIcon,
    DocumentPlusIcon,
    DocumentTextIcon
} from '../../icons';
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type MenuCategory = CategoryType & { products: Product[] };

// --- AI Menu Import Modal ---
const MenuFromFileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}> = ({ isOpen, onClose, onImport }) => {
    type ParsedProduct = Partial<Product> & { included: boolean; imageUrl?: string; };
    
    interface FilePreview {
        url: string | null;
        name: string;
        type: string;
    }

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<FilePreview>({ url: null, name: '', type: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [parsedProducts, setParsedProducts] = useState<ParsedProduct[] | null>(null);
    const [generatingImages, setGeneratingImages] = useState<Record<number, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const individualFileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadingImageForIndex, setUploadingImageForIndex] = useState<number | null>(null);


    const resetState = () => {
        setSelectedFile(null);
        setFilePreview({ url: null, name: '', type: '' });
        setIsGenerating(false);
        setParsedProducts(null);
        setGeneratingImages({});
        setError(null);
        setUploadingImageForIndex(null);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            resetState(); // Reset if a new file is chosen
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview({
                    url: reader.result as string,
                    name: file.name,
                    type: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateMenu = async () => {
        if (!selectedFile || !filePreview.url) {
            setError("Por favor, selecione um arquivo primeiro.");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setParsedProducts(null);
        
        try {
            const base64Data = filePreview.url.split(',')[1];
            const prompt = `Analise a imagem, PDF ou arquivo CSV deste cardápio. Extraia todos os itens, incluindo nome, descrição, preço e categoria. Retorne um array JSON válido. Cada objeto no array deve ter as chaves: "name" (string), "description" (string, pode ser vazia), "price" (number), and "category" (string). O preço deve ser um número, sem símbolos de moeda. Agrupe os itens em categorias lógicas.`;

            // const response = await ai.models.generateContent({
            //     model: 'gemini-2.5-flash',
            //     contents: [{
            //       text: prompt
            //     }, {
            //       inlineData: {
            //         mimeType: selectedFile.type,
            //         data: base64Data,
            //       },
            //     }],
            //      config: {
            //         responseMimeType: "application/json",
            //      }
            // });

            // let jsonStr = response.text.trim();
            // const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
            // const match = jsonStr.match(fenceRegex);
            // if (match && match[2]) {
            //   jsonStr = match[2].trim();
            // }

            // const parsedData: any[] = JSON.parse(jsonStr);
            // if (!Array.isArray(parsedData)) throw new Error("A resposta da IA não foi um array.");

            // const products: ParsedProduct[] = parsedData.map(item => ({
            //     name: item.name || '',
            //     description: item.description || '',
            //     price: typeof item.price === 'number' ? item.price : 0,
            //     category: item.category || 'Outros',
            //     included: true,
            //     isAvailable: true,
            //     imageUrl: '',
            // }));
            // setParsedProducts(products);

        } catch (e) {
            console.error("Erro ao processar o cardápio:", e);
            setError("Não foi possível processar o arquivo. Verifique se o arquivo é nítido e tente novamente. Detalhe: " + (e as Error).message);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleGenerateAllImages = async () => {
        if (!parsedProducts) return;

        const productsToGenerate = parsedProducts
            .map((p, i) => ({ ...p, originalIndex: i }))
            .filter(p => p.included);
        
        if (productsToGenerate.length === 0) {
            alert("Selecione pelo menos um item para gerar imagens.");
            return;
        }

        const initialGeneratingState: Record<number, boolean> = {};
        productsToGenerate.forEach(p => {
            initialGeneratingState[p.originalIndex] = true;
        });
        setGeneratingImages(initialGeneratingState);
        
        productsToGenerate.forEach(product => (async () => {
            try {
                const lowerCaseName = (product.name || '').toLowerCase();
                let foodDescription = `${product.name}, ${product.description || ''}`;

                if (lowerCaseName.includes('pizza')) {
                    // Specific prompt for pizza is implicitly handled by the name
                } else if (lowerCaseName.includes('x-') || lowerCaseName.startsWith('x ')) {
                    foodDescription = `um hambúrguer estilo x-burguer chamado "${product.name}", ${product.description || ''}`;
                } else if (lowerCaseName.includes('hambúrguer')) {
                    foodDescription = `um hambúrguer chamado "${product.name}", ${product.description || ''}`;
                } else if (lowerCaseName.includes('pão árabe') || lowerCaseName.includes('shawarma')) {
                    foodDescription = `um shawarma (lanche no pão árabe) chamado "${product.name}", ${product.description || ''}`;
                }
                
                const prompt = `Imagem para um aplicativo de delivery de comida. Foto de estúdio profissional, realista e apetitosa de ${foodDescription}. Foco no prato principal. Fundo limpo, neutro ou branco para destacar a comida. Sem texto, pessoas ou mãos na imagem.`;

                // const response = await ai.models.generateImages({
                //     model: 'imagen-3.0-generate-002',
                //     prompt: prompt,
                //     config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
                // });

                // const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                // const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                
                // setParsedProducts(prev => {
                //     if (!prev) return null;
                //     const newProducts = [...prev];
                //     newProducts[product.originalIndex].imageUrl = imageUrl;
                //     return newProducts;
                // });
            } catch (error) {
                console.error(`Erro ao gerar imagem para ${product.name}:`, error);
            } finally {
                setGeneratingImages(prev => {
                    const newState = { ...prev };
                    delete newState[product.originalIndex]; // Use delete to remove the key
                    return newState;
                });
            }
        })());
    };


    const handleProductChange = (index: number, field: keyof ParsedProduct, value: string | number | boolean) => {
        if (!parsedProducts) return;
        const newProducts = [...parsedProducts];
        (newProducts[index] as any)[field] = value;
        setParsedProducts(newProducts);
    };

    const handleRemoveImage = (index: number) => {
        handleProductChange(index, 'imageUrl', '');
    };

    const handleImageContainerClick = (index: number) => {
        if (individualFileInputRef.current) {
            setUploadingImageForIndex(index);
            individualFileInputRef.current.click();
        }
    };
    
    const handleIndividualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingImageForIndex !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                handleProductChange(uploadingImageForIndex, 'imageUrl', base64String);
                setUploadingImageForIndex(null); // Reset index
            };
            reader.readAsDataURL(file);
        }
        if (e.target) {
            e.target.value = ''; // Reset file input to allow re-upload of same file
        }
    };

    const handleConfirmImport = () => {
        if (!parsedProducts) return;
        const productsToImport = parsedProducts
            .filter(p => p.included)
            .map(({ included, ...rest }) => rest as Product); // Strip 'included' property
        onImport(productsToImport);
        handleClose();
    };

    const importedItemCount = parsedProducts?.filter(p => p.included).length || 0;
    const isGeneratingAnyImage = Object.keys(generatingImages).length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
             <input 
                type="file" 
                ref={individualFileInputRef} 
                onChange={handleIndividualFileChange} 
                accept="image/*" 
                className="hidden" 
            />
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Criar Cardápio de Arquivo</h2>
                    <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {!parsedProducts ? (
                        <div className="text-center">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf,text/csv,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" />
                            <div 
                                className="w-full h-64 bg-gray-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {filePreview.url ? (
                                    filePreview.type.startsWith('image/') ? (
                                        <img src={filePreview.url} alt="Pré-visualização do cardápio" className="max-h-full max-w-full p-2 object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center text-gray-600">
                                            <DocumentTextIcon className="w-20 h-20 text-gray-400 mb-2" />
                                            <p className="font-semibold">{filePreview.name}</p>
                                            <p className="text-sm text-gray-500">{filePreview.type}</p>
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <DocumentPlusIcon className="w-16 h-16 text-gray-400 mb-2"/>
                                        <p className="font-semibold text-gray-700">Clique para selecionar uma foto, PDF ou CSV do seu cardápio</p>
                                        <p className="text-sm text-gray-500">Ou arraste e solte o arquivo aqui</p>
                                    </>
                                )}
                            </div>

                            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                            
                            <button
                                onClick={handleGenerateMenu}
                                disabled={!filePreview.url || isGenerating}
                                className="mt-6 btn-primary px-8 py-3 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {isGenerating ? (
                                    <> <SparklesIcon className="w-5 h-5 animate-pulse" /> Analisando com IA...</>
                                ) : (
                                    <> <SparklesIcon className="w-5 h-5" /> Gerar Cardápio</>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Verifique os itens encontrados</h3>
                            <p className="text-sm text-gray-600 mb-4">Ajuste os campos se necessário e desmarque os itens que não deseja importar.</p>
                            
                            <div className="grid grid-cols-12 gap-x-3 items-center px-2 pb-2 border-b">
                                <div className="col-span-1 text-xs font-semibold text-gray-500 text-center">Nº</div>
                                <div className="col-span-1"></div>
                                <div className="col-span-2 text-xs font-semibold text-gray-500">Imagem</div>
                                <div className="col-span-3 text-xs font-semibold text-gray-500">Nome</div>
                                <div className="col-span-3 text-xs font-semibold text-gray-500">Descrição</div>
                                <div className="col-span-1 text-xs font-semibold text-gray-500">Categoria</div>
                                <div className="col-span-1 text-xs font-semibold text-gray-500">Preço</div>
                            </div>

                            <div className="space-y-2 overflow-y-auto pr-2 pt-2">
                                {parsedProducts.map((p, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-x-3 items-center p-2 rounded-md hover:bg-gray-50">
                                        <div className="col-span-1 text-center text-sm text-gray-500">{i + 1}</div>
                                        <div className="col-span-1 flex justify-center"><input type="checkbox" checked={p.included} onChange={e => handleProductChange(i, 'included', e.target.checked)} className="h-5 w-5 rounded"/></div>
                                        <div 
                                            className="relative col-span-2 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 group cursor-pointer"
                                            onClick={() => handleImageContainerClick(i)}
                                        >
                                            {generatingImages[i] ? (
                                                <SparklesIcon className="w-6 h-6 animate-pulse text-purple-500" />
                                            ) : p.imageUrl ? (
                                                <>
                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded" />
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        aria-label="Remover imagem"
                                                    >
                                                        <XMarkIcon className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <CameraIcon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="col-span-3"><input type="text" value={p.name} onChange={e => handleProductChange(i, 'name', e.target.value)} className="input text-sm" placeholder="Nome" /></div>
                                        <div className="col-span-3"><input type="text" value={p.description} onChange={e => handleProductChange(i, 'description', e.target.value)} className="input text-sm" placeholder="Descrição" /></div>
                                        <div className="col-span-1"><input type="text" value={p.category} onChange={e => handleProductChange(i, 'category', e.target.value)} className="input text-sm" placeholder="Categoria" /></div>
                                        <div className="col-span-1"><input type="number" step="0.01" value={p.price} onChange={e => handleProductChange(i, 'price', parseFloat(e.target.value) || 0)} className="input text-sm" placeholder="Preço"/></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {parsedProducts && (
                     <div className="p-4 border-t flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleGenerateAllImages}
                            className="btn-secondary flex items-center gap-2"
                            disabled={isGeneratingAnyImage}
                        >
                            <SparklesIcon className={`w-5 h-5 ${isGeneratingAnyImage ? 'animate-pulse text-purple-500' : 'text-gray-700'}`}/>
                            {isGeneratingAnyImage ? 'Gerando...' : 'Gerar Imagens com IA'}
                        </button>
                        <div className="flex gap-3">
                            <button type="button" onClick={handleClose} className="btn-secondary">Cancelar</button>
                            <button type="button" onClick={handleConfirmImport} className="btn-primary" disabled={importedItemCount === 0 || isGeneratingAnyImage}>
                                Adicionar {importedItemCount} Itens ao Cardápio
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Reusable Components ---
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-800/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </label>
);

const PhotoPlaceholderIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const ImageUploader: React.FC<{
    onImageChange: (base64: string) => void;
    initialImageUrl?: string;
    aiPrompt: string;
    onAiPromptChange: (newPrompt: string) => void;
}> = ({ onImageChange, initialImageUrl, aiPrompt, onAiPromptChange }) => {
    const [mode, setMode] = useState<'upload' | 'generate'>('upload');
    const [isGenerating, setIsGenerating] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                onImageChange(base64String);
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
        setPreview(null); // Clear preview while generating

        try {
            // const response = await ai.models.generateImages({
            //     model: 'imagen-3.0-generate-002',
            //     prompt: aiPrompt,
            //     config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            // });

            // const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            // const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            // setPreview(imageUrl);
            // onImageChange(imageUrl);
        } catch (error) {
            console.error("Erro ao gerar imagem:", error);
            alert("Ocorreu um erro ao gerar a imagem. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    useEffect(() => {
        setPreview(initialImageUrl || null);
    }, [initialImageUrl]);

    return (
        <div className="space-y-3">
            {/* Preview Area */}
            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center border border-dashed">
                {preview ? (
                    <img src={preview} alt="Pré-visualização" className="w-full h-full object-contain rounded-md p-1" />
                ) : isGenerating ? (
                     <div className="text-gray-500 animate-pulse">Gerando imagem...</div>
                ) : (
                    <div className="text-gray-500">Pré-visualização da imagem</div>
                )}
            </div>
            
            {/* Mode Selector */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <button type="button" onClick={() => setMode('upload')} className={`flex-1 p-2 text-sm font-medium transition-colors ${mode === 'upload' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Fazer Upload</button>
                <button type="button" onClick={() => setMode('generate')} className={`flex-1 p-2 text-sm font-medium transition-colors ${mode === 'generate' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Gerar com IA</button>
            </div>

            {/* Uploader / Generator */}
            {mode === 'upload' ? (
                <div>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full btn-secondary flex items-center justify-center gap-2">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Escolher arquivo
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input type="text" value={aiPrompt} onChange={e => onAiPromptChange(e.target.value)} placeholder="Ex: Hambúrguer suculento com batatas" className="input flex-grow" />
                    <button type="button" onClick={handleGenerateClick} disabled={isGenerating} className="btn-primary whitespace-nowrap">
                        {isGenerating ? 'Gerando...' : 'Gerar'}
                    </button>
                </div>
            )}
        </div>
    );
};


const CategoryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: CategoryType) => void;
    categoryToEdit: CategoryType | null;
}> = ({ isOpen, onClose, onSave, categoryToEdit }) => {
    const emptyCategory: CategoryType = { id: `cat-${Date.now()}`, name: '', imageUrl: '' };
    const [category, setCategory] = useState<CategoryType>(categoryToEdit || emptyCategory);
    
    useEffect(() => {
        setCategory(categoryToEdit || emptyCategory);
    }, [categoryToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory(c => ({...c, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(category);
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">{categoryToEdit ? 'Editar' : 'Adicionar'} Categoria</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                        <input type="text" name="name" value={category.name} onChange={handleChange} className="w-full input" required />
                    </div>
                     <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar Categoria</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
  categories: Omit<CategoryType, 'imageUrl'>[];
  restaurantId: string;
  scrollToImage: boolean;
}> = ({ isOpen, onClose, onSave, productToEdit, categories, restaurantId, scrollToImage }) => {
    const emptyProduct: Product = {
        id: `prod-${Date.now()}`,
        name: '', description: '', price: 0, imageUrl: '', restaurantId: restaurantId, category: categories[0]?.name || '', isAvailable: true, options: []
    };
    const [product, setProduct] = useState<Product>(productToEdit || emptyProduct);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAiPromptManuallyEdited, setIsAiPromptManuallyEdited] = useState(false);
    const imageSectionRef = React.useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const initialProduct = productToEdit || emptyProduct;
        setProduct(initialProduct);
        setAiPrompt(initialProduct.name);
        setIsAiPromptManuallyEdited(false);
    }, [productToEdit, isOpen]);

    useEffect(() => {
        if (isOpen && scrollToImage) {
            setTimeout(() => {
                imageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        }
    }, [isOpen, scrollToImage]);


    if (!isOpen) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'price' ? parseFloat(value) : value)
        
        setProduct(p => ({ ...p, [name]: finalValue }));

        if (name === 'name' && !isAiPromptManuallyEdited) {
            setAiPrompt(value);
        }
    };
    
    const handleAiPromptChange = (newPrompt: string) => {
        setAiPrompt(newPrompt);
        setIsAiPromptManuallyEdited(true);
    };

    const handleOptionGroupChange = (groupIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const updatedOptions = [...(product.options || [])];
        updatedOptions[groupIndex] = { ...updatedOptions[groupIndex], [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value };
        setProduct(p => ({ ...p, options: updatedOptions }));
    };
    
    const handleOptionChoiceChange = (groupIndex: number, choiceIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedOptions = [...(product.options || [])];
        const choice = updatedOptions[groupIndex].choices[choiceIndex];
        updatedOptions[groupIndex].choices[choiceIndex] = { ...choice, [name]: name === 'priceAdjustment' ? parseFloat(value) : value };
        setProduct(p => ({ ...p, options: updatedOptions }));
    };

    const addOptionGroup = () => {
        const newGroup: ProductOptionGroup = { id: `group-${Date.now()}`, name: '', type: 'single', choices: [], required: false };
        setProduct(p => ({ ...p, options: [...(p.options || []), newGroup] }));
    };

    const addOptionChoice = (groupIndex: number) => {
        const newChoice: ProductOptionChoice = { name: '', priceAdjustment: 0 };
        const updatedOptions = [...(product.options || [])];
        updatedOptions[groupIndex].choices.push(newChoice);
        setProduct(p => ({ ...p, options: updatedOptions }));
    };

    const removeOptionGroup = (groupIndex: number) => {
        setProduct(p => ({ ...p, options: p.options?.filter((_, i) => i !== groupIndex) }));
    };
    
    const removeOptionChoice = (groupIndex: number, choiceIndex: number) => {
        const updatedOptions = [...(product.options || [])];
        updatedOptions[groupIndex].choices = updatedOptions[groupIndex].choices.filter((_, i) => i !== choiceIndex);
        setProduct(p => ({ ...p, options: updatedOptions }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">{productToEdit ? 'Editar' : 'Adicionar'} Produto</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                        <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea name="description" value={product.description} onChange={handleChange} rows={3} className="w-full input"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                            <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full input" required step="0.01" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select name="category" value={product.category} onChange={handleChange} className="w-full input" required>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div ref={imageSectionRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
                        <ImageUploader
                            onImageChange={(base64) => setProduct(p => ({ ...p, imageUrl: base64 }))}
                            initialImageUrl={product.imageUrl}
                            aiPrompt={aiPrompt}
                            onAiPromptChange={handleAiPromptChange}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-4 pt-4 border-t">
                         <div className="flex justify-between items-center">
                            <h3 className="text-md font-semibold text-gray-800">Opções do Produto</h3>
                            <button type="button" onClick={addOptionGroup} className="btn-secondary text-sm py-1 px-2">Adicionar Grupo</button>
                        </div>
                        {product.options?.map((group, groupIndex) => (
                            <div key={group.id} className="p-4 border rounded-md space-y-3 bg-gray-50/50">
                                <div className="flex justify-between items-center">
                                    <input type="text" name="name" value={group.name} onChange={(e) => handleOptionGroupChange(groupIndex, e)} placeholder="Nome do Grupo (ex: Tamanho)" className="input font-semibold flex-grow"/>
                                    <button type="button" onClick={() => removeOptionGroup(groupIndex)} className="ml-4 text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select name="type" value={group.type} onChange={(e) => handleOptionGroupChange(groupIndex, e)} className="input text-sm">
                                        <option value="single">Escolha Única</option>
                                        <option value="multiple">Múltipla Escolha</option>
                                    </select>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="required" checked={group.required} onChange={(e) => handleOptionGroupChange(groupIndex, e)} /> Obrigatório</label>
                                </div>
                                {/* Choices */}
                                <div className="space-y-2 pt-2">
                                     <h4 className="text-sm font-medium text-gray-600">Opções:</h4>
                                    {group.choices.map((choice, choiceIndex) => (
                                        <div key={choiceIndex} className="flex items-center gap-2">
                                            <input type="text" name="name" value={choice.name} onChange={(e) => handleOptionChoiceChange(groupIndex, choiceIndex, e)} placeholder="Nome da Opção" className="input text-sm flex-grow"/>
                                            <input type="number" name="priceAdjustment" value={choice.priceAdjustment || ''} onChange={(e) => handleOptionChoiceChange(groupIndex, choiceIndex, e)} placeholder="Preço (+/-)" className="input text-sm w-28"/>
                                            <button type="button" onClick={() => removeOptionChoice(groupIndex, choiceIndex)} className="text-gray-400 hover:text-red-500"><XMarkIcon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => addOptionChoice(groupIndex)} className="btn-secondary text-xs py-1 px-2">Adicionar Opção</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar Produto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Screen Component ---
const MenuManagementScreen: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [scrollToImageOnOpen, setScrollToImageOnOpen] = useState(false);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

  const [isMenuFromFileModalOpen, setIsMenuFromFileModalOpen] = useState(false);


  useEffect(() => {
    // Combine mock data into a usable structure
    const categories: Omit<CategoryType, 'imageUrl'>[] = MOCK_CATEGORIES.map(({id, name}) => ({id, name}));
    const products: Product[] = MOCK_PRODUCTS.map(p => ({...p, isAvailable: p.isAvailable ?? true}));

    const categoriesWithProducts: MenuCategory[] = categories.map(cat => ({
      ...cat,
      imageUrl: '', // Ensure imageUrl is here for the type, but it's not used for display
      products: products.filter(p => p.category === cat.name)
    }));
    
    const uncategorizedProducts = products.filter(p => !p.category || !categories.some(c => c.name === p.category));
    if (uncategorizedProducts.length > 0) {
        categoriesWithProducts.push({
            id: 'cat-uncategorized', name: 'Outros', imageUrl: '',
            products: uncategorizedProducts
        });
    }

    setMenuData(categoriesWithProducts);
    setActiveCategoryIds(categoriesWithProducts.map(c => c.id));
  }, []);

  const handleToggleCategory = (categoryId: string) => {
    setActiveCategoryIds(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]);
  };
  
  const handleToggleAvailability = (productId: string, categoryId: string) => {
      setMenuData(prevData => prevData.map(cat => {
          if (cat.id === categoryId) {
              return { ...cat, products: cat.products.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p) };
          }
          return cat;
      }));
  };
  
  const handleOpenCategoryModal = (category: CategoryType | null) => {
      setEditingCategory(category);
      setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (category: CategoryType) => {
      const isEditing = menuData.some(c => c.id === category.id);
      if (isEditing) {
          setMenuData(prev => prev.map(c => c.id === category.id ? {...c, name: category.name } : c));
      } else {
          setMenuData(prev => [...prev, { ...category, products: [] }]);
      }
      setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
      if (window.confirm("Tem certeza que deseja excluir esta categoria e todos os seus produtos?")) {
          setMenuData(prev => prev.filter(c => c.id !== categoryId));
      }
  };

  const handleOpenProductModal = (product: Product | null, categoryName: string, scrollToImage: boolean = false) => {
      if(product) {
        setEditingProduct(product);
      } else {
        const newProduct: Product = { id: '', name: '', description: '', price: 0, imageUrl: '', restaurantId: 'rest1', category: categoryName, isAvailable: true, options: [] };
        setEditingProduct(newProduct);
      }
      setScrollToImageOnOpen(scrollToImage);
      setIsProductModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    const isNew = !menuData.flatMap(c => c.products).some(p => p.id === product.id);
    
    setMenuData(prevData => {
        let newData = [...prevData];
        // Remove product from its old category if it exists
        newData = newData.map(cat => ({
            ...cat,
            products: cat.products.filter(p => p.id !== product.id)
        }));

        // Add product to its new category
        const targetCategoryIndex = newData.findIndex(c => c.name === product.category);
        if (targetCategoryIndex !== -1) {
            const finalProduct = isNew ? { ...product, id: `prod-${Date.now()}` } : product;
            newData[targetCategoryIndex].products.push(finalProduct);
            newData[targetCategoryIndex].products.sort((a, b) => a.name.localeCompare(b.name));
        }
        return newData;
    });

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string, categoryId: string) => {
      if (window.confirm("Tem certeza que deseja excluir este produto?")) {
          setMenuData(prev => prev.map(cat => {
              if (cat.id === categoryId) {
                  return {...cat, products: cat.products.filter(p => p.id !== productId)};
              }
              return cat;
          }));
      }
  };
  
  const handleImportProducts = (importedProducts: Product[]) => {
    setMenuData(currentMenuData => {
        const newMenuData = JSON.parse(JSON.stringify(currentMenuData)); // Deep copy
        const categoryMap = new Map<string, MenuCategory>(newMenuData.map((cat: MenuCategory) => [cat.name, cat]));

        importedProducts.forEach(product => {
            const categoryName = product.category || 'Outros';
            const newProduct = { ...product, restaurantId: 'rest1', id: `prod-${Date.now()}-${Math.random()}`};

            if (categoryMap.has(categoryName)) {
                categoryMap.get(categoryName)!.products.push(newProduct);
            } else {
                const newCategory: MenuCategory = {
                    id: `cat-${Date.now()}-${Math.random()}`,
                    name: categoryName,
                    imageUrl: '',
                    products: [newProduct]
                };
                categoryMap.set(categoryName, newCategory);
            }
        });
        
        return Array.from(categoryMap.values());
    });
    alert(`${importedProducts.length} produtos importados com sucesso!`);
  };

  const OnboardingCard: React.FC<{icon: React.ElementType, title: string, description: string, onClick?: () => void}> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-800 transition-all h-full">
        <Icon className="w-8 h-8 mb-3 text-gray-500" />
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </button>
  );

  const allCategories = menuData.map(({ id, name }) => ({ id, name }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 h-full overflow-y-auto">
        <style>{`.input { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { ring: 1; border-color: #1f2937; outline:none; } .btn-primary { background-color: #1f2937; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; } .btn-secondary { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }`}</style>
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Cardápio</h1>
        <p className="text-gray-600 mt-1">Adicione, edite e organize os produtos e categorias da sua loja.</p>
      </header>
      
      <section className="p-4 bg-gray-100 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Comece seu cardápio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OnboardingCard icon={DocumentArrowUpIcon} title="Importar do iFood" description="Importe seu cardápio já existente." onClick={() => alert("Função de importação do iFood em breve!")}/>
            <OnboardingCard icon={CameraIcon} title="Importar de Arquivo" description="Use nossa IA para importar de uma foto ou arquivo CSV." onClick={() => setIsMenuFromFileModalOpen(true)} />
            <OnboardingCard icon={PlusIcon} title="Adicionar Manualmente" description="Adicione suas categorias e produtos manualmente." onClick={() => handleOpenCategoryModal(null)}/>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Categorias</h2>
            <button onClick={() => handleOpenCategoryModal(null)} className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />Adicionar Categoria</button>
        </div>
        <div className="space-y-4">
            {menuData.map(category => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleToggleCategory(category.id)}>
                        <div className="w-12 h-12 bg-gray-100 rounded-md mr-4 flex items-center justify-center text-gray-400 flex-shrink-0">
                            <PhotoPlaceholderIcon className="w-6 h-6"/>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 flex-1">{category.name}</h3>
                        <div className="flex items-center gap-4">
                            <button className="p-1 text-gray-500 hover:text-gray-800" onClick={e => {e.stopPropagation(); handleOpenCategoryModal(category)}}><PencilIcon className="w-5 h-5"/></button>
                            <button className="p-1 text-gray-500 hover:text-red-500" onClick={e => {e.stopPropagation(); handleDeleteCategory(category.id)}}><TrashIcon className="w-5 h-5"/></button>
                            <ChevronDownIcon className={`w-6 h-6 transition-transform ${activeCategoryIds.includes(category.id) ? '' : 'transform -rotate-90'}`}/>
                        </div>
                    </div>
                    {activeCategoryIds.includes(category.id) && (
                        <div className="border-t border-gray-200">
                           <div className="divide-y divide-gray-200">
                            {category.products.map(product => (
                                <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50">
                                    {product.imageUrl ? (
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            className="w-12 h-12 object-cover rounded-md flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => handleOpenProductModal(product, category.name, true)}
                                        />
                                    ) : (
                                        <div 
                                            className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0 cursor-pointer hover:bg-gray-200 transition-colors"
                                            onClick={() => handleOpenProductModal(product, category.name, true)}
                                        >
                                            <PhotoPlaceholderIcon className="w-6 h-6"/>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0" onClick={() => handleOpenProductModal(product, category.name)}>
                                        <p className="font-semibold text-gray-800 truncate cursor-pointer">{product.name}</p>
                                        <p className="text-sm text-gray-600">R$ {product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ToggleSwitch checked={product.isAvailable ?? true} onChange={() => handleToggleAvailability(product.id, category.id)} />
                                        <button onClick={() => handleOpenProductModal(product, category.name)} className="p-1 text-gray-500 hover:text-gray-800"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteProduct(product.id, category.id)} className="p-1 text-gray-500 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                            ))}
                           </div>
                           <div className="p-4 bg-gray-50/70">
                                <button onClick={() => handleOpenProductModal(null, category.name)} className="w-full text-center py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400">
                                    Adicionar Produto
                                </button>
                           </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </section>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={editingCategory}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
        categories={allCategories}
        restaurantId="rest1"
        scrollToImage={scrollToImageOnOpen}
      />
      
      <MenuFromFileModal 
        isOpen={isMenuFromFileModalOpen}
        onClose={() => setIsMenuFromFileModalOpen(false)}
        onImport={handleImportProducts}
      />

    </div>
  );
};

export default MenuManagementScreen;