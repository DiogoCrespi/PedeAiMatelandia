
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants';
import { ChevronLeftIcon, SearchIcon } from '../../icons';

interface PlaceholderScreenProps {
  title: string;
  message?: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, message }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 text-center bg-appBg">
       {/* Simple Header for Placeholder */}
       <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-start h-[60px] px-4 bg-appBg/80 backdrop-blur-md shadow-sm border-b border-appBorderLight lg:px-40">
            <button onClick={() => navigate(-1)} className="flex items-center text-appTextPrimary hover:opacity-70 transition-opacity">
                <ChevronLeftIcon className="w-5 h-5 mr-1"/>
                Voltar
            </button>
        </div>

      <div className="w-24 h-24 bg-appTextPrimary/10 rounded-full flex items-center justify-center mb-6 text-appTextPrimary">
        {/* Using a generic icon for placeholder */}
        <SearchIcon className="w-12 h-12 opacity-50" /> 
      </div>
      <h1 className="text-3xl font-bold text-appTextPrimary mb-3">{title}</h1>
      <p className="text-appTextSecondary mb-6 max-w-md">
        {message || `Esta funcionalidade (${title.toLowerCase()}) ainda está em desenvolvimento. Volte em breve!`}
      </p>
      <Link 
        to={ROUTE_PATHS.HOME} 
        className="px-6 py-3 bg-appPrimaryActionBg text-appPrimaryActionText rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Ir para Home
      </Link>
    </div>
  );
};

export default PlaceholderScreen;
