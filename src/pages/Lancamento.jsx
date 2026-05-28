import { useEffect, useState } from 'react';
import { getProdutos, movimentarEstoque, registrarGasto, getCategorias } from '../services/api';
import { useApp } from '../context/AppContext';

const TIPOS = [
  { key: 'entrada', label: '📥 Entrada de estoque',  desc: 'Chegou mercadoria nova' },
  { key: 'saida',   label: '📤 Saída de estoque',    desc: 'Ajuste manual ou perda' },
  { key: 'gasto',   label: '💸 Registrar gasto',     desc: 'Frete, embalagem, etc.' },
];

export default function Lancamento() {
  const { mostrarToast } = useApp();
  const [tipo,       setTipo]       = useState('entrada');
  const [produtos,   setProdutos]   = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [skus,       setSkus]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [sucesso,    setSucesso]    = useState(false);

  const [form, setForm] = useState({
    produto_id: '', sku_id: '', quantidade: '',
    categoria_gasto_id: '', descricao: '', valor: '',
    data: new Date().toISOString().slice(0, 10), motivo: '',
  });

  useEffect(() => {
    Promise.all([getProdutos(), getCategorias()])
      .then(([p, c]) => { setProdutos(p); setCategorias(c); });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleProduto = (produtoId) => {
    set('produto_id', produtoId);
    set('sku_id', '');
    const prod = produtos.find(p => p.id === produtoId);
    setSkus(prod?.skus || []);
  };

  const handleSalvar = async () => {
    setLoading(true);
    try {
      if (tipo === 'gasto') {
        if (!form.categoria_gasto_id || !form.descricao || !form.valor)
          return mostrarToast('Preencha categoria, descrição e valor', 'erro');
        await registrarGasto({
          categoria_gasto_id: form.categoria_gasto_id,
          descricao: form.descricao,
          valor: parseFloat(form.valor),
          data: form.data,
          sku_id: form.sku_id || null,
        });
      } else {
        if (!form.sku_id || !form.quantidade)
          return mostrarToast('Selecione o produto/SKU e a quantidade', 'erro');
        const res = await movimentarEstoque({
          sku_id: form.sku_id,
          tipo,
          quantidade: parseInt(form.quantidade),
          motivo: form.motivo || null,
        });
        if (res.alerta_estoque) mostrarToast('⚠️ Estoque ficou abaixo do mínimo!', 'aviso');
      }
      setSucesso(true);
      mostrarToast('Lançamento salvo!');
      setForm({
        produto_id: '', sku_id: '', quantidade: '',
        categoria_gasto_id: '', descricao: '', valor: '',
        data: new Date().toISOString().slice(0, 10), motivo: '',
      });
      setSkus([]);
      setTimeout(() => setSucesso(false), 2500);
    } catch (err) {
      mostrarToast(err.message, 'erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Novo lançamento</h1>
      </header>

      {/* Seletor de tipo */}
      <div className="tipo-grid">
        {TIPOS.map(t => (
          <button key={t.key}
            className={`tipo-card ${tipo === t.key ? 'tipo-card--active' : ''}`}
            onClick={() => setTipo(t.key)}>
            <span className="tipo-label">{t.label}</span>
            <span className="tipo-desc">{t.desc}</span>
          </button>
        ))}
      </div>

      <div className="card card--form" style={{ marginTop: '1.25rem' }}>

        {/* ── Campos de estoque (entrada/saída) ── */}
        {tipo !== 'gasto' && (<>
          <label className="field-label">Produto</label>
          <select className="field-input" value={form.produto_id}
            onChange={e => handleProduto(e.target.value)}>
            <option value="">Selecione o produto...</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>

          {skus.length > 0 && (<>
            <label className="field-label">Variação (tamanho / cor)</label>
            <select className="field-input" value={form.sku_id}
              onChange={e => set('sku_id', e.target.value)}>
              <option value="">Selecione...</option>
              {skus.map(s => (
                <option key={s.id} value={s.id}>
                  {s.tamanho} · {s.cor} — {s.quantidade} em estoque
                </option>
              ))}
            </select>
          </>)}

          <label className="field-label">Quantidade</label>
          <input className="field-input" type="number" min="1" placeholder="0"
            value={form.quantidade} onChange={e => set('quantidade', e.target.value)}/>

          <label className="field-label">Motivo / observação</label>
          <input className="field-input" placeholder="Ex: reposição semanal, ajuste de inventário..."
            value={form.motivo} onChange={e => set('motivo', e.target.value)}/>
        </>)}

        {/* ── Campos de gasto ── */}
        {tipo === 'gasto' && (<>
          <label className="field-label">Categoria do gasto</label>
          <select className="field-input" value={form.categoria_gasto_id}
            onChange={e => set('categoria_gasto_id', e.target.value)}>
            <option value="">Selecione...</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>

          <label className="field-label">Descrição</label>
          <input className="field-input" placeholder="Ex: Frete Correios, Embalagens kraft..."
            value={form.descricao} onChange={e => set('descricao', e.target.value)}/>

          <label className="field-label">Valor (R$)</label>
          <input className="field-input" type="number" step="0.01" min="0" placeholder="0,00"
            value={form.valor} onChange={e => set('valor', e.target.value)}/>

          <label className="field-label">Data</label>
          <input className="field-input" type="date"
            value={form.data} onChange={e => set('data', e.target.value)}/>

          <label className="field-label">Produto relacionado (opcional)</label>
          <select className="field-input" value={form.produto_id}
            onChange={e => handleProduto(e.target.value)}>
            <option value="">Nenhum</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          {skus.length > 0 && (
            <select className="field-input" style={{ marginTop: 6 }} value={form.sku_id}
              onChange={e => set('sku_id', e.target.value)}>
              <option value="">Todas as variações</option>
              {skus.map(s => <option key={s.id} value={s.id}>{s.tamanho} · {s.cor}</option>)}
            </select>
          )}
        </>)}

        <button className="btn-primary" style={{ width: '100%', marginTop: '1.25rem', padding: '0.8rem', fontSize: '0.95rem' }}
          onClick={handleSalvar} disabled={loading}>
          {loading ? 'Salvando...' : sucesso ? '✅ Salvo!' : '💾 Salvar lançamento'}
        </button>
      </div>
    </div>
  );
}
