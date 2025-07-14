
import React, { useState } from 'react';
import { Coupon } from '../types';
import { TicketIcon, CheckCircleIcon, XCircleIcon } from '../icons';

interface CouponInputFormProps {
  appliedCoupon: Coupon | null;
  error: string;
  onApply: (code: string) => void;
  onRemove: () => void;
  isLoading: boolean;
}

const CouponInputForm: React.FC<CouponInputFormProps> = ({ appliedCoupon, error, onApply, onRemove, isLoading }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      onApply(couponCode.trim());
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-bold text-green-800 uppercase">{appliedCoupon.code}</p>
              <p className="text-xs text-green-700">{appliedCoupon.description}</p>
            </div>
          </div>
          <button onClick={onRemove} className="text-xs font-semibold text-red-600 hover:underline">
            Remover
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleApplyClick} className="space-y-2">
      <div className="flex items-center gap-2">
         <div className="relative flex-grow">
          <TicketIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-appTextSecondary" />
          <input
            id="coupon-code"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="CÓDIGO DO CUPOM"
            className="w-full pl-10 pr-4 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white text-appTextPrimary placeholder-appTextSecondary uppercase tracking-wider"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-appPrimaryActionBg text-appPrimaryActionText rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={isLoading || !couponCode}
        >
          {isLoading ? '...' : 'Aplicar'}
        </button>
      </div>
      {error && (
         <div className="flex items-center gap-1 text-sm text-red-600">
            <XCircleIcon className="w-4 h-4"/>
            <p>{error}</p>
        </div>
      )}
    </form>
  );
};

export default CouponInputForm;
