



import React, { useState, useEffect } from 'react';
import { Employee, Restaurant } from '../../types';
import * as api from '../../api';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, UsersIcon as PageIcon, LinkIcon } from '../../icons';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id' | 'restaurantId'> | Employee) => void;
  employeeToEdit: Employee | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, employeeToEdit }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if(isOpen) {
        if (employeeToEdit) {
            setName(employeeToEdit.name);
            setPin(employeeToEdit.pin);
        } else {
            setName('');
            setPin('');
        }
    }
  }, [isOpen, employeeToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && pin.length === 4) {
      if (employeeToEdit) {
        onSave({ ...employeeToEdit, name, pin });
      } else {
        onSave({ name, pin });
      }
    } else {
      alert("Por favor, preencha o nome e um PIN de 4 dígitos.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{employeeToEdit ? 'Editar' : 'Adicionar'} Funcionário</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Funcionário</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="input w-full" required />
          </div>
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">PIN (4 dígitos)</label>
            <input id="pin" type="text" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} className="input w-full" required maxLength={4} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const EmployeeManagementScreen: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [copied, setCopied] = useState(false);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [employeesData, restaurantData] = await Promise.all([
                    api.getEmployees(),
                    api.getRestaurantById('rest1')
                ]);
                setEmployees(employeesData);
                setRestaurant(restaurantData || null);
            } catch (error) {
                console.error("Failed to load data for employee screen:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);
    
    const registrationLink = restaurant ? `${window.location.origin}${window.location.pathname}#/employee/login?company=${restaurant.id}` : '';
    const companyCode = restaurant?.companyCode || '...';

    const handleOpenModal = (employee: Employee | null = null) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    }
    
    const handleSave = async (employeeData: Omit<Employee, 'id' | 'restaurantId'> | Employee) => {
        try {
            if ('id' in employeeData) {
                const updatedEmployee = await api.updateEmployee(employeeData);
                setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
            } else {
                const newEmployee = await api.addEmployee({ ...employeeData, restaurantId: 'rest1'});
                setEmployees(prev => [...prev, newEmployee]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save employee:", error);
            alert("Não foi possível salvar o funcionário.");
        }
    };
    
    const handleDelete = async (employeeId: string) => {
        if(window.confirm("Tem certeza que deseja excluir este funcionário?")) {
            try {
                await api.deleteEmployee(employeeId);
                setEmployees(prev => prev.filter(e => e.id !== employeeId));
            } catch (error) {
                console.error("Failed to delete employee:", error);
                alert("Não foi possível excluir o funcionário.");
            }
        }
    };

    const handleCopyLink = () => {
        if (!registrationLink) return;
        navigator.clipboard.writeText(registrationLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-gray-800 rounded-full animate-spin"></div>
        </div>
      );
    }


    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 h-full overflow-y-auto">
            <style>{`.input { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { outline:none; } .btn-primary { background-color: #1f2937; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; } .btn-secondary { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }`}</style>
            
            <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} employeeToEdit={editingEmployee} />

            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciar Funcionários</h1>
                    <p className="text-gray-600 mt-1">Adicione, edite ou remova os funcionários da sua equipe.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Adicionar</span>
                </button>
            </header>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-center gap-3">
                    <LinkIcon className="w-6 h-6 text-blue-700"/>
                    <div>
                        <h3 className="font-semibold text-blue-800">Link e Código para Novos Funcionários</h3>
                        <p className="text-sm text-blue-700">Compartilhe o código da empresa com seus funcionários para que eles possam acessar o sistema. Cada funcionário deve usar o PIN cadastrado para ele na lista abaixo.</p>
                        <div className="mt-2 flex gap-4 items-center">
                            <p className="text-sm">Código da Empresa: <strong className="font-mono bg-blue-200 text-blue-900 px-2 py-1 rounded">{companyCode}</strong></p>
                            <button onClick={handleCopyLink} className="text-xs font-semibold text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline" disabled={!registrationLink}>
                                {copied ? 'Copiado!' : 'Copiar link de acesso'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PIN</th>
                                <th className="p-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-700 font-semibold">{emp.name}</td>
                                    <td className="p-3 text-sm text-gray-700 font-mono">{emp.pin}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleOpenModal(emp)} className="p-2 text-gray-500 hover:text-gray-800"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(emp.id)} className="p-2 text-gray-500 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {employees.length === 0 && (
                        <div className="text-center py-12">
                             <PageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum funcionário cadastrado</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagementScreen;