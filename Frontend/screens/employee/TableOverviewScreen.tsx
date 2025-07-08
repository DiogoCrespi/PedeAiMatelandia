import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Order } from '../../types';
import TableCard from '../../components/TableCard';
import { ROUTE_PATHS } from '../../constants';

interface TableOverviewScreenProps {
  tables: Table[];
  orders: Order[];
}

const TableOverviewScreen: React.FC<TableOverviewScreenProps> = ({ tables, orders }) => {
  const navigate = useNavigate();

  const handleTableClick = (tableId: string) => {
    navigate(ROUTE_PATHS.EMPLOYEE_TABLE_DETAIL.replace(':tableId', tableId));
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-white mb-6">Visão Geral das Mesas</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map(table => {
          const order = table.currentOrderId ? orders.find(o => o.id === table.currentOrderId) : undefined;
          return (
            <TableCard 
              key={table.id} 
              table={table} 
              order={order}
              onClick={() => handleTableClick(table.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TableOverviewScreen;
