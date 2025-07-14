
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../api';
import { MockConversation, ChatMessage } from '../../types';
import { PaperAirplaneIcon, Cog6ToothIcon } from '../../icons';
import { ROUTE_PATHS } from '../../constants';

const ConversationDetail: React.FC<{ history: ChatMessage[] }> = ({ history }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      // In a real app, this would add the message to the state and call an API
      setNewMessage('');
    }
  };

  return (
    <div className="bg-gray-100 p-4 border-t border-gray-200">
      <div className="h-80 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-hide">
        {history.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl ${msg.sender === 'me' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
             <p className={`text-xs ${msg.sender === 'me' ? 'text-gray-400' : 'text-gray-400'}`}>{msg.timestamp}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua resposta..."
          className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-gray-800 focus:border-gray-800 transition-shadow bg-white text-gray-800"
          aria-label="Campo de resposta"
        />
        <button type="submit" className="bg-gray-800 text-white p-2.5 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800" aria-label="Enviar mensagem">
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};


const ConversationItem: React.FC<{ conversation: MockConversation, onClick: () => void, isActive: boolean }> = ({ conversation, onClick, isActive }) => (
  <div 
    onClick={onClick}
    className={`flex items-center p-4 cursor-pointer transition-colors border-b last:border-b-0 border-gray-200 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    role="button"
    aria-expanded={isActive}
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
  >
    <img src={conversation.userAvatar} alt={conversation.userName} className="w-12 h-12 rounded-full mr-4" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 truncate">{conversation.userName}</h3>
        <p className="text-xs text-gray-500">{conversation.timestamp}</p>
      </div>
      <div className="flex justify-between items-start mt-1">
        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
        {conversation.unreadCount && (
          <span className="ml-2 flex-shrink-0 bg-green-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </div>
  </div>
);


const WhatsappScreen: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<MockConversation[]>([]);
  const [messageHistory, setMessageHistory] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://web.whatsapp.com/&bgcolor=F9FAFB&color=1F2937&qzone=1";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [convos, history] = await Promise.all([
          api.getConversations(),
          api.getMessageHistory()
        ]);
        setConversations(convos);
        setMessageHistory(history);
      } catch (error) {
        console.error("Failed to fetch WhatsApp data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConversationClick = (id: string) => {
    setActiveConversationId(prevId => prevId === id ? null : id);
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 h-full overflow-y-auto">
      {/* QR Code Connection Section */}
      <section>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Conecte seu WhatsApp</h2>
              <p className="text-sm text-gray-500">Escaneie o QR Code para receber e responder mensagens diretamente por aqui.</p>
            </div>
            <Link
              to={ROUTE_PATHS.COMPANY_WHATSAPP_BOT}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-semibold"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span>Configurar Robô</span>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
               <img src={qrCodeUrl} alt="QR Code para conectar WhatsApp" className="w-40 h-40 md:w-48 md:h-48" />
            </div>
            <div className="text-gray-600 space-y-3">
              <h3 className="font-semibold text-gray-700">Para conectar:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Abra o WhatsApp no seu celular.</li>
                <li>Toque em <strong>Mais opções</strong> (⋮) ou <strong>Configurações</strong> e selecione <strong>Aparelhos conectados</strong>.</li>
                <li>Toque em <strong>Conectar um aparelho</strong>.</li>
                <li>Aponte seu celular para esta tela para escanear o código QR.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Conversations Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Conversas</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
             <div className="text-center p-12 text-gray-500">Carregando conversas...</div>
          ) : conversations.length > 0 ? (
            <div>
              {conversations.map(convo => (
                <div key={convo.id}>
                  <ConversationItem
                    conversation={convo}
                    onClick={() => handleConversationClick(convo.id)}
                    isActive={activeConversationId === convo.id}
                  />
                  {activeConversationId === convo.id && (
                    <ConversationDetail history={messageHistory[convo.id] || []} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <p className="text-gray-500">Nenhuma conversa encontrada.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WhatsappScreen;
