
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants';
import { LogoIcon, SearchIcon, CartIcon, UserIcon } from '../icons';

interface NavBarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ cartItemCount, onCartClick }) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`${ROUTE_PATHS.SEARCH}?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear search term after navigation
      setIsSearchOpen(false); // Close search input
    }
  };

  return (
    <header id="app-header" className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-2 sm:py-3 fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300" style={{ overflow: 'visible' }}>
      <div className="header-bg"></div>
      <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2 text-appTextPrimary header-brand no-underline">
        <LogoIcon className="size-7 sm:size-8" />
        <h2 className="text-appTextPrimary text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">PedeAí Matelândia</h2>
      </Link>
      
      <div className="flex flex-1 justify-end gap-2 sm:gap-3 header-buttons">
        {/* Search Button & Input */}
        <div className="relative group">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Buscar"
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-appHeaderButtonBg text-appHeaderIcons gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-appHeaderButtonBgHover transition-colors duration-200"
          >
            <SearchIcon />
          </button>
          {isSearchOpen && (
            <div className="absolute right-0 top-full mt-2 transition-all duration-200 z-50">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-xl shadow-lg border border-appHeaderButtonBg p-2 min-w-64 sm:min-w-72">
                <div className="text-appTextSecondary flex items-center justify-center pl-2">
                  <SearchIcon />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar restaurantes e pratos..."
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-appTextPrimary focus:outline-0 focus:ring-0 border-none bg-transparent h-8 placeholder:text-appTextSecondary px-3 text-sm font-normal leading-normal"
                  autoFocus
                />
              </form>
            </div>
          )}
           {!isSearchOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                <div className="bg-white text-appTextPrimary text-xs px-2 py-1 rounded whitespace-nowrap border border-appHeaderButtonBg shadow-lg">
                Buscar
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
            </div>
           )}
        </div>

        {/* Cart Button */}
        <div className="relative group">
          <button
            onClick={onCartClick}
            aria-label="Carrinho"
            className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-appHeaderButtonBg text-appHeaderIcons gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-appHeaderButtonBgHover transition-colors duration-200"
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
            <div className="bg-white text-appTextPrimary text-xs px-2 py-1 rounded whitespace-nowrap border border-appHeaderButtonBg shadow-lg">
              Carrinho
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
          </div>
        </div>

        {/* Profile Button */}
        <div className="relative group">
          <button
            onClick={() => navigate(ROUTE_PATHS.PROFILE)}
            aria-label="Perfil"
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-appHeaderButtonBg text-appHeaderIcons gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-appHeaderButtonBgHover transition-colors duration-200"
          >
            <UserIcon />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
            <div className="bg-white text-appTextPrimary text-xs px-2 py-1 rounded whitespace-nowrap border border-appHeaderButtonBg shadow-lg">
              Perfil
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
