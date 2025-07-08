
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { ROUTE_PATHS } from '../constants';
import { MOCK_USER } from '../data';
import { LogoIcon, GoogleIcon } from '../icons';

interface LoginScreenProps {
  onLogin: (user: User, fromPath?: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const location = useLocation();
  const fromPath = location.state?.from?.pathname;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(MOCK_USER, fromPath);
    } else {
      alert('Por favor, preencha e-mail e senha.');
    }
  };

  const handleSocialLogin = () => {
    onLogin(MOCK_USER, fromPath);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-appBg p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-appBorderLight">
        <div className="flex justify-center mb-8 text-appTextPrimary">
          <LogoIcon className="w-20 h-20" />
        </div>
        <h2 className="text-3xl font-bold text-center text-appTextPrimary mb-2">Bem-vindo!</h2>
        <p className="text-center text-appTextSecondary mb-8">Faça login para continuar</p>
        
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-appTextPrimary mb-1">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full px-4 py-3 border border-appBorderLight rounded-lg focus:ring-appTextPrimary focus:border-appTextPrimary transition-shadow bg-white text-appTextPrimary placeholder-appTextSecondary"
              required
            />
          </div>
          <div className="text-right">
            <Link to={ROUTE_PATHS.PASSWORD_RECOVERY} className="text-sm text-appTextPrimary hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-appTextPrimary focus:ring-opacity-50"
          >
            Entrar
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-appTextSecondary">
            Não tem uma conta?{' '}
            <Link to={ROUTE_PATHS.SIGNUP} className="font-semibold text-appTextPrimary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-appBorderLight"/>
          <span className="mx-4 text-appTextSecondary text-sm">OU</span>
          <hr className="flex-grow border-appBorderLight"/>
        </div>

        <div className="space-y-3">
            <button onClick={handleSocialLogin} className="w-full flex items-center justify-center py-3 border border-appBorderLight rounded-lg hover:bg-appHeaderButtonBg text-appTextPrimary transition-colors">
                <GoogleIcon className="w-5 h-5 mr-3" /> Entrar com Google
            </button>
            <button onClick={handleSocialLogin} className="w-full flex items-center justify-center py-3 border border-appBorderLight rounded-lg hover:bg-appHeaderButtonBg text-appTextPrimary transition-colors">
                <span className="w-5 h-5 mr-2 bg-blue-700 rounded-full inline-block text-white text-center font-bold leading-5">f</span> Entrar com Facebook
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
