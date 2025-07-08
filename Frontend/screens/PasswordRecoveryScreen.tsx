import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants';
import { LogoIcon as HeaderLogoIcon, CheckCircleIcon } from '../icons';

const PasswordRecoveryScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call your API here.
    // For this example, we'll just move to the submitted state.
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-appBg p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-appBorderLight">
        <div className="flex justify-center mb-8 text-appTextPrimary">
          <HeaderLogoIcon className="w-20 h-20" />
        </div>
        
        {submitted ? (
          <div className="text-center">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircleIcon className="w-12 h-12" />
             </div>
            <h2 className="text-2xl font-bold text-center text-appTextPrimary mb-2">Verifique seu e-mail</h2>
            <p className="text-center text-appTextSecondary mb-8">
              Se uma conta associada a <strong>{email}</strong> existir, enviamos um link para redefinir sua senha.
            </p>
            <button
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
              className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-appTextPrimary focus:ring-opacity-50"
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-appTextPrimary mb-2">Recuperar Senha</h2>
            <p className="text-center text-appTextSecondary mb-8">Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-appTextPrimary mb-1">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-3 border border-appBorderLight rounded-lg focus:ring-appTextPrimary focus:border-appTextPrimary transition-shadow bg-white text-appTextPrimary placeholder-appTextSecondary"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-appTextPrimary focus:ring-opacity-50"
              >
                Enviar Link
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-appTextSecondary">
                Lembrou sua senha?{' '}
                <Link to={ROUTE_PATHS.LOGIN} className="font-semibold text-appTextPrimary hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordRecoveryScreen;