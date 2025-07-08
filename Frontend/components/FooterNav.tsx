
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants';
import { 
    HomeIcon, 
    SearchIcon, 
    CartIcon, 
    UserIcon 
} from '../icons';

interface NavItem {
  path: string;
  label: string;
  icon: React.FC<{ className?: string, isActive?: boolean }>;
}

const navItems: NavItem[] = [
  { path: ROUTE_PATHS.HOME, label: 'Início', icon: HomeIcon },
  { path: ROUTE_PATHS.SEARCH, label: 'Buscar', icon: SearchIcon },
  { path: ROUTE_PATHS.CART, label: 'Carrinho', icon: CartIcon },
  { path: ROUTE_PATHS.PROFILE, label: 'Perfil', icon: UserIcon },
];

const FooterNav: React.FC = () => {
  return (
    <footer id="footer-nav" className="fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out"> {/* z-40 to be below header z-50 */}
      <nav aria-label="Navegação inferior" className="w-full flex justify-center">
        <ul className="flex w-full max-w-[600px] justify-between items-center bg-appFooterBg backdrop-blur-md shadow-xl rounded-2xl mx-2 mb-2 px-2 py-1">
          {navItems.map((item) => (
              <li key={item.path} className="flex-1">
                <NavLink
                  to={item.path}
                  end={item.path === ROUTE_PATHS.HOME}
                  aria-label={item.label}
                  className="flex flex-col items-center justify-center py-2 transition-all group focus:outline-none focus:ring-2 focus:ring-appTextPrimary rounded-lg"
                >
                  {({ isActive }) => (
                    <>
                      <span className={`footer-icon transition-transform duration-300 ease-in-out ${isActive ? 'text-appFooterIconActive group-hover:scale-110' : 'text-appFooterIconInactive group-hover:scale-110'}`}>
                        <item.icon isActive={isActive} />
                      </span>
                      <span className={`footer-text text-xs font-bold mt-1 transition-all duration-300 ease-in-out ${isActive ? 'text-appFooterIconActive' : 'text-appFooterIconInactive'}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          )}
        </ul>
      </nav>
    </footer>
  );
};

export default FooterNav;
