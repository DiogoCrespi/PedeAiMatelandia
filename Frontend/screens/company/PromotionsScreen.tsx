


import React, { useState } from 'react';
import { CompanyPromotion, Product, Category as CategoryType } from '../../types';
import { MOCK_COMPANY_PROMOTIONS, MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../data';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, TagIcon } from '../../icons';

// --- Reusable Components ---
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-800/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </label>
);

const PromotionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (promotion: CompanyPromotion) => void;
  promotionToEdit: CompanyPromotion | null;
}> = ({ isOpen, onClose, onSave, promotionToEdit }) => {
    const emptyPromotion: CompanyPromotion = {
        id: `promo-${Date.now()}`,
        name: '', description: '', type: 'percentage', value: 0, isActive: true,
        appliesTo: 'all', applicableIds: []
    };
    const [promotion, setPromotion] = useState<CompanyPromotion>(promotionToEdit || emptyPromotion);
    
    React.useEffect(() => {
        setPromotion(promotionToEdit || emptyPromotion);
    }, [promotionToEdit, isOpen]);

    if (!isOpen) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setPromotion(p => ({ ...p, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleApplicableIdsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setPromotion(p => ({ ...p, applicableIds: selectedOptions }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(promotion);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">{promotionToEdit ? 'Editar' : 'Criar'} Promoção</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Promoção</label>
                        <input type="text" name="name" value={promotion.name} onChange={handleChange} className="w-full input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea name="description" value={promotion.description} onChange={handleChange} rows={2} className="w-full input"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select name="type" value={promotion.type} onChange={handleChange} className="w-full input" required>
                                <option value="percentage">Porcentagem (%)</option>
                                <option value="fixed">Valor Fixo (R$)</option>
                                <option value="bogo">Compre X Leve Y</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                            <input type="number" name="value" value={promotion.value} onChange={handleChange} className="w-full input" required step="0.01" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aplicar a</label>
                        <select name="appliesTo" value={promotion.appliesTo} onChange={handleChange} className="w-full input" required>
                            <option value="all">Todos os produtos</option>
                            <option value="categories">Categorias específicas</option>
                            <option value="products">Produtos específicos</option>
                        </select>
                    </div>
                    {promotion.appliesTo === 'categories' && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selecione as Categorias</label>
                            <select multiple value={promotion.applicableIds} onChange={handleApplicableIdsChange} className="w-full input h-32">
                                {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                         </div>
                    )}
                    {promotion.appliesTo === 'products' && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selecione os Produtos</label>
                            <select multiple value={promotion.applicableIds} onChange={handleApplicableIdsChange} className="w-full input h-32">
                                {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                         </div>
                    )}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar Promoção</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Screen ---
const PromotionsScreen: React.FC = () => {
    const [promotions, setPromotions] = useState<CompanyPromotion[]>(MOCK_COMPANY_PROMOTIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<CompanyPromotion | null>(null);

    const handleOpenModal = (promo: CompanyPromotion | null = null) => {
        setEditingPromotion(promo);
        setIsModalOpen(true);
    };

    const handleSavePromotion = (promo: CompanyPromotion) => {
        const isEditing = promotions.some(p => p.id === promo.id);
        if (isEditing) {
            setPromotions(prev => prev.map(p => p.id === promo.id ? promo : p));
        } else {
            setPromotions(prev => [promo, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDeletePromotion = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta promoção?")) {
            setPromotions(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleToggleActive = (id: string, isActive: boolean) => {
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive } : p));
    };

    const getPromoValue = (promo: CompanyPromotion) => {
        if (promo.type === 'percentage') return `${promo.value}%`;
        if (promo.type === 'fixed') return `R$ ${promo.value.toFixed(2)}`;
        if (promo.type === 'bogo') return `Leve ${promo.value + 1}`;
        return '-';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 h-full overflow-y-auto">
            <style>{`.input { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { ring: 1; border-color: #1f2937; outline:none; } .btn-primary { background-color: #1f2937; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; } .btn-secondary { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }`}</style>
            
            <PromotionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePromotion}
                promotionToEdit={editingPromotion}
            />

            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Promoções</h1>
                    <p className="text-gray-600 mt-1">Crie e gerencie descontos para seus clientes.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>Criar Promoção</span>
                </button>
            </header>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                                <th className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {promotions.map(promo => (
                                <tr key={promo.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenModal(promo)}>
                                    <td className="p-3 text-sm text-gray-700">
                                        <div className="font-semibold text-gray-800">{promo.name}</div>
                                        <div className="text-xs text-gray-500">{promo.description}</div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 capitalize">{promo.type}</td>
                                    <td className="p-3 text-sm text-gray-700 font-semibold">{getPromoValue(promo)}</td>
                                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                        <ToggleSwitch checked={promo.isActive} onChange={(val) => handleToggleActive(promo.id, val)} />
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(promo); }} className="p-2 text-gray-500 hover:text-gray-800"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeletePromotion(promo.id); }} className="p-2 text-gray-500 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {promotions.length === 0 && (
                        <div className="text-center py-12">
                             <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma promoção criada</h3>
                            <p className="mt-1 text-sm text-gray-500">Comece criando uma nova promoção para sua loja.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromotionsScreen;