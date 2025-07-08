
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ROUTE_PATHS } from '../constants';
import { 
    UserIcon,
    ChevronRightIcon, 
    CartIcon,
    MapPinIcon, 
    CreditCardIcon, 
    TicketIcon,
    CogIcon,
    QuestionMarkCircleIcon as HelpIcon,
    HeartIcon,
    BuildingStorefrontIcon,
    UsersIcon, // For Employee Area
} from '../icons'; 

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
}

interface ProfileLinkItem {
    path: string;
    label: string;
    icon: React.ElementType;
}

const profileLinks: ProfileLinkItem[] = [
    { path: ROUTE_PATHS.ORDER_HISTORY, label: 'Meus Pedidos', icon: CartIcon },
    { path: ROUTE_PATHS.FAVORITES, label: 'Meus Favoritos', icon: (props) => <HeartIcon {...props} isFilled /> },
    { path: ROUTE_PATHS.ADDRESS_MANAGEMENT, label: 'Endereços', icon: MapPinIcon },
    { path: ROUTE_PATHS.PAYMENT_MANAGEMENT, label: 'Pagamentos', icon: CreditCardIcon },
    { path: ROUTE_PATHS.COUPONS, label: 'Cupons', icon: TicketIcon },
    { path: ROUTE_PATHS.APP_SETTINGS, label: 'Configurações', icon: CogIcon }, 
    { path: ROUTE_PATHS.HELP_CENTER, label: 'Ajuda', icon: HelpIcon }, 
];


const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <div className="p-4 space-y-6 bg-appBg min-h-full flex-1">
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow border border-appBorderLight">
        <div className="w-16 h-16 bg-appHeaderButtonBg rounded-full flex items-center justify-center text-appBg overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-10 h-10 text-appTextPrimary" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-appTextPrimary">{user.name}</h1>
          <p className="text-sm text-appTextSecondary">{user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-appBorderLight">
        {profileLinks.map(item => (
            <Link 
                key={item.path} 
                to={item.path} 
                className="flex items-center justify-between p-4 border-b border-appBorderLight last:border-b-0 hover:bg-appHeaderButtonBg transition-colors group"
            >
                <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3 text-appTextSecondary group-hover:text-appTextPrimary" />
                    <span className="text-appTextPrimary">{item.label}</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-appTextSecondary/70" />
            </Link>
        ))}
      </div>
      
      {/* Company Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-appBorderLight">
        <div className="p-4 border-b border-appBorderLight">
            <h2 className="font-semibold text-appTextPrimary">Empresa</h2>
        </div>
        <Link 
            to={ROUTE_PATHS.COMPANY_DASHBOARD} 
            className="flex items-center justify-between p-4 hover:bg-appHeaderButtonBg transition-colors group"
        >
            <div className="flex items-center">
                <BuildingStorefrontIcon className="w-5 h-5 mr-3 text-appTextSecondary group-hover:text-appTextPrimary" />
                <span className="text-appTextPrimary">Minha Empresa</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-appTextSecondary/70" />
        </Link>
      </div>
      
      {/* Employee Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-appBorderLight">
        <div className="p-4 border-b border-appBorderLight">
            <h2 className="font-semibold text-appTextPrimary">Funcionário</h2>
        </div>
        <Link 
            to={ROUTE_PATHS.EMPLOYEE_LOGIN} 
            className="flex items-center justify-between p-4 hover:bg-appHeaderButtonBg transition-colors group"
        >
            <div className="flex items-center">
                <UsersIcon className="w-5 h-5 mr-3 text-appTextSecondary group-hover:text-appTextPrimary" />
                <span className="text-appTextPrimary">Área do Funcionário</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-appTextSecondary/70" />
        </Link>
      </div>

      <button
        onClick={handleLogoutClick}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow"
      >
        Sair
      </button>
    </div>
  );
};

export default ProfileScreen;
