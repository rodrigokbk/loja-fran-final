import { useEffect, useState } from 'react';
import { getResumoMes, getAlertas } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { navegar } = useApp();
  const [resumo,  setResumo]  = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getResumoMes(), getAlertas()])
      .then(([r, a]) => { setResumo(r); setAlertas(a.slice(0, 4)); })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) return <div className="loading">Carregando...</div>;

  const barras = [40, 65, 35, 80, 90, 55, 70];
  const dias   = ['S','T','Q','Q','S','S','D'];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="greeting-sub">Bom dia, Fran 👋</p>
          <h1 className="page-title">Visão geral</h1>
        </div>
      </header>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi kpi--accent">
          <span className="kpi-label">Receita do mês</span>
          <span className="kpi-val">{fmt(resumo?.receita ?? 0)}</span>
          <span className="kpi-sub">↑ 12% vs anterior</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Despesas</span>
          <span className="kpi-val">{fmt(resumo?.despesas ?? 0)}</span>
          <span className="kpi-sub kpi-sub--ok">Lucro: {fmt(resumo?.lucro ?? 0)}</span>
        </div>
        <div className="kpi" onClick={() => navegar('financeiro')} style={{cursor:'pointer'}}>
          <span className="kpi-label">Categorias de gasto</span>
          <span className="kpi-val">{resumo?.breakdown_gastos?.length ?? 0}</span>
          <span className="kpi-sub">Ver financeiro →</span>
        </div>
        <div className="kpi kpi--warn" onClick={() => navegar('estoque')} style={{cursor:'pointer'}}>
          <span className="kpi-label">Alertas de estoque</span>
          <span className="kpi-val">{alertas.length}</span>
          <span className="kpi-sub">Ver estoque →</span>
        </div>
      </div>

      {/* Gráfico de barras simples */}
      <div className="card" style={{marginBottom:'1.25rem'}}>
        <h2 className="card-title">Vendas — últimos 7 dias</h2>
        <div className="bar-chart">
          {barras.map((h, i) => (
            <div key={i} className="bar-col">
              <div className="bar-fill" style={{height: `${h}%`}} data-last={i===6||undefined}/>
              <span className="bar-day">{dias[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">⚠️ Estoque baixo</h2>
            <button className="link-btn" onClick={() => navegar('estoque')}>Ver todos</button>
          </div>
          <div className="alert-list">
            {alertas.map(a => (
              <div key={a.id} className="alert-row">
                <div className="alert-dot"/>
                <div className="alert-info">
                  <span className="alert-name">{a.produto}</span>
                  <span className="alert-detail">{a.tamanho} · {a.cor} · {a.qtd_atual} unid.</span>
                </div>
                <span className="alert-badge">Faltam {a.faltam}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown financeiro */}
      {resumo?.breakdown_gastos?.length > 0 && (
        <div className="card" style={{marginTop:'1.25rem'}}>
          <h2 className="card-title">Gastos por categoria</h2>
          {resumo.breakdown_gastos.map((c, i) => {
            const pct = Math.round((c.total / resumo.despesas) * 100);
            const cores = ['#E85D75','#4ECDC4','#F59E0B','#8B5CF6','#3B82F6'];
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
    </div>
  );
}
