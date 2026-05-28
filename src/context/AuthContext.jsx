import { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Recupera sessão salva no localStorage
    const token = localStorage.getItem('fran_token');
    const nome  = localStorage.getItem('fran_nome');
    if (token && nome) setUsuario({ token, nome });
    setCarregando(false);
  }, []);

  const login = ({ token, nome, email }) => {
    localStorage.setItem('fran_token', token);
    localStorage.setItem('fran_nome', nome);
    setUsuario({ token, nome, email });
  };

  const logout = () => {
    localStorage.removeItem('fran_token');
    localStorage.removeItem('fran_nome');
    setUsuario(null);
  };

  return (
    <AuthCtx.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

// Retorna o token atual para uso nas chamadas da API
export const getToken = () => localStorage.getItem('fran_token');
