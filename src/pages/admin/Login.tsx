import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isLocked, lockTimeRemaining } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sala dos Jogos | Painel Administrativo';
  }, []);

  // Trava de segurança: Bloqueia qualquer tentativa de colar ou copiar dados nos inputs sensíveis
  const handlePreventPasteCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMessage('⚠️ Por motivos de segurança, a colagem de texto não é permitida neste campo.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLocked || isLoading) return;

    // Sanitização padrão: remove espaços vazios nas extremidades
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      setErrorMessage('Por favor, preencha todos os campos de acesso.');
      return;
    }

    setIsLoading(true);

    try {
      // Aguarda a resposta da API segura através do AuthContext
      const result = await login(sanitizedEmail, sanitizedPassword);

      if (result.success) {
        // Limpa a palavra-passe da memória do componente imediatamente após o sucesso
        setPassword('');
        navigate('/admin/dashboard', { replace: true });
        return;
      } 
      
      if (result.requirePasswordUpdate) {
        setErrorMessage('⚠️ A sua palavra-passe expirou após 1 mês. Por favor, atualize-a.');
      } else if (result.message) {
        setErrorMessage(result.message);
      } else {
        setErrorMessage('Credenciais inválidas. Verifique os dados inseridos.');
      }
    } catch (error) {
      setErrorMessage('Ocorreu um erro crítico ao processar a autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#1e293b',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        boxSizing: 'border-box'
      }}>
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px'
          }}>
            Sala dos Jogos Admin
          </span>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
            Área de Gestão e Moderação Restrita
          </p>
        </div>

        {/* Alertas de Erro */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1.4
          }}>
            {errorMessage}
          </div>
        )}

        {/* Alerta de Bloqueio por Força Bruta */}
        {isLocked && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid #f59e0b',
            color: '#fbbf24',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            🔒 Acesso temporariamente suspenso por segurança. Tente novamente em <strong>{lockTimeRemaining}s</strong>.
          </div>
        )}

        {/* Formulário com Travas de Segurança Avançadas */}
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              E-mail de Acesso
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              onPaste={handlePreventPasteCopy}
              onCopy={handlePreventPasteCopy}
              placeholder="admin@saladosjogos.com"
              required
              maxLength={100}
              autoComplete="off"
              disabled={isLocked || isLoading}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid #475569',
                backgroundColor: '#0f172a',
                color: '#fff',
                fontSize: '0.925rem',
                boxSizing: 'border-box',
                outline: 'none',
                opacity: isLocked || isLoading ? 0.6 : 1
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Palavra-passe Segura
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onPaste={handlePreventPasteCopy}
                onCopy={handlePreventPasteCopy}
                placeholder="••••••••••••"
                required
                maxLength={64}
                autoComplete="new-password"
                disabled={isLocked || isLoading}
                style={{
                  width: '100%',
                  padding: '0.8rem 2.75rem 0.8rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '0.925rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                  opacity: isLocked || isLoading ? 0.6 : 1
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                disabled={isLocked || isLoading}
                title={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: isLocked || isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked || isLoading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: isLocked || isLoading ? '#334155' : 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
              color: isLocked || isLoading ? '#94a3b8' : '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: isLocked || isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLocked || isLoading ? 'none' : '0 4px 14px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? '🔐 Autenticando...' : isLocked ? `Bloqueado (${lockTimeRemaining}s)` : 'Entrar na Plataforma'}
          </button>
        </form>
      </div>
    </div>
  );
};