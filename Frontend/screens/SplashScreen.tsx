
import React from 'react';
import { LogoIcon } from '../icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-appBg text-appTextPrimary">
      <LogoIcon className="w-24 h-24 mb-6 text-appTextPrimary animate-pulse" />
      <h1 className="text-3xl font-bold text-appTextPrimary mb-2">PedeAí Matelândia</h1>
      <div className="w-16 h-16 border-4 border-t-transparent border-appTextSecondary rounded-full animate-spin"></div>
      <p className="text-appTextSecondary mt-4">Carregando delícias...</p>
    </div>
  );
};

export default SplashScreen;
