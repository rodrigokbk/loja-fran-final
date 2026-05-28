import { useEffect, useState } from 'react';
import { getProdutos, movimentarEstoque, uploadFoto } from '../services/api';
import { useApp } from '../context/AppContext';

const EMOJIS = {
  'Camisetas': '👕',
  'Calças': '👖',
  'Vestidos': '👗',
  'Acessórios': '🧣',
  'Sapatos': '👞',
  'Botas': '🥾',
  'Sandálias': '👡',
  'Tênis': '👟'
};

export default function Estoque() {
  const { mostrarToast, abrirModal } = useApp();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtro,  setFiltro]    = useState('Todos');
  const [busca,   setBusca]     = useState('');
  const [detalhe, setDetalhe]   = useState(null); // produto aberto

  const carregar = (alerta = false) => {
    setLoading(true);
    getProdutos(alerta ? '?alerta=true' : '')
      .then(setProdutos)
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const filtrados = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === 'Todos' || p.categoria === filtro
      || (filtro === 'Alerta' && p.skus?.some(s => s.alerta));
    return matchBusca && matchFiltro;
  });

  const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleUploadFoto = async (produtoId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadFoto(produtoId, file, true);
      mostrarToast('Foto atualizada!');
      carregar();
    } catch (err) {
      mostrarToast(err.message, 'erro');
    }
  };

  const handleMovimentacao = async (skuId, tipo) => {
    const qtd = parseInt(window.prompt(`Quantidade para ${tipo}:`), 10);
    if (!qtd || qtd <= 0) return;
    try {
      const res = await movimentarEstoque({ sku_id: skuId, tipo, quantidade: qtd });
      mostrarToast(`${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada!`);
      if (res.alerta_estoque) mostrarToast('⚠️ Estoque abaixo do mínimo!', 'aviso');
      carregar();
    } catch (err) {
      mostrarToast(err.message, 'erro');
    }
  };

  const categorias = ['Todos', 'Alerta', 'Camisetas', 'Calças', 'Vestidos', 'Acessórios', 'Sapatos', 'Botas', 'Sandálias', 'Tênis'];

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Estoque</h1>
        <button className="btn-primary" onClick={() => abrirModal('novoProduto')}>+ Novo</button>
      </header>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar produto..."/>
      </div>

      <div className="chips-row">
        {categorias.map(c => (
          <button key={c} className={`chip ${filtro===c?'chip--active':''}`}
            onClick={() => { setFiltro(c); carregar(c==='Alerta'); }}>
            {c === 'Alerta' ? '⚠️ Alerta' : c}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Carregando...</div> : (
        detalhe ? (
          /* ── Detalhe do produto ── */
          <div className="detalhe">
            <button className="back-btn" onClick={() => setDetalhe(null)}>← Voltar</button>
            <div className="detalhe-foto-wrap">
              {detalhe.foto_capa
                ? <img src={detalhe.foto_capa} alt={detalhe.nome} className="detalhe-foto"/>
                : <div className="detalhe-foto detalhe-foto--placeholder">{EMOJIS[detalhe.categoria]||'📦'}</div>
              }
              <label className="foto-upload-btn">
                📷 Trocar foto
                <input type="file" accept="image/*" hidden onChange={e => handleUploadFoto(detalhe.id, e)}/>
              </label>
            </div>
            <h2 className="detalhe-nome">{detalhe.nome}</h2>
            <p className="detalhe-meta">{detalhe.marca} · {detalhe.categoria}</p>
            <p className="detalhe-preco">{fmt(detalhe.preco_base)}</p>
            <h3 className="section-label">Variações (SKUs)</h3>
            <div className="sku-table">
              {detalhe.skus?.map(s => (
                <div key={s.id} className={`sku-row ${s.alerta ? 'sku-row--alerta' : ''}`}>
                  <div className="sku-info">
                    <span className={`sku-dot ${s.quantidade===0?'dot--out':s.alerta?'dot--low':'dot--ok'}`}/>
                    <span className="sku-label">{s.tamanho} · {s.cor}</span>
                  </div>
                  <span className="sku-qty">{s.quantidade} unid.</span>
                  <div className="sku-actions">
                    <button className="btn-sm btn-sm--green" onClick={() => handleMovimentacao(s.id, 'entrada')}>+ Entrada</button>
                    <button className="btn-sm btn-sm--red"   onClick={() => handleMovimentacao(s.id, 'saida')}>− Saída</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Grid de produtos ── */
          <div className="produto-grid">
            {filtrados.map(p => {
              const temAlerta = p.skus?.some(s => s.alerta);
              const cores = [...new Set(p.skus?.map(s => s.cor))].slice(0, 5);
              return (
                <div key={p.id} className="pcard" onClick={() => setDetalhe(p)}>
                  <div className="pcard-img">
                    {p.foto_capa
                      ? <img src={p.foto_capa} alt={p.nome}/>
                      : <span className="pcard-emoji">{EMOJIS[p.categoria]||'📦'}</span>
                    }
                    <span className={`pcard-badge ${temAlerta?'pcard-badge--warn':'pcard-badge--ok'}`}>
                      {temAlerta ? '⚠️ Baixo' : '✓ OK'}
                    </span>
                  </div>
                  <div className="pcard-body">
                    <p className="pcard-nome">{p.nome}</p>
                    <p className="pcard-preco">{fmt(p.preco_base)}</p>
                    <div className="color-dots">
                      {cores.map((c,i) => (
                        <span key={i} className="color-dot" title={c}
                          style={{background: c==='Branca'?'#fff':c==='Preta'?'#111':c==='Azul'?'#3B5BDB':c==='Rosa'?'#E8A0BF':c==='Bege'?'#D2B48C':c==='Marrom'?'#8B4513':c==='Branco'?'#fff':c==='Preto'?'#111':c==='Cinza'?'#999':'#aaa',
                                  border: c==='Branca' || c==='Branco'?'1.5px solid #ddd':'none'}}/>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
