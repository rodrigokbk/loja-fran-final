import { getToken } from '../context/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function req(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    ...opts,
  });

  if (res.status === 401) {
    // Token expirado — limpa sessão e recarrega
    localStorage.removeItem('fran_token');
    localStorage.removeItem('fran_nome');
    window.location.reload();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ erro: res.statusText }));
    throw new Error(err.erro || 'Erro na requisição');
  }
  return res.json();
}

// Produtos
export const getProdutos   = (params = '') => req(`/produtos${params}`);
export const getProduto    = (id)          => req(`/produtos/${id}`);
export const criarProduto  = (body)        => req('/produtos', { method: 'POST', body: JSON.stringify(body) });
export const editarProduto = (id, body)    => req(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const uploadFoto = (produtoId, file, capa = false, skuId = null) => {
  const token = getToken();
  const fd = new FormData();
  fd.append('foto', file);
  fd.append('capa', capa);
  if (skuId) fd.append('sku_id', skuId);
  return fetch(`${BASE}/produtos/${produtoId}/fotos`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  }).then(r => r.json());
};

// Estoque
export const getAlertas        = ()      => req('/estoque/alertas');
export const getHistorico      = (skuId) => req(`/estoque/${skuId}/historico`);
export const movimentarEstoque = (body)  => req('/estoque/movimentacao', { method: 'POST', body: JSON.stringify(body) });

// Financeiro
export const getResumoMes   = ()       => req('/financeiro/resumo/mes-atual');
export const getResumo      = (m = 6)  => req(`/financeiro/resumo?meses=${m}`);
export const getGastos      = (q = '') => req(`/financeiro/gastos${q}`);
export const registrarGasto = (body)   => req('/financeiro/gastos', { method: 'POST', body: JSON.stringify(body) });
export const getCategorias  = ()       => req('/financeiro/categorias');

// Mostruário
export const getMostruarios       = ()           => req('/mostruarios');
export const getVitrine           = (slug)       => req(`/mostruarios/${slug}/vitrine`);
export const criarMostruario      = (body)       => req('/mostruarios', { method: 'POST', body: JSON.stringify(body) });
export const addProdutoMostruario = (id, body)   => req(`/mostruarios/${id}/produtos`, { method: 'POST', body: JSON.stringify(body) });
export const remProdutoMostruario = (id, pid)    => req(`/mostruarios/${id}/produtos/${pid}`, { method: 'DELETE' });
