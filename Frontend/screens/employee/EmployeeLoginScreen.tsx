

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Employee } from '../../types';
import { LogoIcon, ArrowUturnLeftIcon } from '../../icons';
import { ROUTE_PATHS } from '../../constants';

interface EmployeeLoginScreenProps {
  onLogin: (pin: string) => Promise<boolean>;
}

const EmployeeLoginScreen: React.FC<EmployeeLoginScreenProps> = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const [companyCode, setCompanyCode] = useState(searchParams.get('company') || '');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handlePinClick = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };
  
  const handleClear = () => {
      setPin('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;

    setError('');
    setIsLoggingIn(true);
    
    // In a real app, you would validate the company code.
    const loginSuccess = await onLogin(pin);
    
    if (!loginSuccess) {
      setError('PIN inválido. Tente novamente.');
      setPin('');
    }
    setIsLoggingIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-4 text-white relative">
      <button
        onClick={() => navigate(ROUTE_PATHS.PROFILE)}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors z-10"
        aria-label="Voltar para o Perfil"
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
        <span>Voltar para o App</span>
      </button>

      <div className="w-full max-w-sm text-center">
        <LogoIcon className="w-24 h-24 mx-auto text-white" />
        <h1 className="text-3xl font-bold mt-4">Ponto de Venda</h1>
        <p className="text-gray-400 mb-8">Bem-vindo(a)! Digite seu PIN para começar.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="company-code" className="sr-only">Código da Empresa</label>
            <input
              id="company-code"
              type="text"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
              placeholder="CÓDIGO DA EMPRESA"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-center tracking-widest font-semibold placeholder-gray-500"
              disabled // Assuming code comes from URL
            />
          </div>
          <div className="flex justify-center items-center h-16 mb-2">
            <p className="text-5xl tracking-[1em] font-mono">
              {pin.padEnd(4, '•')}
            </p>
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
              <button key={d} type="button" onClick={() => handlePinClick(String(d))} className="h-20 bg-gray-700/50 rounded-lg text-3xl font-bold hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={isLoggingIn}>
                {d}
              </button>
            ))}
            <button type="button" onClick={handleClear} className="h-20 bg-gray-700/50 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={isLoggingIn}>Limpar</button>
            <button type="button" onClick={() => handlePinClick('0')} className="h-20 bg-gray-700/50 rounded-lg text-3xl font-bold hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={isLoggingIn}>0</button>
            <button type="button" onClick={handleDelete} className="h-20 bg-gray-700/50 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={isLoggingIn}>Apagar</button>
          </div>
          
          <button type="submit" disabled={pin.length !== 4 || isLoggingIn} className="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
            {isLoggingIn ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLoginScreen;
