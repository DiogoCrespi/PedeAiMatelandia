import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, WhatsappIcon } from '../icons';

const InfoFooter: React.FC = () => {
  return (
    <footer className="bg-appHeaderButtonBg/50 text-appTextSecondary text-xs text-center p-6 mt-8">
      <div className="max-w-4xl mx-auto space-y-4">
        
        <div className="flex justify-center items-center gap-6 mb-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-appTextSecondary hover:text-appTextPrimary transition-colors">
                <FacebookIcon className="w-5 h-5"/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-appTextSecondary hover:text-appTextPrimary transition-colors">
                <InstagramIcon className="w-5 h-5"/>
            </a>
            <a href="https://wa.me/5545999999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-appTextSecondary hover:text-appTextPrimary transition-colors">
                <WhatsappIcon className="w-5 h-5"/>
            </a>
        </div>

        <div className="space-y-2">
            <p>© 2025 PedeAí Matelândia - Todos os direitos reservados.</p>
            <p>PedeAí Matelândia Entregas LTDA | CNPJ: 12.345.678/0001-99</p>
            <p>Rua Principal, 123, Centro, Matelândia/PR - CEP 85887-000</p>
        </div>
        
        <nav className="flex justify-center items-center gap-2 sm:gap-4 pt-2">
          <Link to="#" className="hover:text-appTextPrimary transition-colors">Termos de Uso</Link>
          <span className="opacity-50">•</span>
          <Link to="#" className="hover:text-appTextPrimary transition-colors">Política de Privacidade</Link>
          <span className="opacity-50">•</span>
          <Link to="#" className="hover:text-appTextPrimary transition-colors">Dicas de Segurança</Link>
        </nav>
      </div>
    </footer>
  );
};

export default InfoFooter;