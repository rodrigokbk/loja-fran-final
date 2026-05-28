import { useEffect, useState } from 'react';
import { getVitrine } from '../services/api';

// Rota pública: /vitrine/:slug
// Em produção, configure seu roteador (React Router ou similar) para apontar aqui.
// Por simplicidade, lemos o slug da hash da URL: /#/vitrine/inverno-2025
export default function Vitrine() {
  const slug = window.location.hash.split('/vitrine/')[1] || '';
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro,    setErro]    = useState(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!slug) { setErro('Mostruário não encontrado.'); setLoading(false); return; }
    getVitrine(slug)
      .then(setData)
      .catch(() => setErro('Este mostruário não existe ou foi desativado.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const copiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', color:'#78716C' }}>
      Carregando vitrine...
    </div>
  );

  if (erro) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', color:'#78716C', gap:'0.5rem' }}>
      <span style={{fontSize:'3rem'}}>🛍️</span>
      <p>{erro}</p>
    </div>
  );

  const { mostruario, produtos } = data;

  return (
    <div style={{ fontFamily:'DM Sans,sans-serif', minHeight:'100vh', background:'#FAF9F7', paddingBottom:'3rem' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#E85D75,#C0392B)', padding:'2rem 1.5rem 1.5rem', color:'#fff' }}>
        <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'1.75rem', fontWeight:700 }}>🛍️ Loja da Fran</h1>
        <p style={{ opacity:.8, fontSize:'0.9rem', marginTop:'4px' }}>{mostruario.nome}</p>
        {mostruario.descricao && <p style={{ opacity:.65, fontSize:'0.82rem', marginTop:'4px' }}>{mostruario.descricao}</p>}

        {/* Link compartilhável */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,.2)', borderRadius:'10px', padding:'8px 12px', marginTop:'14px' }}>
          <span style={{ fontFamily:'DM Mono,monospace', fontSize:'0.75rem', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {window.location.href}
          </span>
          <button onClick={copiarLink}
            style={{ background:'#fff', color:'#E85D75', border:'none', borderRadius:'7px', padding:'5px 10px', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
            {copiado ? '✅ Copiado!' : '🔗 Copiar'}
          </button>
        </div>
      </div>

      {/* Grid de produtos */}
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'1.5rem 1rem' }}>
        <p style={{ fontSize:'0.8rem', color:'#78716C', marginBottom:'1rem' }}>
          {produtos.length} {produtos.length === 1 ? 'peça disponível' : 'peças disponíveis'}
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'0.875rem' }}>
          {produtos.map(p => (
            <div key={p.id} style={{ background:'#fff', border:'1px solid #E7E5E4', borderRadius:'14px', overflow:'hidden' }}>

              {/* Foto ou emoji */}
              <div style={{ width:'100%', aspectRatio:'1', background:'#F5F4F2', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                {p.foto_capa
                  ? <img src={p.foto_capa} alt={p.nome} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  : <span style={{ fontSize:'3.5rem' }}>👗</span>
                }
              </div>

              <div style={{ padding:'0.65rem 0.75rem 0.875rem' }}>
                <p style={{ fontWeight:600, fontSize:'0.85rem', color:'#1C1917' }}>{p.nome}</p>
                {p.marca && <p style={{ fontSize:'0.72rem', color:'#78716C', marginTop:'1px' }}>{p.marca}</p>}
                <p style={{ fontFamily:'DM Mono,monospace', fontWeight:700, fontSize:'0.9rem', color:'#E85D75', margin:'4px 0 8px' }}>{fmt(p.preco_base)}</p>

                {/* Variações disponíveis */}
                {p.skus?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'8px' }}>
                    {p.skus.filter(s => s.disponivel).slice(0, 6).map((s, i) => (
                      <span key={i} style={{ fontSize:'0.68rem', padding:'2px 7px', borderRadius:'20px', background:'#F0FDF4', color:'#16A34A', border:'1px solid #BBF7D0', fontWeight:500 }}>
                        {s.tamanho}
                      </span>
                    ))}
                    {p.skus.filter(s => !s.disponivel).slice(0, 3).map((s, i) => (
                      <span key={i} style={{ fontSize:'0.68rem', padding:'2px 7px', borderRadius:'20px', background:'#F4F4F5', color:'#A1A1AA', border:'1px solid #E4E4E7', fontWeight:500, textDecoration:'line-through' }}>
                        {s.tamanho}
                      </span>
                    ))}
                  </div>
                )}

                <a href={`https://wa.me/?text=Olá! Tenho interesse na peça: ${p.nome} - ${fmt(p.preco_base)}`}
                  target="_blank" rel="noreferrer"
                  style={{ display:'block', width:'100%', padding:'0.45rem', borderRadius:'8px', background:'#25D366', color:'#fff', textAlign:'center', fontSize:'0.75rem', fontWeight:700, textDecoration:'none', marginTop:'auto' }}>
                  💬 Encomendar no WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {produtos.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem', color:'#78716C' }}>
            <p style={{ fontSize:'2rem' }}>🪣</p>
            <p style={{ marginTop:'0.5rem' }}>Nenhum produto nesta coleção ainda.</p>
          </div>
        )}
      </div>

      <p style={{ textAlign:'center', fontSize:'0.72rem', color:'#A8A29E', marginTop:'2rem' }}>
        Desenvolvido com ❤️ para a Loja da Fran
      </p>
    </div>
  );
}
