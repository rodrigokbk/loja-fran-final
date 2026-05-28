import { useEffect, useState } from 'react';
import { getResumoMes, getGastos, registrarGasto, getCategorias } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Financeiro() {
  const { mostrarToast } = useApp();
  const [resumo,     setResumo]     = useState(null);
  const [gastos,     setGastos]     = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [form, setForm] = useState({ categoria_gasto_id:'', descricao:'', valor:'', data:'' });

  const carregar = () => {
    Promise.all([getResumoMes(), getGastos(), getCategorias()])
      .then(([r, g, c]) => { setResumo(r); setGastos(g.slice(0, 20)); setCategorias(c); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleSalvar = async () => {
    if (!form.categoria_gasto_id || !form.descricao || !form.valor) {
      return mostrarToast('Preencha todos os campos', 'erro');
    }
    try {
      await registrarGasto({ ...form, valor: parseFloat(form.valor.replace(',','.')) });
      mostrarToast('Gasto registrado!');
      setShowForm(false);
      setForm({ categoria_gasto_id:'', descricao:'', valor:'', data:'' });
      carregar();
    } catch (err) {
      mostrarToast(err.message, 'erro');
    }
  };

  const cores = ['#E85D75','#4ECDC4','#F59E0B','#8B5CF6','#3B82F6','#10B981'];
  const icones = { 'entrada':'🛍️', 'saida':'📤', 'Compra de mercadoria':'🏭',
                   'Frete e logística':'🚚', 'Embalagens':'📦', 'Marketing':'📱',
                   'Plataforma / site':'🌐', 'Outros':'💼' };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Financeiro</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Gasto</button>
      </header>

      {/* Formulário de gasto */}
      {showForm && (
        <div className="card card--form">
          <h3 className="card-title">Registrar gasto</h3>
          <label className="field-label">Categoria</label>
          <select className="field-input" value={form.categoria_gasto_id}
            onChange={e => setForm(f => ({...f, categoria_gasto_id: e.target.value}))}>
            <option value="">Selecione...</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <label className="field-label">Descrição</label>
          <input className="field-input" placeholder="Ex: Frete Correios"
            value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))}/>
          <label className="field-label">Valor (R$)</label>
          <input className="field-input" placeholder="0,00" type="number" step="0.01"
            value={form.valor} onChange={e => setForm(f => ({...f, valor: e.target.value}))}/>
          <label className="field-label">Data</label>
          <input className="field-input" type="date"
            value={form.data} onChange={e => setForm(f => ({...f, data: e.target.value}))}/>
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSalvar}>Salvar</button>
          </div>
        </div>
      )}

      {/* Card de saldo */}
      <div className="balance-card">
        <p className="balance-label">Lucro estimado — {new Date().toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</p>
        <p className="balance-val">{fmt(resumo?.lucro ?? 0)}</p>
        <div className="balance-row">
          <div>
            <p className="balance-sub-label">Receitas</p>
            <p className="balance-sub-val balance-sub-val--pos">+{fmt(resumo?.receita ?? 0)}</p>
          </div>
          <div>
            <p className="balance-sub-label">Despesas</p>
            <p className="balance-sub-val balance-sub-val--neg">−{fmt(resumo?.despesas ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Breakdown por categoria */}
      {resumo?.breakdown_gastos?.length > 0 && (
        <div className="card">
          <h2 className="card-title">Gastos por categoria</h2>
          {resumo.breakdown_gastos.map((c, i) => {
            const pct = Math.round((c.total / resumo.despesas) * 100);
            return (
              <div key={i} className="cat-row">
                <div className="cat-info">
                  <span className="cat-dot" style={{background: cores[i % cores.length]}}/>
                  <span className="cat-name">{c.categoria}</span>
                  <span className="cat-val">{fmt(c.total)}</span>
                </div>
                <div className="cat-bar-bg">
                  <div className="cat-bar-fill" style={{width:`${pct}%`, background: cores[i % cores.length]}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista de movimentações */}
      <div className="card" style={{marginTop:'1.25rem'}}>
        <h2 className="card-title">Últimas movimentações</h2>
        <div className="mov-list">
          {gastos.map(g => (
            <div key={g.id} className="mov-row">
              <div className="mov-icon">{icones[g.categoria] || '💼'}</div>
              <div className="mov-info">
                <span className="mov-nome">{g.descricao}</span>
                <span className="mov-cat">{g.categoria} · {new Date(g.data).toLocaleDateString('pt-BR')}</span>
              </div>
              <span className="mov-val mov-val--neg">−{fmt(g.valor)}</span>
            </div>
          ))}
          {gastos.length === 0 && <p className="empty-msg">Nenhum gasto registrado este mês.</p>}
        </div>
      </div>
    </div>
  );
}
