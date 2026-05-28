import { AppProvider, useApp }     from './context/AppContext';
import { AuthProvider, useAuth }   from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import Estoque        from './pages/Estoque';
import Financeiro     from './pages/Financeiro';
import Lancamento     from './pages/Lancamento';
import Mostruario     from './pages/Mostruario';
import Vitrine        from './pages/Vitrine';
import Personalizacao from './pages/Personalizacao';
import { RedefinirSenha } from './pages/RecuperarSenha';
import './app.css';

const PAGES = {
  dashboard:      { label: 'Início',          icon: '🏠', comp: Dashboard      },
  estoque:        { label: 'Estoque',         icon: '📦', comp: Estoque        },
  financeiro:     { label: 'Financeiro',      icon: '💰', comp: Financeiro     },
  lancamento:     { label: 'Lançar',          icon: '＋', comp: Lancamento     },
  mostruario:     { label: 'Mostruário',      icon: '🗂', comp: Mostruario     },
  personalizacao: { label: 'Personalização',  icon: '🎨', comp: Personalizacao },
};

function detectarRota() {
  const hash = window.location.hash;
  if (hash.startsWith('#/vitrine/'))         return { tipo: 'vitrine' };
  if (hash.startsWith('#/redefinir-senha/')) return { tipo: 'redefinir', token: hash.split('#/redefinir-senha/')[1] };
  return { tipo: 'painel' };
}

function Shell() {
  const { pagina, navegar, toast } = useApp();
  const { usuario, logout }        = useAuth();
  const { tema }                   = useTheme();
  const rota = detectarRota();
  const Page = PAGES[pagina]?.comp ?? Dashboard;

  if (rota.tipo === 'vitrine')   return <Vitrine />;
  if (rota.tipo === 'redefinir') return <RedefinirSenha token={rota.token} />;
  if (!usuario)                  return <Login />;

  // Separar nav mobile (sem personalização) vs sidebar (com tudo)
  const NAV_MOBILE = ['dashboard','estoque','financeiro','lancamento','mostruario'];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">{tema.emoji}</span>
          <span className="logo-text">{tema.nomeLoja}</span>
        </div>
        <nav className="sidebar-nav">
          {Object.entries(PAGES).map(([key, p]) => (
            <button key={key}
              className={`nav-btn ${pagina === key ? 'nav-btn--active' : ''}`}
              onClick={() => navegar(key)}>
              <span className="nav-btn-icon">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">
            <span className="user-avatar">{usuario.nome[0]}</span>
            <span className="user-name">{usuario.nome}</span>
          </div>
          <button className="logout-btn" onClick={logout}>↩ Sair</button>
        </div>
      </aside>

      <main className="main"><Page /></main>

      <nav className="bottom-nav">
        {NAV_MOBILE.map(key => {
          const p = PAGES[key];
          return (
            <button key={key}
              className={`bottom-nav-item ${pagina === key ? 'bottom-nav-item--active' : ''}`}
              onClick={() => navegar(key)}>
              <span className="bottom-nav-icon">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
        {/* Botão de personalização no mobile */}
        <button
          className={`bottom-nav-item ${pagina === 'personalizacao' ? 'bottom-nav-item--active' : ''}`}
          onClick={() => navegar('personalizacao')}>
          <span className="bottom-nav-icon">🎨</span>
          <span>Tema</span>
        </button>
      </nav>

      {toast && <div className={`toast toast--${toast.tipo}`}>{toast.msg}</div>}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Shell />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
