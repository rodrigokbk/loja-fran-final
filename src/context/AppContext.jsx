import { createContext, useContext, useState, useCallback } from 'react';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [pagina, setPagina] = useState('dashboard');
  const [toast, setToast]   = useState(null);
  const [modal, setModal]   = useState(null); // { tipo, dados }

  const navegar = useCallback((p) => setPagina(p), []);

  const mostrarToast = useCallback((msg, tipo = 'sucesso') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const abrirModal = useCallback((tipo, dados = {}) => setModal({ tipo, dados }), []);
  const fecharModal = useCallback(() => setModal(null), []);

  return (
    <AppCtx.Provider value={{ pagina, navegar, toast, mostrarToast, modal, abrirModal, fecharModal }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
