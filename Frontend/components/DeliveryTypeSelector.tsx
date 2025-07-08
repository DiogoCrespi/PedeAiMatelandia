import React from 'react';
import { DeliveryType } from '../types';
import { DeliveryScooterIcon, PickupBuildingIcon } from '../icons';

interface DeliveryTypeSelectorProps {
  selectedType: DeliveryType;
  onSelectType: (type: DeliveryType) => void;
  size?: 'normal' | 'small';
}

const DeliveryTypeSelector: React.FC<DeliveryTypeSelectorProps> = ({ selectedType, onSelectType, size = 'normal' }) => {
  const isSmall = size === 'small';

  // Define classes based on size
  const containerClasses = isSmall ? "bg-white p-2 rounded-lg shadow-sm border border-appBorderLight" : "bg-white p-4 rounded-lg shadow-sm border border-appBorderLight";
  const titleClasses = isSmall ? "text-sm font-semibold text-appTextPrimary mb-2" : "text-lg font-semibold text-appTextPrimary mb-3";
  const gridClasses = isSmall ? "flex gap-2" : "grid grid-cols-2 gap-3";
  const buttonPadding = isSmall ? "p-2" : "p-3";
  const iconClasses = isSmall ? "w-6 h-6 mb-1" : "w-8 h-8 mb-2";
  const titleTextClasses = isSmall ? "text-xs font-semibold" : "font-semibold";
  const subtitleTextClasses = isSmall ? "hidden" : "text-xs text-appTextSecondary";

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>Como quer receber?</h2>
      <div className={gridClasses}>
        {/* Delivery Option */}
        <button
          onClick={() => onSelectType('DELIVERY')}
          className={`flex-1 flex flex-col items-center justify-center text-center border-2 rounded-lg transition-all duration-200 ${buttonPadding} ${
            selectedType === 'DELIVERY' ? 'border-appTextPrimary bg-appHeaderButtonBg/30' : 'border-appBorderLight hover:border-appCategoryActiveBorder'
          }`}
          aria-pressed={selectedType === 'DELIVERY'}
        >
          <DeliveryScooterIcon className={`${iconClasses} text-appTextPrimary`} />
          <span className={`${titleTextClasses} text-appTextPrimary`}>Entrega</span>
          <span className={subtitleTextClasses}>A gente leva até você</span>
        </button>

        {/* Pickup Option */}
        <button
          onClick={() => onSelectType('PICKUP')}
          className={`flex-1 flex flex-col items-center justify-center text-center border-2 rounded-lg transition-all duration-200 ${buttonPadding} ${
            selectedType === 'PICKUP' ? 'border-appTextPrimary bg-appHeaderButtonBg/30' : 'border-appBorderLight hover:border-appCategoryActiveBorder'
          }`}
          aria-pressed={selectedType === 'PICKUP'}
        >
          <PickupBuildingIcon className={`${iconClasses} text-appTextPrimary`} />
          <span className={`${titleTextClasses} text-appTextPrimary`}>Retirada</span>
          <span className={subtitleTextClasses}>Você retira no local</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryTypeSelector;