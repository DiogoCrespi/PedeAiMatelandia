



import React, { useState, useEffect } from 'react';
import { QuickReply, CompanyPromotion } from '../../types';
import * as api from '../../api';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, MegaphoneIcon, ArrowPathIcon, SparklesIcon } from '../../icons';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Reusable Toggle Switch Component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-800/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </label>
  );
};

// Modal for Adding/Editing Quick Replies
const QuickReplyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (reply: Omit<QuickReply, 'id'> | QuickReply) => void;
  replyToEdit: Omit<QuickReply, 'id'> | QuickReply | null;
}> = ({ isOpen, onClose, onSave, replyToEdit }) => {
  const [intent, setIntent] = useState('');
  const [reply, setReply] = useState('');

  React.useEffect(() => {
    if (replyToEdit) {
      setIntent(replyToEdit.intent);
      setReply(replyToEdit.reply);
    } else {
      setIntent('');
      setReply('');
    }
  }, [replyToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyToEdit && 'id' in replyToEdit) {
      onSave({ ...replyToEdit, intent, reply });
    } else {
      onSave({ intent, reply });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{replyToEdit ? 'Editar' : 'Adicionar'} Resposta Rápida</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="intent" className="block text-sm font-medium text-gray-700 mb-1">Palavra-chave (intenção)</label>
            <input
              id="intent"
              type="text"
              value={intent}
              onChange={e => setIntent(e.target.value.toLowerCase())}
              placeholder="Ex: cardápio, horário, entrega"
              className="input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-1">Resposta do Robô</label>
            <textarea
              id="reply"
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Digite a resposta automática para esta palavra-chave."
              rows={4}
              className="input w-full"
              required
            ></textarea>
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


const WhatsappBotScreen: React.FC = () => {
  const [isBotActive, setIsBotActive] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('');
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReply, setEditingReply] = useState<QuickReply | null>(null);

  const [reengagementConfig, setReengagementConfig] = useState({
    isActive: false,
    daysInactive: 30,
    message: 'Olá! Sentimos sua falta. Que tal dar uma olhada nas nossas novidades? 😉',
  });
  const [promotions, setPromotions] = useState<CompanyPromotion[]>([]);
  const [selectedPromoId, setSelectedPromoId] = useState<string>('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [replies, promos, restaurantData] = await Promise.all([
                api.getQuickReplies(),
                api.getCompanyPromotions(),
                api.getRestaurantById('rest1')
            ]);
            setQuickReplies(replies);
            setPromotions(promos);
            if(restaurantData?.whatsappConfig) {
                setGreetingMessage(restaurantData.whatsappConfig.greetingMessage);
                if (restaurantData.whatsappConfig.reengagementConfig) {
                    setReengagementConfig(restaurantData.whatsappConfig.reengagementConfig);
                }
            }
            if (promos.length > 0) {
              setSelectedPromoId(promos.find(p => p.isActive)?.id || promos[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch bot settings:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, []);

  const handleSaveReply = async (replyData: Omit<QuickReply, 'id'> | QuickReply) => {
    try {
        if ('id' in replyData) { // Editing
            const updatedReply = await api.updateQuickReply(replyData);
            setQuickReplies(prev => prev.map(r => r.id === updatedReply.id ? updatedReply : r));
        } else { // Adding
            const newReply = await api.addQuickReply(replyData);
            setQuickReplies(prev => [newReply, ...prev]);
        }
    } catch(error) {
        console.error("Failed to save quick reply:", error);
        alert("Erro ao salvar resposta rápida.");
    }
  };
  
  const handleDeleteReply = async (id: string) => {
      if (window.confirm("Tem certeza que deseja remover esta resposta?")) {
          try {
            await api.deleteQuickReply(id);
            setQuickReplies(prev => prev.filter(r => r.id !== id));
          } catch (error) {
            console.error("Failed to delete quick reply:", error);
            alert("Erro ao excluir resposta rápida.");
          }
      }
  }

  const handleOpenModal = (reply: QuickReply | null = null) => {
    setEditingReply(reply);
    setIsModalOpen(true);
  }
  
  const handleReengagementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReengagementConfig(prev => ({
        ...prev,
        [name]: name === 'daysInactive' ? parseInt(value, 10) : value,
    }));
  };

  const handleGenerateMessage = async () => {
    setIsGeneratingMessage(true);
    try {
        const prompt = `Crie uma mensagem curta e amigável para reengajar um cliente de um app de delivery de comida que não pede há algum tempo. Incentive-o a conferir as novidades ou promoções. Mantenha a mensagem com menos de 160 caracteres e um tom informal, usando emojis.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        const text = response.text.trim().replace(/^"|"$/g, ''); // Also remove quotes
        
        setReengagementConfig(prev => ({ ...prev, message: text }));

    } catch (error) {
        console.error("Error generating re-engagement message:", error);
        alert("Não foi possível gerar a mensagem. Tente novamente.");
    } finally {
        setIsGeneratingMessage(false);
    }
  };


  const getPromoBroadcastMessage = () => {
    if (!selectedPromoId) return 'Selecione uma promoção para ver a mensagem.';
    const promo = promotions.find(p => p.id === selectedPromoId);
    if (!promo) return 'Promoção não encontrada.';
    return `📢 PROMOÇÃO IMPERDÍVEL!\n\n*${promo.name}*\n${promo.description}\n\nAproveite agora!`;
  };
  
  const handleSaveReengagement = async () => {
      try {
          await api.updateWhatsappBotConfig({ reengagementConfig });
          alert('Configurações de reengajamento salvas!');
      } catch(error) {
          alert('Erro ao salvar configurações de reengajamento.');
          console.error(error);
      }
  };
  
  const handleSaveGreeting = async () => {
       try {
            await api.updateWhatsappGreeting(greetingMessage);
            alert(`Mensagem de saudação salva com sucesso!`);
      } catch (error) {
            alert(`Erro ao salvar mensagem de saudação.`);
            console.error(error);
      }
  };

  const handleSendBroadcast = () => {
      if (!selectedPromoId) {
          alert('Por favor, selecione uma promoção para divulgar.');
          return;
      }
      const message = getPromoBroadcastMessage();
      if (window.confirm("Você tem certeza que deseja enviar esta promoção para todos os seus contatos?")) {
          api.sendPromoBroadcast(selectedPromoId, message)
            .then(() => alert("Disparo de promoção iniciado! (Simulação)"))
            .catch((err) => {
                console.error(err);
                alert("Erro ao iniciar disparo de promoção.");
            });
      }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 h-full overflow-y-auto">
        <style>{`.input { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; color: #1f2937; } .input:focus { ring: 1; border-color: #1f2937; outline:none; } .btn-primary { background-color: #1f2937; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; } .btn-secondary { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }`}</style>

      <QuickReplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReply}
        replyToEdit={editingReply}
      />
      
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Robô de Atendimento</h1>
        <p className="text-gray-600 mt-1">Configure respostas automáticas para agilizar o atendimento no WhatsApp.</p>
      </header>

      {/* Activation Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-semibold text-gray-800">Status do Robô</h2>
            <p className="text-sm text-gray-500">Ative para que as mensagens automáticas sejam enviadas.</p>
        </div>
        <div className="flex items-center">
            <span className={`mr-4 font-semibold text-sm ${isBotActive ? 'text-green-600' : 'text-red-600'}`}>
                {isBotActive ? 'ATIVADO' : 'DESATIVADO'}
            </span>
            <ToggleSwitch
                checked={isBotActive}
                onChange={setIsBotActive}
            />
        </div>
      </section>

      {/* Greeting Message Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Mensagem de Saudação</h2>
        <p className="text-sm text-gray-500 mb-4">Esta é a primeira mensagem que o cliente receberá ao entrar em contato.</p>
        <textarea
            value={greetingMessage}
            onChange={e => setGreetingMessage(e.target.value)}
            rows={3}
            className="input w-full"
            placeholder="Digite sua mensagem de saudação..."
        />
         <div className="text-right mt-2">
            <button onClick={handleSaveGreeting} className="btn-primary text-sm">Salvar Mensagem</button>
        </div>
      </section>

      {/* Quick Replies Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Respostas Automáticas</h2>
            <button 
                onClick={() => handleOpenModal()}
                className="btn-primary flex items-center gap-2"
            >
                <PlusIcon className="w-5 h-5"/>
                <span>Adicionar</span>
            </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">Carregando respostas...</div>
          ) : quickReplies.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {quickReplies.map(qr => (
                <div key={qr.id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-gray-50/50">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Se o cliente digitar:</p>
                    <p className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block my-1">"{qr.intent}"</p>
                    <p className="text-sm text-gray-500 mt-2">O robô responderá:</p>
                    <p className="text-gray-700 italic mt-1">"{qr.reply}"</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-start sm:self-center">
                    <button onClick={() => handleOpenModal(qr)} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full" aria-label="Editar resposta"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDeleteReply(qr.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full" aria-label="Excluir resposta"><TrashIcon className="w-5 h-5"/></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <p className="text-gray-500">Nenhuma resposta automática configurada.</p>
              <p className="text-sm text-gray-600">Clique em "Adicionar" para criar a primeira.</p>
            </div>
          )}
        </div>
      </section>

      {/* Campaigns and Automations Section */}
      <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Campanhas e Automações</h2>
          <div className="space-y-6">
              {/* Re-engagement Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><ArrowPathIcon className="w-5 h-5 text-gray-500" /> Lembrete de Inatividade</h3>
                          <p className="text-sm text-gray-500">Envie uma mensagem para clientes que não compram há algum tempo.</p>
                      </div>
                      <ToggleSwitch checked={reengagementConfig.isActive} onChange={(val) => setReengagementConfig(p => ({...p, isActive: val}))} />
                    </div>
                    <div className={`space-y-4 ${!reengagementConfig.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Enviar após (dias sem comprar)</label>
                          <input 
                              type="number" 
                              name="daysInactive" 
                              value={reengagementConfig.daysInactive} 
                              onChange={handleReengagementChange}
                              className="input w-full"
                              disabled={!reengagementConfig.isActive}
                          />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="reengagementMessage" className="block text-sm font-medium text-gray-700">Mensagem do lembrete</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateMessage}
                                    disabled={isGeneratingMessage || !reengagementConfig.isActive}
                                    className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SparklesIcon className={`w-4 h-4 text-purple-600 ${isGeneratingMessage ? 'animate-pulse' : ''}`} />
                                    <span>{isGeneratingMessage ? 'Gerando...' : 'Gerar com IA'}</span>
                                </button>
                            </div>
                            <textarea
                                id="reengagementMessage"
                                name="message"
                                value={reengagementConfig.message}
                                onChange={handleReengagementChange}
                                rows={3}
                                className="input w-full"
                                disabled={!reengagementConfig.isActive}
                            />
                        </div>
                      <div className="text-right mt-4">
                          <button 
                            onClick={handleSaveReengagement}
                            className="btn-primary text-sm"
                            disabled={!reengagementConfig.isActive}
                          >
                            Salvar
                          </button>
                      </div>
                    </div>
              </div>

              {/* Broadcast Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><MegaphoneIcon className="w-5 h-5 text-gray-500" /> Disparar Promoção</h3>
                      <p className="text-sm text-gray-500">Divulgue uma promoção ativa para seus contatos do WhatsApp.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a promoção</label>
                          <select value={selectedPromoId} onChange={(e) => setSelectedPromoId(e.target.value)} className="input w-full bg-white">
                              <option value="" disabled>Escolha uma promoção...</option>
                              {promotions.filter(p => p.isActive).map(promo => (
                                  <option key={promo.id} value={promo.id}>{promo.name}</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prévia da mensagem</label>
                          <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 whitespace-pre-wrap">
                              {getPromoBroadcastMessage()}
                          </div>
                      </div>
                      <div className="text-right">
                          <button onClick={handleSendBroadcast} className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">Enviar para todos os contatos</button>
                      </div>
                    </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default WhatsappBotScreen;