import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentMethod } from '../types';
import { MOCK_USER } from '../data';
import { ChevronLeftIcon, TrashIcon, PlusIcon, XMarkIcon, VisaIcon, MastercardIcon, CreditCardIcon } from '../icons';

interface PaymentManagementScreenProps {
  paymentMethods: PaymentMethod[];
  onSetDefault: (paymentMethodId: string) => void;
  onAdd: (newPaymentMethod: Omit<PaymentMethod, 'id'>) => void;
  onDelete: (paymentMethodId: string) => void;
}

const emptyPaymentMethod: Omit<PaymentMethod, 'id'> = {
  cardType: 'other',
  last4: '',
  cardholderName: '',
  expiryDate: '',
  isDefault: false,
};

const PaymentManagementScreen: React.FC<PaymentManagementScreenProps> = ({ paymentMethods, onSetDefault, onAdd, onDelete }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
      cardNumber: '',
      cardholderName: MOCK_USER.name,
      expiryDate: '',
      cvv: '',
      isDefault: false,
  });

  const openAddModal = () => {
    setNewCard({
      cardNumber: '',
      cardholderName: MOCK_USER.name,
      expiryDate: '',
      cvv: '',
      isDefault: paymentMethods.length === 0, // Make default if it's the first card
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    if (name === 'cardNumber') {
        processedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'expiryDate') {
        processedValue = value.replace(/\D/g, '').slice(0, 4);
        if (processedValue.length > 2) {
            processedValue = `${processedValue.slice(0, 2)}/${processedValue.slice(2)}`;
        }
    } else if (name === 'cvv') {
        processedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setNewCard(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = newCard.cardNumber.slice(-4);
    if (last4.length < 4 || newCard.cardholderName.trim() === '' || newCard.expiryDate.length < 5) {
        alert("Por favor, preencha todos os campos do cartão corretamente.");
        return;
    }

    const cardType = newCard.cardNumber.startsWith('4') ? 'visa' : newCard.cardNumber.startsWith('5') ? 'mastercard' : 'other';

    onAdd({
        cardType: cardType,
        last4: last4,
        cardholderName: newCard.cardholderName,
        expiryDate: newCard.expiryDate,
        isDefault: newCard.isDefault,
    });
    setIsModalOpen(false);
  };
  
  const handleDelete = (id: string) => {
      if (window.confirm("Tem certeza que deseja excluir este cartão?")) {
          onDelete(id);
      }
  }

  const getCardIcon = (cardType: 'visa' | 'mastercard' | 'other') => {
      switch(cardType) {
          case 'visa': return <VisaIcon />;
          case 'mastercard': return <MastercardIcon />;
          default: return <CreditCardIcon className="w-8 h-8 text-appTextSecondary" />;
      }
  }

  return (
    <div className="flex flex-col flex-1 bg-appBg min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <h1 className="text-xl font-bold text-appTextPrimary">Meus Cartões</h1>
      </div>

      {/* Payment Method List */}
      <div className="p-4 space-y-4 flex-1">
        {paymentMethods.map(pm => (
          <div key={pm.id} className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight">
            <div className="flex items-center">
              {getCardIcon(pm.cardType)}
              <div className="flex-1 ml-4">
                <p className="font-semibold text-appTextPrimary">Final •••• {pm.last4}</p>
                <p className="text-sm text-appTextSecondary">Expira em {pm.expiryDate}</p>
              </div>
              {pm.isDefault && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Padrão
                  </span>
                )}
            </div>
            <div className="flex items-center justify-end gap-4 mt-3 pt-3 border-t border-appBorderLight">
              {!pm.isDefault && (
                <button onClick={() => onSetDefault(pm.id)} className="text-sm font-medium text-appTextPrimary hover:underline">
                  Definir Padrão
                </button>
              )}
              <button onClick={() => handleDelete(pm.id)} className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1">
                <TrashIcon className="w-4 h-4" /> Excluir
              </button>
            </div>
          </div>
        ))}
        {paymentMethods.length === 0 && (
          <div className="text-center py-10">
             <CreditCardIcon className="w-16 h-16 text-appTextSecondary/30 mx-auto mb-4" />
            <p className="text-appTextSecondary">Você ainda não tem cartões cadastrados.</p>
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
          Adicionar Novo Cartão
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-appBorderLight">
              <h2 className="text-lg font-bold text-appTextPrimary">Adicionar Novo Cartão</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-appHeaderButtonBg">
                <XMarkIcon className="w-6 h-6 text-appTextSecondary" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-appTextPrimary mb-1">Número do Cartão</label>
                <input type="tel" name="cardNumber" id="cardNumber" value={newCard.cardNumber} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required placeholder="0000 0000 0000 0000" />
              </div>
              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-appTextPrimary mb-1">Nome no Cartão</label>
                <input type="text" name="cardholderName" id="cardholderName" value={newCard.cardholderName} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-appTextPrimary mb-1">Validade</label>
                  <input type="text" name="expiryDate" id="expiryDate" value={newCard.expiryDate} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required placeholder="MM/AA"/>
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-appTextPrimary mb-1">CVV</label>
                  <input type="password" name="cvv" id="cvv" value={newCard.cvv} onChange={handleFormChange} className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white" required placeholder="•••" />
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isDefault" id="isDefault" checked={newCard.isDefault} onChange={handleFormChange} className="h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary border-gray-300 rounded" />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-appTextPrimary">Definir como cartão padrão</label>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Salvar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagementScreen;