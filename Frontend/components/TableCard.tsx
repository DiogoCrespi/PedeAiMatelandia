
import React from 'react';
import { Table, Order } from '../types';
import { TableCellsIcon, UserIcon, ClockIcon, CurrencyDollarIcon } from '../icons';

interface TableCardProps {
    table: Table;
    order?: Order;
    onClick: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, order, onClick }) => {
    
    const getStatusClasses = () => {
        switch(table.status) {
            case 'Livre':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    border: 'border-green-500',
                    hover: 'hover:bg-green-200 hover:border-green-600'
                };
            case 'Ocupada':
                 return {
                    bg: 'bg-orange-100',
                    text: 'text-orange-800',
                    border: 'border-orange-500',
                    hover: 'hover:bg-orange-200 hover:border-orange-600'
                };
            case 'Pagando':
                 return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                    border: 'border-red-500',
                    hover: 'hover:bg-red-200 hover:border-red-600'
                };
        }
    }

    const { bg, text, border, hover } = getStatusClasses();
    const timeSinceOrder = order ? `${Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000)} min` : '';

    return (
        <button 
            onClick={onClick}
            className={`w-full p-4 rounded-lg shadow-md border-t-8 transition-all duration-200 flex flex-col justify-between h-48 ${bg} ${text} ${border} ${hover}`}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <TableCellsIcon className={`w-6 h-6 ${text}`} />
                    <h3 className="text-xl font-bold">{table.name}</h3>
                </div>
                <span className="font-semibold text-sm px-2 py-0.5 rounded-full bg-white/60">{table.status}</span>
            </div>
            
            <div className="text-left">
                {table.status === 'Livre' ? (
                    <div className="text-center">
                        <p className="text-lg">Disponível</p>
                    </div>
                ) : order ? (
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4" />
                            <span>{timeSinceOrder}</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            <span>R$ {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                ) : (
                    <p>Carregando pedido...</p>
                )}
            </div>
        </button>
    );
};

export default TableCard;
