import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EsqueciSenha } from './RecuperarSenha';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Login() {
  const { login } = useAuth();
  const [tela,    setTela]    = useState('login'); // 'login' | 'esqueci'
  const [form,    setForm]    = useState({ email: '', senha: '' });
  const [erro,    setErro]    = useState('');
  const [loading, setLoading] = useState(false);

  if (tela === 'esqueci') return <EsqueciSenha onVoltar={() => setTela('login')} />;

  const handleLogin = async () => {
    if (!form.email || !form.senha) return setErro('Preencha email e senha.');
    setLoading(true); setErro('');
    try {
      const res  = await fetch(`${BASE}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setErro(data.erro || 'Erro ao entrar.');
      login(data);
    } catch {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-icon">🛍️</span>
          <h1 className="login-titulo">Loja da Fran</h1>
          <p className="login-sub">Painel de gerenciamento</p>
        </div>

        <div className="login-form">
          <label className="field-label">Email</label>
          <input
            className="field-input"
            type="email"
            placeholder="fran@loja.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoComplete="email"
          />

          <label className="field-label" style={{ marginTop: '0.875rem' }}>Senha</label>
          <input
            className="field-input"
            type="password"
            placeholder="••••••••"
            value={form.senha}
            onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoComplete="current-password"
          />

          <button className="btn-link" onClick={() => setTela('esqueci')}
            style={{ alignSelf: 'flex-end', marginTop: '6px', fontSize: '0.78rem' }}>
            Esqueci minha senha
          </button>

          {erro && <p className="login-erro">{erro}</p>}

          <button className="btn-primary login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </div>

        <p className="login-rodape">
          A vitrine pública da loja não precisa de login.
        </p>
      </div>
    </div>
  );
}
