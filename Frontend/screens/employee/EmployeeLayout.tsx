
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Employee } from '../../types';
import { BuildingStorefrontIcon, ArrowUturnLeftIcon } from '../../icons';

interface EmployeeLayoutProps {
  employee: Employee;
  onLogout: () => void;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ employee, onLogout }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex-shrink-0 bg-gray-800 p-3 flex justify-between items-center border-b border-gray-700 shadow-lg">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                <BuildingStorefrontIcon className="w-5 h-5"/>
            </div>
            <div>
                <p className="font-bold text-white text-sm">PedeAí PDV</p>
                <p className="text-xs text-gray-400">Atendente: {employee.name}</p>
            </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold transition-colors"
        >
          <ArrowUturnLeftIcon className="w-4 h-4"/>
          <span>Sair</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
