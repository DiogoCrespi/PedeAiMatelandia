
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { ROUTE_PATHS } from '../constants';
import { MOCK_USER } from '../data';
import { LogoIcon, GoogleIcon, FacebookIcon, EyeIcon, EyeSlashIcon } from '../icons';

interface SignupScreenProps {
  onSignup: (user: User, fromPath?: string) => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const fromPath = location.state?.from?.pathname;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (name && email && password) {
      // Create a new mock user, or use the existing one but update the name/email
      const newUser: User = { ...MOCK_USER, id: `user-${Date.now()}`, name, email };
      onSignup(newUser, fromPath);
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };
  
  const handleSocialLogin = () => {
    // In a real app, this would trigger the social auth flow.
    // For this mock, we just log in with the default user.
    onSignup(MOCK_USER, fromPath);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-appBg p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-appBorderLight">
        <div className="flex justify-center mb-8 text-appTextPrimary">
          <LogoIcon className="w-20 h-20" />
        </div>
        <h2 className="text-3xl font-bold text-center text-appTextPrimary mb-2">Crie sua Conta</h2>
        <p className="text-center text-appTextSecondary mb-8">É rápido e fácil!</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-appTextPrimary mb-1">Nome Completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 border border-appBorderLight rounded-lg focus:ring-appTextPrimary focus:border-appTextPrimary transition-shadow bg-white text-appTextPrimary placeholder-appTextSecondary"
              required
            />
          </div>
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
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-appTextPrimary mb-1">Senha</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha forte"
              className="w-full px-4 py-3 border border-appBorderLight rounded-lg focus:ring-appTextPrimary focus:border-appTextPrimary transition-shadow bg-white text-appTextPrimary placeholder-appTextSecondary"
              required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-7 px-3 flex items-center text-appTextSecondary hover:text-appTextPrimary"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
                {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-appTextPrimary mb-1">Confirmar Senha</label>
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              className="w-full px-4 py-3 border border-appBorderLight rounded-lg focus:ring-appTextPrimary focus:border-appTextPrimary transition-shadow bg-white text-appTextPrimary placeholder-appTextSecondary"
              required
            />
             <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 top-7 px-3 flex items-center text-appTextSecondary hover:text-appTextPrimary"
                aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
            >
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-appPrimaryActionBg text-appPrimaryActionText py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-appTextPrimary focus:ring-opacity-50 mt-2"
          >
            Criar Conta
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-appTextSecondary">
            Já tem uma conta?{' '}
            <Link to={ROUTE_PATHS.LOGIN} className="font-semibold text-appTextPrimary hover:underline">
              Faça login
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
                <GoogleIcon className="w-5 h-5 mr-3" /> Criar com Google
            </button>
            <button onClick={handleSocialLogin} className="w-full flex items-center justify-center py-3 border border-appBorderLight rounded-lg hover:bg-appHeaderButtonBg text-appTextPrimary transition-colors">
                <FacebookIcon className="w-6 h-6 mr-2" /> Criar com Facebook
            </button>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
