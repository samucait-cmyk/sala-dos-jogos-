import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { User, AuthState } from '../types/game';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; requirePasswordUpdate?: boolean }>;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
  failedAttempts: number;
  isLocked: boolean;
  lockTimeRemaining: number;
  needsPasswordUpdate: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_FAILED_ATTEMPTS = 3;
const LOCK_TIME_SECONDS = 30; 
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; 
const PASSWORD_EXPIRATION_DAYS = 30;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const savedUser = localStorage.getItem('@sala_jogos_user') || localStorage.getItem('@nexus_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.isAuthenticated !== false) {
          return {
            user: parsed,
            isAuthenticated: true,
          };
        }
      }
    } catch (e) {
      console.error('Erro ao recuperar sessão:', e);
    }
    return { user: null, isAuthenticated: false };
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [needsPasswordUpdate, setNeedsPasswordUpdate] = useState(false);

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const lastUpdate = localStorage.getItem('@sala_jogos_password_date');
    if (lastUpdate) {
      const daysPassed = (Date.now() - Number(lastUpdate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= PASSWORD_EXPIRATION_DAYS) {
        setNeedsPasswordUpdate(true);
      }
    } else {
      localStorage.setItem('@sala_jogos_password_date', String(Date.now()));
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isLocked && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimeRemaining]);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (auth.isAuthenticated) {
      inactivityTimerRef.current = setTimeout(() => {
        logout();
        alert('Sessão expirada por inatividade por motivos de segurança.');
      }, INACTIVITY_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const handleUserActivity = () => resetInactivityTimer();

    if (auth.isAuthenticated) {
      events.forEach((event) => window.addEventListener(event, handleUserActivity));
      resetInactivityTimer();
    }

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleUserActivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [auth.isAuthenticated]);

  const login = async (email: string, password: string) => {
    if (isLocked) {
      return { success: false, message: `Acesso bloqueado. Tente novamente em ${lockTimeRemaining}s.` };
    }

    try {
      // Chamada segura para a API Serverless na Vercel (oculta senhas do frontend/F12)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuth({ user: data.user, isAuthenticated: true });
        localStorage.setItem('@sala_jogos_user', JSON.stringify(data.user));
        localStorage.setItem('@nexus_user', JSON.stringify(data.user));
        setFailedAttempts(0);
        setNeedsPasswordUpdate(false);
        return { success: true };
      }

      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      const remaining = MAX_FAILED_ATTEMPTS - nextAttempts;

      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        setIsLocked(true);
        setLockTimeRemaining(LOCK_TIME_SECONDS);
        return {
          success: false,
          message: `Muitas tentativas incorretas. Formulário bloqueado por ${LOCK_TIME_SECONDS} segundos.`
        };
      }

      return {
        success: false,
        message: data.message || `Credenciais inválidas. Restam ${remaining} tentativa(s).`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro de conexão com o servidor de autenticação.'
      };
    }
  };

  const updatePassword = (newPassword: string) => {
    localStorage.setItem('@sala_jogos_password_date', String(Date.now()));
    setNeedsPasswordUpdate(false);
    alert(`Senha atualizada com sucesso! (Nova senha registrada: ${newPassword})`);
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('@sala_jogos_user');
    localStorage.removeItem('@nexus_user');
    window.location.href = '/'; // Redirecionamento limpo e infalível para a Home pública
  };

  return (
    <AuthContext.Provider value={{ 
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
      login, 
      logout, 
      updatePassword,
      failedAttempts, 
      isLocked, 
      lockTimeRemaining, 
      needsPasswordUpdate 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};