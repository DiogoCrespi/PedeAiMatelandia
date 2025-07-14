

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coupon } from '../types';
import { ChevronLeftIcon, TicketIcon } from '../icons';

interface CouponsScreenProps {
  userCoupons: Coupon[];
  onAddCoupon: (code: string) => Promise<void>;
  isLoading: boolean;
}

const CouponsScreen: React.FC<CouponsScreenProps> = ({ userCoupons, onAddCoupon, isLoading }) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleAddClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim() && !isLoading) {
      await onAddCoupon(couponCode.trim());
      setCouponCode('');
    }
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    }
    return `R$${coupon.discountValue.toFixed(2)} OFF`;
  };

  return (
    <div className="flex flex-col flex-1 bg-appBg min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <h1 className="text-xl font-bold text-appTextPrimary">Meus Cupons</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Add Coupon Form */}
        <form onSubmit={handleAddClick} className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight">
          <label htmlFor="coupon-code" className="block text-sm font-medium text-appTextPrimary mb-1">
            Adicionar novo cupom
          </label>
          <div className="flex gap-2">
            <input
              id="coupon-code"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Digite o código do cupom"
              className="flex-grow w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white text-appTextPrimary placeholder-appTextSecondary uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-appPrimaryActionBg text-appPrimaryActionText rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isLoading || !couponCode.trim()}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>

        {/* Coupon List */}
        <div className="space-y-3">
          {userCoupons.length > 0 ? (
            userCoupons.map(coupon => (
              <div key={coupon.id} className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight flex items-center gap-4">
                <div className="flex-shrink-0 text-appTextPrimary p-2 bg-appBg rounded-full">
                    <TicketIcon className="w-8 h-8"/>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-appTextPrimary uppercase">{coupon.code}</p>
                  <p className="text-sm text-appTextSecondary">{coupon.description}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-green-600">{getDiscountText(coupon)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg border border-dashed border-appBorderLight">
              <TicketIcon className="w-16 h-16 text-appTextSecondary/30 mx-auto mb-4" />
              <p className="text-appTextSecondary">Você não possui cupons no momento.</p>
              <p className="text-sm text-appTextSecondary/80">Fique de olho nas promoções para ganhar descontos!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponsScreen;