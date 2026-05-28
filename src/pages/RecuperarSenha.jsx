import { useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ── Tela: Esqueci minha senha ─────────────────────────────────
export function EsqueciSenha({ onVoltar }) {
  const [email,   setEmail]   = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro,    setErro]    = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!email) return setErro('Digite seu email.');
    setLoading(true); setErro('');
    try {
      const res  = await fetch(`${BASE}/auth/recuperar-senha`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setErro(data.erro || 'Erro ao enviar.');
      setEnviado(true);
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
          <span className="login-logo-icon">🔑</span>
          <h1 className="login-titulo">Recuperar senha</h1>
          <p className="login-sub">Enviaremos um link para seu email</p>
        </div>

        {enviado ? (
          <div className="recuperar-sucesso">
            <span style={{ fontSize: '2.5rem' }}>📬</span>
            <p>Email enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha.</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: '0.5rem' }}>
              O link expira em 1 hora.
            </p>
            <button className="btn-primary login-btn" onClick={onVoltar}>
              Voltar ao login
            </button>
          </div>
        ) : (
          <div className="login-form">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              placeholder="fran@loja.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEnviar()}
              autoComplete="email"
            />
            {erro && <p className="login-erro">{erro}</p>}
            <button className="btn-primary login-btn" onClick={handleEnviar} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
            <button className="btn-link" onClick={onVoltar}>← Voltar ao login</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tela: Redefinir senha (acessada pelo link do email) ───────
export function RedefinirSenha({ token }) {
  const [form,    setForm]    = useState({ nova: '', confirma: '' });
  const [sucesso, setSucesso] = useState(false);
  const [erro,    setErro]    = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!form.nova || !form.confirma) return setErro('Preencha os dois campos.');
    if (form.nova !== form.confirma)  return setErro('As senhas não coincidem.');
    if (form.nova.length < 6)         return setErro('A senha deve ter pelo menos 6 caracteres.');
    setLoading(true); setErro('');
    try {
      const res  = await fetch(`${BASE}/auth/redefinir-senha`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, nova_senha: form.nova }),
      });
      const data = await res.json();
      if (!res.ok) return setErro(data.erro || 'Erro ao redefinir.');
      setSucesso(true);
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
          <span className="login-logo-icon">🔐</span>
          <h1 className="login-titulo">Nova senha</h1>
          <p className="login-sub">Escolha uma senha segura</p>
        </div>

        {sucesso ? (
          <div className="recuperar-sucesso">
            <span style={{ fontSize: '2.5rem' }}>✅</span>
            <p>Senha atualizada com sucesso!</p>
            <button className="btn-primary login-btn"
              onClick={() => window.location.hash = ''}>
              Ir para o login
            </button>
          </div>
        ) : (
          <div className="login-form">
            <label className="field-label">Nova senha</label>
            <input
              className="field-input"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.nova}
              onChange={e => setForm(f => ({ ...f, nova: e.target.value }))}
            />
            <label className="field-label" style={{ marginTop: '0.875rem' }}>Confirmar senha</label>
            <input
              className="field-input"
              type="password"
              placeholder="Repita a senha"
              value={form.confirma}
              onChange={e => setForm(f => ({ ...f, confirma: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSalvar()}
            />

            {/* Indicador de força da senha */}
            {form.nova && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1,2,3,4].map(n => (
                    <div key={n} style={{
                      flex: 1, height: '4px', borderRadius: '99px',
                      background: form.nova.length >= n * 3
                        ? n <= 1 ? '#DC2626' : n <= 2 ? '#EA580C' : n <= 3 ? '#F59E0B' : '#16A34A'
                        : '#E7E5E4'
                    }}/>
                  ))}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>
                  {form.nova.length < 3  ? 'Muito fraca' :
                   form.nova.length < 6  ? 'Fraca' :
                   form.nova.length < 9  ? 'Boa' :
                   form.nova.length < 12 ? 'Forte' : 'Muito forte'}
                </p>
              </div>
            )}

            {erro && <p className="login-erro">{erro}</p>}
            <button className="btn-primary login-btn" onClick={handleSalvar} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
