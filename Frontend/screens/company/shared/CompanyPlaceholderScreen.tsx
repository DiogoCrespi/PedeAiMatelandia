
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CompanyPlaceholderScreenProps {
  title: string;
}

const CompanyPlaceholderScreen: React.FC<CompanyPlaceholderScreenProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 bg-gray-50 min-h-full">
      {/* Header removed, it is now part of CompanyLayout */}

      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.664 1.208-.788l3.032-2.496m-3.032 2.496a3.75 3.75 0 0 0-4.5-4.5m4.5 4.5-2.496 3.03" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          A funcionalidade de '{title}' está sendo preparada e estará disponível em breve para você gerenciar sua loja.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Voltar
        </button>
      </main>
    </div>
  );
};

export default CompanyPlaceholderScreen;
