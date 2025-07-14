import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ChevronLeftIcon, WhatsappIcon, EmailIcon, PaperAirplaneIcon, CheckCircleIcon } from '../icons';
import * as api from '../api';

interface HelpCenterScreenProps {
  user: User;
}

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ user }) => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && message) {
      try {
        await api.submitHelpRequest({
          name: user.name,
          email: user.email,
          subject,
          message,
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Failed to submit help request:", error);
        alert('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
      }
    } else {
      alert('Por favor, selecione um assunto e escreva sua mensagem.');
    }
  };

  // Replace with your actual contact info
  const WHATSAPP_NUMBER = '5545999999999'; // Example number
  const SUPPORT_EMAIL = 'suporte@pedeai.com';

  if (submitted) {
    return (
      <div className="flex flex-col flex-1 bg-appBg min-h-screen">
         {/* Header */}
         <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 mr-2">
            <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
          </button>
          <h1 className="text-xl font-bold text-appTextPrimary">Central de Ajuda</h1>
        </div>
        <div className="flex flex-col items-center justify-center text-center p-8 flex-1">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-appTextPrimary mb-2">Solicitação Enviada!</h2>
            <p className="text-appTextSecondary mb-8 max-w-sm">
                Sua solicitação foi enviada com sucesso. Nossa equipe entrará em contato com você em breve pelo e-mail: <br/> <strong className="text-appTextPrimary">{user.email}</strong>.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-appPrimaryActionBg text-appPrimaryActionText rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Voltar para a Home
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-appBg min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-appBorderLight bg-white sticky top-[60px] z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
          <ChevronLeftIcon className="w-6 h-6 text-appTextPrimary" />
        </button>
        <h1 className="text-xl font-bold text-appTextPrimary">Central de Ajuda</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight">
            <h2 className="text-lg font-semibold text-appTextPrimary mb-3">Contato Rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, preciso de ajuda com meu pedido no PedeAí.')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#1EBE56] transition-colors"
                >
                    <WhatsappIcon className="w-5 h-5"/>
                    Contatar por WhatsApp
                </a>
                <a 
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="flex items-center justify-center gap-2 p-3 bg-appHeaderButtonBg text-appTextPrimary rounded-lg font-semibold hover:bg-appHeaderButtonBgHover transition-colors"
                >
                    <EmailIcon className="w-5 h-5"/>
                    Contatar por E-mail
                </a>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-appBorderLight space-y-4">
            <h2 className="text-lg font-semibold text-appTextPrimary">Abrir uma Solicitação</h2>
            <p className="text-sm text-appTextSecondary -mt-3">Use o formulário abaixo para questões mais detalhadas.</p>
            
            <div>
              <label className="block text-sm font-medium text-appTextPrimary mb-1">Seu Nome</label>
              <input type="text" value={user.name} readOnly className="w-full px-3 py-2 border border-appBorderLight rounded-md bg-appBg cursor-not-allowed text-appTextSecondary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-appTextPrimary mb-1">Seu E-mail</label>
              <input type="email" value={user.email} readOnly className="w-full px-3 py-2 border border-appBorderLight rounded-md bg-appBg cursor-not-allowed text-appTextSecondary" />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-appTextPrimary mb-1">Assunto</label>
              <select 
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white text-appTextPrimary"
                required
              >
                  <option value="" disabled>Selecione um assunto...</option>
                  <option value="Problema com pedido">Problema com pedido</option>
                  <option value="Pagamento">Pagamento</option>
                  <option value="Dúvida sobre produto/loja">Dúvida sobre produto/loja</option>
                  <option value="Problema técnico no app">Problema técnico no app</option>
                  <option value="Sugestão ou feedback">Sugestão ou feedback</option>
                  <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-appTextPrimary mb-1">Mensagem</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Descreva sua solicitação em detalhes aqui..."
                className="w-full px-3 py-2 border border-appBorderLight rounded-md focus:ring-appTextPrimary focus:border-appTextPrimary bg-white text-appTextPrimary placeholder-appTextSecondary"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <PaperAirplaneIcon className="w-5 h-5 -mt-0.5 transform -rotate-45" />
                Enviar Solicitação
            </button>
        </form>
      </div>
    </div>
  );
};

export default HelpCenterScreen;