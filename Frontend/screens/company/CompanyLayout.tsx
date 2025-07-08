
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants';
import { MOCK_RESTAURANTS } from '../../data';
import {
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  WhatsappIcon,
  TagIcon,
  UserGroupIcon,
  ChartBarIcon,
  UsersIcon,
  TableCellsIcon,
} from '../../icons';

const CompanyLayout: React.FC = () => {
  const navigate = useNavigate();
  const restaurant = MOCK_RESTAURANTS[0];
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: ROUTE_PATHS.COMPANY_DASHBOARD, label: 'Pedidos', icon: ClipboardDocumentListIcon },
    { path: ROUTE_PATHS.COMPANY_MENU, label: 'Cardápio', icon: BookOpenIcon },
    { path: ROUTE_PATHS.COMPANY_PROMOTIONS, label: 'Promoções', icon: TagIcon },
    { path: ROUTE_PATHS.COMPANY_CLIENTS, label: 'Clientes', icon: UserGroupIcon },
    { path: ROUTE_PATHS.COMPANY_EMPLOYEES, label: 'Funcionários', icon: UsersIcon },
    { path: ROUTE_PATHS.COMPANY_TABLES, label: 'Mesas', icon: TableCellsIcon },
    { path: ROUTE_PATHS.COMPANY_REPORTS, label: 'Relatórios', icon: ChartBarIcon },
    { path: ROUTE_PATHS.COMPANY_INFO, label: 'Informações', icon: InformationCircleIcon },
    { path: ROUTE_PATHS.COMPANY_WHATSAPP, label: 'WhatsApp', icon: WhatsappIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`
          flex-shrink-0 bg-gray-800 text-white flex flex-col z-10
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'}
        `}
      >
        <div className="p-4 border-b border-gray-700 flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <BuildingStorefrontIcon className="w-6 h-6 text-white"/>
          </div>
          <div className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="font-bold text-base truncate">{restaurant.name}</h2>
            <p className="text-xs text-gray-400">Painel do Gestor</p>
          </div>
        </div>
        <nav className="flex-grow p-2 space-y-1">
          <ul>
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === ROUTE_PATHS.COMPANY_DASHBOARD}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full
                    ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    ${!isExpanded ? 'justify-center' : 'justify-start'}
                    `
                  }
                  title={!isExpanded ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 ml-3' : 'opacity-0 w-0'}`}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-2 border-t border-gray-700">
           <button
            onClick={() => navigate(ROUTE_PATHS.PROFILE)}
            className={`flex w-full items-center px-3 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors
              ${!isExpanded ? 'justify-center' : 'justify-start'}
            `}
            title={!isExpanded ? 'Voltar ao App' : undefined}
          >
            <ChevronLeftIcon className="w-5 h-5 flex-shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 ml-3' : 'opacity-0 w-0'}`}>
              Voltar ao App
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CompanyLayout;
