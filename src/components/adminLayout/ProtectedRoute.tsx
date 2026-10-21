import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Validação redundante para impedir falso bloqueio e eliminar qualquer tela em branco
  const hasLocalSession = localStorage.getItem('@sala_jogos_user') !== null || localStorage.getItem('@nexus_user') !== null;

  if (!isAuthenticated && !hasLocalSession) {
    return <Navigate to="/sala-control-center-admin-2026/login" replace />;
  }

  return <>{children}</>;
};