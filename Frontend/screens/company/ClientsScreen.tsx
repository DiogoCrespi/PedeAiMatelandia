
import React, { useState } from 'react';
import { Client } from '../../types';
import { MOCK_CLIENTS } from '../../data';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, UserGroupIcon as PageIcon, DocumentArrowUpIcon, SparklesIcon, DocumentPlusIcon, DocumentTextIcon } from '../../icons';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// Modal for Adding/Editing individual Clients
const ClientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  clientToEdit: Client | null;
}> = ({ isOpen, onClose, onSave, clientToEdit }) => {
  const emptyClient: Omit<Client, 'id' | 'createdAt' | 'orderCount'| 'lastOrder'> = { name: '', phone: '', email: '', address: '' };
  const [client, setClient] = useState(clientToEdit || emptyClient);

  React.useEffect(() => {
    if (isOpen) {
        setClient(clientToEdit || emptyClient);
    }
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(c => ({ ...c, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientToEdit) {
      onSave(client as Client);
    } else {
      onSave({
        ...client,
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString(),
        orderCount: 0
      } as Client);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{clientToEdit ? 'Editar' : 'Adicionar'} Cliente</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              id="name"
              type="text"
              name="name"
              value={client.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
           <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={client.phone}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail (Opcional)</label>
            <input
              id="email"
              type="email"
              name="email"
              value={client.email || ''}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço (Opcional)</label>
            <input
              id="address"
              type="text"
              name="address"
              value={client.address || ''}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Salvar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClientImportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (clients: Omit<Client, 'id' | 'createdAt' | 'orderCount' | 'lastOrder'>[]) => void;
}> = ({ isOpen, onClose, onImport }) => {
    type ParsedClient = Partial<Omit<Client, 'id' | 'createdAt' | 'orderCount' | 'lastOrder'>> & { included: boolean };
    
    interface FilePreview {
        url: string | null;
        name: string;
        type: string;
    }

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<FilePreview>({ url: null, name: '', type: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [parsedClients, setParsedClients] = useState<ParsedClient[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const resetState = () => {
        setSelectedFile(null);
        setFilePreview({ url: null, name: '', type: '' });
        setIsGenerating(false);
        setParsedClients(null);
        setError(null);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            resetState();
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview({
                    url: reader.result as string,
                    name: file.name,
                    type: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateClientList = async () => {
        if (!selectedFile || !filePreview.url) {
            setError("Por favor, selecione um arquivo primeiro.");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setParsedClients(null);
        
        try {
            const base64Data = filePreview.url.split(',')[1];
            const prompt = `Analise a imagem ou arquivo CSV fornecido. Extraia uma lista de clientes. Para cada cliente, extraia o nome completo, telefone, e-mail e endereço. Retorne um array JSON válido. Cada objeto no array deve ter as chaves: "name" (string), "phone" (string), "email" (string, opcional, pode ser vazio) e "address" (string, opcional, pode ser vazio).`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{
                  text: prompt
                }, {
                  inlineData: {
                    mimeType: selectedFile.type,
                    data: base64Data,
                  },
                }],
                 config: {
                    responseMimeType: "application/json",
                 }
            });

            let jsonStr = response.text.trim();
            const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
            const match = jsonStr.match(fenceRegex);
            if (match && match[2]) {
              jsonStr = match[2].trim();
            }

            const parsedData: any[] = JSON.parse(jsonStr);
            if (!Array.isArray(parsedData)) throw new Error("A resposta da IA não foi um array.");

            const clients: ParsedClient[] = parsedData.map(item => ({
                name: item.name || '',
                phone: item.phone || '',
                email: item.email || '',
                address: item.address || '',
                included: true,
            }));
            setParsedClients(clients);

        } catch (e) {
            console.error("Erro ao processar a lista de clientes:", e);
            setError("Não foi possível processar o arquivo. Verifique se o arquivo é nítido e tente novamente. Detalhe: " + (e as Error).message);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleClientChange = (index: number, field: keyof ParsedClient, value: string | boolean) => {
        if (!parsedClients) return;
        const newClients = [...parsedClients];
        (newClients[index] as any)[field] = value;
        setParsedClients(newClients);
    };

    const handleConfirmImport = () => {
        if (!parsedClients) return;
        const clientsToImport = parsedClients
            .filter(c => c.included)
            .map(({ included, ...rest }) => rest as Omit<Client, 'id' | 'createdAt' | 'orderCount' | 'lastOrder'>);
        onImport(clientsToImport);
        handleClose();
    };

    const importedItemCount = parsedClients?.filter(c => c.included).length || 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Importar Clientes de Arquivo</h2>
                    <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {!parsedClients ? (
                        <div className="text-center">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,text/csv,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" />
                            <div 
                                className="w-full h-64 bg-gray-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {filePreview.url ? (
                                    filePreview.type.startsWith('image/') ? (
                                        <img src={filePreview.url} alt="Pré-visualização da lista" className="max-h-full max-w-full p-2 object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center text-gray-600">
                                            <DocumentTextIcon className="w-20 h-20 text-gray-400 mb-2" />
                                            <p className="font-semibold">{filePreview.name}</p>
                                            <p className="text-sm text-gray-500">{filePreview.type}</p>
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <DocumentPlusIcon className="w-16 h-16 text-gray-400 mb-2"/>
                                        <p className="font-semibold text-gray-700">Clique para selecionar uma foto ou arquivo CSV da sua lista</p>
                                        <p className="text-sm text-gray-500">Ou arraste e solte o arquivo aqui</p>
                                    </>
                                )}
                            </div>

                            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                            
                            <button
                                onClick={handleGenerateClientList}
                                disabled={!filePreview.url || isGenerating}
                                className="mt-6 btn-primary px-8 py-3 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {isGenerating ? (
                                    <><SparklesIcon className="w-5 h-5 animate-pulse" /> Analisando com IA...</>
                                ) : (
                                    <><SparklesIcon className="w-5 h-5" /> Importar Lista</>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Verifique os clientes encontrados</h3>
                            <p className="text-sm text-gray-600 mb-4">Ajuste os campos se necessário e desmarque os que não deseja importar.</p>
                            
                            <div className="grid grid-cols-12 gap-x-3 items-center px-2 pb-2 border-b font-semibold text-gray-500 text-xs uppercase">
                                <div className="col-span-1 flex justify-center">
                                    <input type="checkbox" checked={importedItemCount === parsedClients.length && parsedClients.length > 0} onChange={(e) => setParsedClients(parsedClients.map(c => ({...c, included: e.target.checked})))} className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800"/>
                                </div>
                                <div className="col-span-3">Nome</div>
                                <div className="col-span-2">Telefone</div>
                                <div className="col-span-3">Email</div>
                                <div className="col-span-3">Endereço</div>
                            </div>
                            <div className="space-y-2 overflow-y-auto pr-2 pt-2 max-h-[45vh]">
                                {parsedClients.map((c, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-x-3 items-center p-2 rounded-md hover:bg-gray-50">
                                        <div className="col-span-1 flex justify-center"><input type="checkbox" checked={c.included} onChange={e => handleClientChange(i, 'included', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800"/></div>
                                        <div className="col-span-3"><input type="text" value={c.name} onChange={e => handleClientChange(i, 'name', e.target.value)} className="input text-sm" placeholder="Nome" /></div>
                                        <div className="col-span-2"><input type="text" value={c.phone} onChange={e => handleClientChange(i, 'phone', e.target.value)} className="input text-sm" placeholder="Telefone" /></div>
                                        <div className="col-span-3"><input type="email" value={c.email} onChange={e => handleClientChange(i, 'email', e.target.value)} className="input text-sm" placeholder="Email" /></div>
                                        <div className="col-span-3"><input type="text" value={c.address} onChange={e => handleClientChange(i, 'address', e.target.value)} className="input text-sm" placeholder="Endereço"/></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {parsedClients && (
                     <div className="p-4 border-t flex justify-end items-center">
                        <div className="flex gap-3">
                            <button type="button" onClick={handleClose} className="btn-secondary">Cancelar</button>
                            <button type="button" onClick={handleConfirmImport} className="btn-primary" disabled={importedItemCount === 0}>
                                Adicionar {importedItemCount} Clientes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const OnboardingCard: React.FC<{icon: React.ElementType, title: string, description: string, onClick?: () => void}> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-800 transition-all h-full">
        <Icon className="w-8 h-8 mb-3 text-gray-500" />
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </button>
);


const ClientsScreen: React.FC = () => {
    const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const handleOpenModal = (client: Client | null = null) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleSaveClient = (clientData: Client) => {
        const isEditing = clients.some(c => c.id === clientData.id);
        if (isEditing) {
            setClients(prev => prev.map(c => c.id === clientData.id ? clientData : c));
        } else {
            setClients(prev => [clientData, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteClient = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
            setClients(prev => prev.filter(c => c.id !== id));
        }
    };
    
    const handleImportClients = (importedClients: Omit<Client, 'id' | 'createdAt' | 'orderCount' | 'lastOrder'>[]) => {
        const newClients = importedClients.map(c => ({
            ...c,
            id: `client-${Date.now()}-${Math.random()}`,
            createdAt: new Date().toISOString(),
            orderCount: 0,
            lastOrder: undefined
        }));
        setClients(prev => [...newClients, ...prev]);
        alert(`${newClients.length} clientes importados com sucesso!`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 h-full overflow-y-auto">
            <style>{`.input { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { ring: 1; border-color: #1f2937; outline:none; } .btn-primary { background-color: #1f2937; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; } .btn-secondary { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }`}</style>
            
            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClient}
                clientToEdit={editingClient}
            />

            <ClientImportModal 
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportClients}
            />

            <header>
                <h1 className="text-3xl font-bold text-gray-800">Clientes Locais</h1>
                <p className="text-gray-600 mt-1">Gerencie os clientes cadastrados manualmente ou importe uma lista.</p>
            </header>

            <section className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Comece a cadastrar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <OnboardingCard icon={DocumentArrowUpIcon} title="Importar de Arquivo" description="Use nossa IA para importar de uma foto ou arquivo CSV." onClick={() => setIsImportModalOpen(true)} />
                    <OnboardingCard icon={PlusIcon} title="Adicionar Manualmente" description="Cadastre um novo cliente preenchendo o formulário." onClick={() => handleOpenModal()} />
                </div>
            </section>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Lista de Clientes</h2>
                    <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 text-sm">
                        <PlusIcon className="w-4 h-4"/>
                        <span>Adicionar Manualmente</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Último Pedido</th>
                                <th className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedidos</th>
                                <th className="p-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-700">
                                        <div className="font-semibold text-gray-800">{client.name}</div>
                                        <div className="text-xs text-gray-500">{client.phone} {client.email && `• ${client.email}`}</div>
                                        {client.address && <div className="text-xs text-gray-500 mt-1">{client.address}</div>}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700">
                                        {client.lastOrder ? new Date(client.lastOrder).toLocaleDateString('pt-BR') : 'Nenhum'}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 font-semibold text-center">{client.orderCount}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleOpenModal(client)} className="p-2 text-gray-500 hover:text-gray-800"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteClient(client.id)} className="p-2 text-gray-500 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {clients.length === 0 && (
                        <div className="text-center py-12">
                             <PageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente cadastrado</h3>
                            <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo cliente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientsScreen;
