
import React from 'react';
import { CartIcon, ChevronLeftIcon } from '../icons';

interface SideCartTabProps {
  itemCount: number;
  onOpen: () => void;
}

const SideCartTab: React.FC<SideCartTabProps> = ({ itemCount, onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed top-1/2 -translate-y-1/2 right-0 z-40 bg-appPrimaryActionBg text-appPrimaryActionText p-2 pr-3 rounded-l-lg shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
      aria-label={`Abrir carrinho com ${itemCount} itens`}
    >
      <ChevronLeftIcon className="w-5 h-5" />
      <div className="relative">
        <CartIcon className="w-6 h-6" />
        {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {itemCount}
            </span>
        )}
      </div>
    </button>
  );
};

export default SideCartTab;
