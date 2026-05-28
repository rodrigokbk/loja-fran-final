import { useState } from 'react';
import { useTheme, FONTES, TEMA_PADRAO } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

// Paletas prontas para escolher com 1 clique
const PALETAS = [
  { nome: 'Rosa Fran',    accent: '#E85D75', accent2: '#4ECDC4', bg: '#FAF9F7', surface: '#FFFFFF', text: '#1C1917' },
  { nome: 'Roxo Elegante',accent: '#7C3AED', accent2: '#F59E0B', bg: '#FAF9FF', surface: '#FFFFFF', text: '#1E1B4B' },
  { nome: 'Verde Botânico',accent: '#16A34A',accent2: '#F59E0B', bg: '#F6FAF7', surface: '#FFFFFF', text: '#14532D' },
  { nome: 'Terracota',    accent: '#C2410C', accent2: '#0891B2', bg: '#FDF6F0', surface: '#FFFFFF', text: '#431407' },
  { nome: 'Azul Marinho', accent: '#1D4ED8', accent2: '#EC4899', bg: '#F5F8FF', surface: '#FFFFFF', text: '#1E3A5F' },
  { nome: 'Preto & Ouro', accent: '#B45309', accent2: '#D97706', bg: '#FAFAF9', surface: '#FFFFFF', text: '#0C0A09' },
  { nome: 'Candy Pink',   accent: '#DB2777', accent2: '#7C3AED', bg: '#FFF5F9', surface: '#FFFFFF', text: '#1C1917' },
  { nome: 'Sage Claro',   accent: '#0D9488', accent2: '#F472B6', bg: '#F4FAF9', surface: '#FFFFFF', text: '#134E4A' },
  { nome: 'Dark Mode',    accent: '#F472B6', accent2: '#34D399', bg: '#0F0F0F', surface: '#1C1C1C', text: '#FAFAF9' },
];

const EMOJIS = ['🛍️','👗','✨','💅','🌸','🌺','🎀','💎','🪷','🌷','👠','👒','🧵','🪡','💐','👞','🥾','👡','👟','💼'];

export default function Personalizacao() {
  const { tema, salvarTema, resetarTema } = useTheme();
  const { mostrarToast } = useApp();
  const [local, setLocal] = useState({ ...tema });
  const [showEmojis, setShowEmojis] = useState(false);

  const set = (k, v) => setLocal(l => ({ ...l, [k]: v }));

  const aplicar = () => {
    salvarTema(local);
    mostrarToast('✨ Tema aplicado!');
  };

  const resetar = () => {
    setLocal({ ...TEMA_PADRAO });
    resetarTema();
    mostrarToast('Tema restaurado ao padrão');
  };

  const aplicarPaleta = (p) => {
    const novo = { ...local, ...p };
    setLocal(novo);
    salvarTema(novo);
    mostrarToast(`🎨 Paleta "${p.nome}" aplicada!`);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Personalização</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: '2px' }}>
            Ajuste as cores e o visual da sua loja
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={resetar}>Restaurar</button>
          <button className="btn-primary"   onClick={aplicar}>Salvar</button>
        </div>
      </header>

      {/* Preview em tempo real */}
      <div className="card preview-card" style={{
        background:    local.bg,
        border:        `2px solid ${local.accent}`,
        marginBottom:  '1.5rem',
      }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: local.accent, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '10px' }}>
          Pré-visualização
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.75rem' }}>{local.emoji}</span>
          <span style={{ fontFamily: `'${local.fonteTitulo}', serif`, fontSize: '1.3rem', fontWeight: 700, color: local.text }}>
            {local.nomeLoja || 'Loja da Fran'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ background: local.accent,  color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
            Botão principal
          </div>
          <div style={{ background: local.surface, color: local.text, padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500, border: '1px solid #E7E5E4' }}>
            Botão secundário
          </div>
          <div style={{ background: local.accent2, color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
            Destaque
          </div>
        </div>
        <div style={{ marginTop: '12px', background: local.surface, borderRadius: '10px', padding: '10px 14px', border: '1px solid #E7E5E4' }}>
          <p style={{ fontSize: '0.72rem', color: local.text, opacity: .5, marginBottom: '2px' }}>Receita do mês</p>
          <p style={{ fontFamily: `'${local.fonteTitulo}', serif`, fontSize: '1.4rem', fontWeight: 700, color: local.accent }}>R$ 4.280</p>
        </div>
      </div>

      {/* Paletas prontas */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="card-title">🎨 Paletas prontas</h2>
        <div className="paleta-grid">
          {PALETAS.map(p => (
            <button key={p.nome} className="paleta-btn" onClick={() => aplicarPaleta(p)}
              title={p.nome}
              style={{ background: p.surface, border: `2px solid ${tema.accent === p.accent ? p.accent : '#E7E5E4'}` }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: p.accent }}/>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: p.accent2 }}/>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: p.bg, border: '1px solid #eee' }}/>
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: p.text, whiteSpace: 'nowrap' }}>{p.nome}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nome e emoji da loja */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="card-title">🏷️ Identidade da loja</h2>

        <label className="field-label">Nome da loja</label>
        <input className="field-input" placeholder="Loja da Fran"
          value={local.nomeLoja}
          onChange={e => set('nomeLoja', e.target.value)}/>

        <label className="field-label" style={{ marginTop: '0.875rem' }}>Ícone / Emoji</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="emoji-preview" onClick={() => setShowEmojis(!showEmojis)}>
            {local.emoji}
          </button>
          <span style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Clique para trocar</span>
        </div>
        {showEmojis && (
          <div className="emoji-picker">
            {EMOJIS.map(e => (
              <button key={e} className="emoji-opt" onClick={() => { set('emoji', e); setShowEmojis(false); }}>
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cores manuais */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="card-title">🖌️ Cores personalizadas</h2>
        <div className="cor-grid">
          {[
            { key: 'accent',  label: 'Cor principal',  desc: 'Botões, links e destaques' },
            { key: 'accent2', label: 'Cor secundária',  desc: 'Saldo positivo e badges' },
            { key: 'bg',      label: 'Fundo da página', desc: 'Cor de fundo geral' },
            { key: 'surface', label: 'Cards',           desc: 'Cor dos cartões e painel' },
            { key: 'text',    label: 'Texto principal', desc: 'Cor do texto' },
          ].map(c => (
            <div key={c.key} className="cor-row">
              <input type="color" className="color-picker" value={local[c.key]}
                onChange={e => set(c.key, e.target.value)}/>
              <div className="cor-info">
                <span className="cor-label">{c.label}</span>
                <span className="cor-desc">{c.desc}</span>
              </div>
              <span className="cor-hex">{local[c.key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fonte do título */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="card-title">🔤 Fonte dos títulos</h2>
        <div className="fonte-grid">
          {FONTES.map(f => (
            <button key={f.id}
              className={`fonte-btn ${local.fonteTitulo === f.id ? 'fonte-btn--active' : ''}`}
              onClick={() => set('fonteTitulo', f.id)}>
              <span style={{ fontFamily: `'${f.id}', serif`, fontSize: '1.1rem', fontWeight: 700 }}>Aa</span>
              <span style={{ fontSize: '0.68rem', marginTop: '2px' }}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Botão de salvar fixo no final */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button className="btn-secondary" onClick={resetar}>↩ Restaurar padrão</button>
        <button className="btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={aplicar}>
          ✅ Salvar tema
        </button>
      </div>
    </div>
  );
}
