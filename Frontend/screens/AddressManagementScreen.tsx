import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from '../types';
import { ChevronLeftIcon, MapPinIcon, TrashIcon, PlusIcon, XMarkIcon } from '../icons';

interface AddressManagementScreenProps {
  addresses: Address[];
  onSetDefault: (addressId: string) => void;
  onAdd: (newAddress: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => void;
  onUpdate: (updatedAddress: Address) => void;
  onDelete: (addressId: string) => void;
}

const emptyAddress: Omit<Address, 'id'> = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
  isDefault: false,
};

const AddressManagementScreen: React.FC<AddressManagementScreenProps> = ({ addresses, onSetDefault, onAdd, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | Omit<Address, 'id'>>(emptyAddress);
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    setEditingAddress(emptyAddress);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditingAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onUpdate(editingAddress as Address);
    } else {
      onAdd(editingAddress as Omit<Address, 'id'>);
    }
    setIsModalOpen(false);
  };
  
  const handleDelete = (id: string) => {
      if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
          onDelete(id);
      }
  }

  return (
    <div className="flex flex-col flex-1 bg-appBg min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <h1 className="text-xl font-bold text-appTextPrimary">Meus Endereços</h1>
      </div>

      {/* Address List */}
      <div className="p-4 space-y-4 flex-1">
        {addresses.map(address => (
          <div key={address.id} className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight">
            <div className="flex items-start">
              <MapPinIcon className="w-6 h-6 mr-3 mt-1 text-appTextSecondary flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-appTextPrimary">{address.street}, {address.number}</p>
                <p className="text-sm text-appTextSecondary">{address.neighborhood} - {address.city}, {address.state}</p>
                {address.isDefault && (
                  <span className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Padrão
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-appBorderLight">
              {!address.isDefault && (
                <button onClick={() => onSetDefault(address.id)} className="text-sm font-medium text-appTextPrimary hover:underline">
                  Definir Padrão
                </button>
              )}
              <button onClick={() => openEditModal(address)} className="text-sm font-medium text-appTextPrimary hover:underline">
                Editar
              </button>
              <button onClick={() => handleDelete(address.id)} className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1">
                <TrashIcon className="w-4 h-4" /> Excluir
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <div className="text-center py-10">
             <MapPinIcon className="w-16 h-16 text-appTextSecondary/30 mx-auto mb-4" />
            <p className="text-appTextSecondary">Você ainda não tem endereços cadastrados.</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      <div className="p-4 bg-appBg sticky bottom-0 border-t border-appBorderLight">
        <button 
          onClick={openAddModal} 
          className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5"/>
          Adicionar Novo Endereço
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-appBorderLight">
              <h2 className="text-lg font-bold text-appTextPrimary">{isEditing ? 'Editar Endereço' : 'Adicionar Endereço'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-appHeaderButtonBg">
                <XMarkIcon className="w-6 h-6 text-appTextSecondary" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-appTextPrimary mb-1">CEP</label>
                <input type="text" name="zip" id="zip" value={editingAddress.zip} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-appTextPrimary mb-1">Rua</label>
                  <input type="text" name="street" id="street" value={editingAddress.street} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required />
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-appTextPrimary mb-1">Número</label>
                  <input type="text" name="number" id="number" value={editingAddress.number} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required />
                </div>
              </div>
              <div>
                <label htmlFor="complement" className="block text-sm font-medium text-appTextPrimary mb-1">Complemento (Opcional)</label>
                <input type="text" name="complement" id="complement" value={editingAddress.complement || ''} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" />
              </div>
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-appTextPrimary mb-1">Bairro</label>
                <input type="text" name="neighborhood" id="neighborhood" value={editingAddress.neighborhood} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-appTextPrimary mb-1">Cidade</label>
                  <input type="text" name="city" id="city" value={editingAddress.city} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required />
                 </div>
                 <div>
                    <label htmlFor="state" className="block text-sm font-medium text-appTextPrimary mb-1">Estado</label>
                    <input type="text" name="state" id="state" value={editingAddress.state} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required />
                 </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isDefault" id="isDefault" checked={!!editingAddress.isDefault} onChange={handleFormChange} className="h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary border-gray-300 rounded" />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-appTextPrimary">Definir como endereço padrão</label>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Salvar Endereço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagementScreen;