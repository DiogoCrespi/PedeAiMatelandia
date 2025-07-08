import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, BellIcon, SunIcon, ShieldCheckIcon } from '../icons';

// Reusable Toggle Switch Component, styled with TailwindCSS for consistency
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; ariaLabel: string }> = ({ checked, onChange, ariaLabel }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" aria-label={ariaLabel} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-appTextPrimary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTextPrimary"></div>
    </label>
  );
};


const AppSettingsScreen: React.FC = () => {
  const navigate = useNavigate();

  // State for settings, values would typically be loaded from user preferences
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    promotions: true,
  });

  const [theme, setTheme] = useState('system');

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    // In a real app, you would save this preference.
  };
  
  const handleClearCache = () => {
    // In a real app, this would clear local storage, cache, etc.
    alert("Histórico de busca limpo com sucesso! (Simulação)");
  }

  return (
    <div className="flex flex-col flex-1 bg-appBg min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <h1 className="text-xl font-bold text-appTextPrimary">Configurações do App</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Notifications Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight space-y-4">
            <h2 className="text-lg font-semibold text-appTextPrimary flex items-center">
                <BellIcon className="w-5 h-5 mr-2 text-appTextSecondary" /> Notificações
            </h2>
            <div className="flex justify-between items-center">
                <span className="text-appTextSecondary">Notificações Push</span>
                <ToggleSwitch checked={notifications.push} onChange={v => handleNotificationChange('push', v)} ariaLabel="Ativar notificações push" />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-appTextSecondary">Notificações por E-mail</span>
                <ToggleSwitch checked={notifications.email} onChange={v => handleNotificationChange('email', v)} ariaLabel="Ativar notificações por e-mail" />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-appTextSecondary">Promoções e Novidades</span>
                <ToggleSwitch checked={notifications.promotions} onChange={v => handleNotificationChange('promotions', v)} ariaLabel="Ativar notificações de promoções" />
            </div>
        </div>
        
        {/* Appearance Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight space-y-3">
            <h2 className="text-lg font-semibold text-appTextPrimary mb-2 flex items-center">
                <SunIcon className="w-5 h-5 mr-2 text-appTextSecondary" /> Aparência
            </h2>
            <div className="space-y-2">
                <label className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${theme === 'light' ? 'bg-appHeaderButtonBg' : 'hover:bg-appBg'}`}>
                    <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={e => setTheme(e.target.value)} className="mr-3 h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary border-gray-300"/>
                    <span className="text-appTextSecondary">Claro</span>
                </label>
                <label className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${theme === 'dark' ? 'bg-appHeaderButtonBg' : 'hover:bg-appBg'}`}>
                    <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={e => setTheme(e.target.value)} className="mr-3 h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary border-gray-300"/>
                    <span className="text-appTextSecondary">Escuro</span>
                </label>
                <label className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${theme === 'system' ? 'bg-appHeaderButtonBg' : 'hover:bg-appBg'}`}>
                    <input type="radio" name="theme" value="system" checked={theme === 'system'} onChange={e => setTheme(e.target.value)} className="mr-3 h-4 w-4 text-appTextPrimary focus:ring-appTextPrimary border-gray-300"/>
                    <span className="text-appTextSecondary">Padrão do Sistema</span>
                </label>
            </div>
        </div>

        {/* Data & Privacy Section */}
         <div className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight space-y-4">
            <h2 className="text-lg font-semibold text-appTextPrimary flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-appTextSecondary" /> Privacidade
            </h2>
             <button onClick={handleClearCache} className="text-left w-full text-appTextSecondary hover:text-appTextPrimary transition-colors">
                Limpar histórico de busca
            </button>
             <a href="#" className="block text-appTextSecondary hover:text-appTextPrimary transition-colors">
                Política de Privacidade
            </a>
            <a href="#" className="block text-appTextSecondary hover:text-appTextPrimary transition-colors">
                Termos de Serviço
            </a>
         </div>
      </div>
    </div>
  );
};

export default AppSettingsScreen;