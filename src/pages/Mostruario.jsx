import { useEffect, useState } from 'react';
import { getMostruarios, criarMostruario, getVitrine } from '../services/api';
import { useApp } from '../context/AppContext';

const GRADIENTES = [
  'linear-gradient(135deg,#2D1B69,#6B21A8)',
  'linear-gradient(135deg,#14532D,#16A34A)',
  'linear-gradient(135deg,#7C2D12,#EA580C)',
  'linear-gradient(135deg,#1E3A5F,#3B82F6)',
  'linear-gradient(135deg,#4A1D4A,#E85D75)',
];

export default function Mostruario() {
  const { mostrarToast } = useApp();
  const [lista,    setLista]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vitrine,  setVitrine]  = useState(null); // mostruário aberto na vitrine
  const [form, setForm] = useState({ nome:'', slug:'', descricao:'' });

  const carregar = () => {
    getMostruarios().then(setLista).finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleCriar = async () => {
    if (!form.nome || !form.slug) return mostrarToast('Nome e slug são obrigatórios', 'erro');
    try {
      await criarMostruario(form);
      mostrarToast('Mostruário criado!');
      setShowForm(false);
      setForm({ nome:'', slug:'', descricao:'' });
      carregar();
    } catch (err) {
      mostrarToast(err.message, 'erro');
    }
  };

  const abrirVitrine = async (slug) => {
    try {
      const data = await getVitrine(slug);
      setVitrine(data);
    } catch (err) {
      mostrarToast(err.message, 'erro');
    }
  };

  const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (vitrine) return (
    <div className="page">
      <button className="back-btn" onClick={() => setVitrine(null)}>← Voltar</button>
      <div className="vitrine-header">
        <h1>🛍️ Loja da Fran</h1>
        <p>{vitrine.mostruario.nome}</p>
        <div className="vitrine-link">
          <span>{window.location.origin}/vitrine/{vitrine.mostruario.slug}</span>
          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/vitrine/${vitrine.mostruario.slug}`); mostrarToast('Link copiado!'); }}>
            🔗 Copiar
          </button>
        </div>
      </div>
      <div className="produto-grid" style={{marginTop:'1rem'}}>
        {vitrine.produtos.map(p => (
          <div key={p.id} className="pcard">
            <div className="pcard-img">
              {p.foto_capa ? <img src={p.foto_capa} alt={p.nome}/> : <span className="pcard-emoji">👗</span>}
            </div>
            <div className="pcard-body">
              <p className="pcard-nome">{p.nome}</p>
              <p className="pcard-preco">{fmt(p.preco_base)}</p>
              <button className="btn-primary" style={{width:'100%',marginTop:'0.5rem',fontSize:'0.75rem',padding:'0.4rem'}}>
                Encomendar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Mostruários</h1>
          <p style={{fontSize:'0.8rem',color:'var(--text2)',marginTop:'2px'}}>Crie coleções e compartilhe com clientes</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Novo</button>
      </header>

      {showForm && (
        <div className="card card--form">
          <h3 className="card-title">Nova coleção</h3>
          <label className="field-label">Nome</label>
          <input className="field-input" placeholder="Ex: Coleção Inverno 2025"
            value={form.nome} onChange={e => setForm(f => ({...f, nome:e.target.value}))}/>
          <label className="field-label">Slug (URL)</label>
          <input className="field-input" placeholder="ex: inverno-2025"
            value={form.slug} onChange={e => setForm(f => ({...f, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')}))}/>
          <label className="field-label">Descrição (opcional)</label>
          <input className="field-input" placeholder="Uma breve descrição..."
            value={form.descricao} onChange={e => setForm(f => ({...f, descricao:e.target.value}))}/>
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleCriar}>Criar</button>
          </div>
        </div>
      )}

      {loading ? <div className="loading">Carregando...</div> : (
        <div className="mos-list">
          {lista.map((m, i) => (
            <div key={m.id} className="mos-card">
              <div className="mos-banner" style={{background: GRADIENTES[i % GRADIENTES.length]}}>
                <span className="mos-banner-emoji">👗 👕 🧣</span>
                <span className="mos-badge">ATIVO</span>
              </div>
              <div className="mos-body">
                <h3 className="mos-nome">{m.nome}</h3>
                <p className="mos-meta">{m.total_produtos} produtos · criado em {new Date(m.criado_em).toLocaleDateString('pt-BR')}</p>
                <div className="mos-actions">
                  <button className="btn-primary" onClick={() => abrirVitrine(m.slug)}>🌐 Ver vitrine</button>
                  <button className="btn-secondary">✏️ Editar</button>
                </div>
              </div>
            </div>
          ))}

          {/* Card de nova coleção */}
          <div className="mos-card mos-card--new" onClick={() => setShowForm(true)}>
            <span style={{fontSize:'2rem'}}>＋</span>
            <span style={{fontSize:'0.9rem',fontWeight:600,marginTop:'0.5rem'}}>Nova coleção</span>
            <span style={{fontSize:'0.75rem',color:'var(--text2)'}}>Adicione produtos e gere link</span>
          </div>
        </div>
      )}
    </div>
  );
}
