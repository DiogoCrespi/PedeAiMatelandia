
import React, { useState, useMemo, useEffect } from 'react';
import * as api from '../../api';
import { Order, OrderStatus, Product } from '../../types';
import { ChartBarIcon, DocumentArrowDownIcon } from '../../icons';

type Period = 'today' | '7d' | '30d';

const KpiCard: React.FC<{ title: string; value: string; description: string }> = ({ title, value, description }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
);

const SalesChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 0), [data]);
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendas por Período</h3>
            <div className="flex justify-around items-end h-64 space-x-2">
                {data.length > 0 ? data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                        <div className="relative w-full h-full flex items-end">
                            <div
                                className="w-full bg-gray-800 hover:bg-gray-700 rounded-t-md transition-all"
                                style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    R$ {item.value.toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{item.label}</span>
                    </div>
                )) : <p className="text-gray-500">Sem dados para exibir.</p>}
            </div>
        </div>
    );
};

const TopProductsList: React.FC<{ products: (Product & { quantity: number })[] }> = ({ products }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Produtos Mais Vendidos</h3>
        <ul className="space-y-3">
            {products.length > 0 ? products.slice(0, 5).map(p => (
                <li key={p.id} className="flex items-center gap-3">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-md"/>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500">Categoria: {p.category}</p>
                    </div>
                    <span className="font-bold text-gray-700 text-sm">{p.quantity} vendidos</span>
                </li>
            )) : <p className="text-sm text-gray-500">Nenhum produto vendido no período.</p>}
        </ul>
    </div>
);

const ChannelSales: React.FC<{ data: { app: number, local: number } }> = ({ data }) => {
    const total = data.app + data.local;
    const appPercentage = total > 0 ? (data.app / total) * 100 : 0;
    const localPercentage = total > 0 ? (data.local / total) * 100 : 0;
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendas por Canal</h3>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">App</span>
                        <span className="text-gray-500">R$ {data.app.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${appPercentage}%` }}></div>
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Local</span>
                        <span className="text-gray-500">R$ {data.local.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${localPercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ReportsScreen: React.FC = () => {
    const [period, setPeriod] = useState<Period>('7d');
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [ordersData, productsData] = await Promise.all([
                    api.getOrders(),
                    api.getProducts()
                ]);
                setAllOrders(ordersData);
                setAllProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch reports data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredOrders = useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setMonth(now.getMonth() - 1);
                break;
            default:
                return allOrders;
        }

        return allOrders.filter(order => new Date(order.createdAt) >= startDate && order.status === OrderStatus.DELIVERED);
    }, [period, allOrders]);

    const reportData = useMemo(() => {
        const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
        const newCustomers = new Set(filteredOrders.map(o => o.userId)).size; // Simplified metric

        const salesByDay = filteredOrders.reduce((acc, order) => {
            const day = new Date(order.createdAt).toLocaleDateString('pt-BR');
            acc[day] = (acc[day] || 0) + order.total;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(salesByDay).map(([label, value]) => ({ label, value })).slice(-10); // show last 10 days of period

        const productSales = filteredOrders
            .flatMap(o => o.items)
            .reduce((acc, item) => {
                acc[item.product.id] = (acc[item.product.id] || 0) + item.quantity;
                return acc;
            }, {} as Record<string, number>);
        
        const topProducts = Object.entries(productSales)
            .map(([productId, quantity]) => ({
                ...(allProducts.find(p => p.id === productId) as Product),
                quantity,
            }))
            .filter(p => p.id) // Filter out any products that weren't found
            .sort((a, b) => b.quantity - a.quantity);
        
        const channelSales = filteredOrders.reduce((acc, order) => {
            if (order.isLocal) acc.local += order.total;
            else acc.app += order.total;
            return acc;
        }, { app: 0, local: 0 });

        return { totalSales, totalOrders, averageTicket, newCustomers, chartData, topProducts, channelSales };
    }, [filteredOrders, allProducts]);

    const handleExport = () => {
        alert("Gerando exportação de relatório... (simulação)");
    };

    const periodButtons = [
        { key: 'today', label: 'Hoje' },
        { key: '7d', label: '7 Dias' },
        { key: '30d', label: '30 Dias' },
    ] as const;

    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-gray-800 rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 h-full overflow-y-auto">
            <header className="flex flex-wrap gap-4 justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Relatórios de Vendas</h1>
                    <p className="text-gray-600 mt-1">Analise o desempenho da sua loja.</p>
                </div>
                <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-semibold">
                    <DocumentArrowDownIcon className="w-5 h-5"/>
                    Exportar CSV
                </button>
            </header>

            <div>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    {periodButtons.map(btn => (
                        <button
                            key={btn.key}
                            type="button"
                            onClick={() => setPeriod(btn.key)}
                            className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 transition-colors
                                ${period === btn.key ? 'bg-gray-800 text-white z-10' : 'bg-white text-gray-900 hover:bg-gray-100'}
                                first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r`
                            }
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Total de Vendas" value={`R$ ${reportData.totalSales.toFixed(2)}`} description="Soma de todos os pedidos entregues" />
                <KpiCard title="Total de Pedidos" value={reportData.totalOrders.toString()} description="Nº de pedidos entregues no período" />
                <KpiCard title="Ticket Médio" value={`R$ ${reportData.averageTicket.toFixed(2)}`} description="Valor médio por pedido" />
                <KpiCard title="Clientes (Simulado)" value={reportData.newCustomers.toString()} description="Nº de clientes únicos no período" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart data={reportData.chartData} />
                </div>
                <div className="space-y-6">
                    <TopProductsList products={reportData.topProducts}/>
                    <ChannelSales data={reportData.channelSales} />
                </div>
            </div>

        </div>
    );
};

export default ReportsScreen;
