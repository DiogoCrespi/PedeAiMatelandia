


import React, { useState, useEffect } from 'react';
import { Table } from '../../types';
import * as api from '../../api';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, TableCellsIcon as PageIcon } from '../../icons';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (table: Omit<Table, 'id' | 'status'>) => void;
  tableToEdit: Omit<Table, 'id' | 'status' | 'currentOrderId'> | null;
}

const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, onSave, tableToEdit }) => {
  const [name, setName] = useState(tableToEdit?.name || '');

  React.useEffect(() => {
    if(isOpen) {
        setName(tableToEdit?.name || '');
    }
  }, [isOpen, tableToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onSave({ name });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{tableToEdit ? 'Editar' : 'Adicionar'} Mesa</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome/Número da Mesa</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="input w-full" placeholder="Ex: Mesa 01, Varanda 03, Balcão" required />
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


const TableManagementScreen: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);

    useEffect(() => {
        const fetchTables = async () => {
            setIsLoading(true);
            try {
                const data = await api.getTables();
                setTables(data);
            } catch(error) {
                console.error("Failed to fetch tables", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTables();
    }, []);

    const handleOpenModal = (table: Table | null = null) => {
        setEditingTable(table);
        setIsModalOpen(true);
    };

    const handleSave = async (tableData: Omit<Table, 'id' | 'status'>) => {
        try {
            if(editingTable) {
                const updatedTable = await api.updateTable({ ...editingTable, ...tableData });
                setTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
            } else {
                const newTable = await api.addTable(tableData);
                setTables(prev => [...prev, newTable]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save table:", error);
            alert("Não foi possível salvar a mesa.");
        }
    };

    const handleDelete = async (tableId: string) => {
        if(window.confirm("Tem certeza que deseja excluir esta mesa?")) {
            try {
                await api.deleteTable(tableId);
                setTables(prev => prev.filter(t => t.id !== tableId));
            } catch (error) {
                console.error("Failed to delete table:", error);
                alert("Não foi possível excluir a mesa.");
            }
        }
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
            
            <TableModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                tableToEdit={editingTable}
            />

            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciar Mesas</h1>
                    <p className="text-gray-600 mt-1">Configure as mesas disponíveis no seu estabelecimento.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Adicionar Mesa</span>
                </button>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables.map(table => (
                    <div key={table.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center aspect-square">
                        <PageIcon className="w-10 h-10 text-gray-400" />
                        <p className="font-bold text-gray-800 mt-2">{table.name}</p>
                        <div className="flex gap-2 mt-3">
                             <button onClick={() => handleOpenModal(table)} className="p-1.5 text-gray-400 hover:text-gray-800"><PencilIcon className="w-4 h-4"/></button>
                             <button onClick={() => handleDelete(table.id)} className="p-1.5 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    </div>
                ))}
                 {tables.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed">
                            <PageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma mesa cadastrada</h3>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default TableManagementScreen;