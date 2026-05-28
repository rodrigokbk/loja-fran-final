import { createContext, useContext, useState, useEffect } from 'react';

const ThemeCtx = createContext(null);

const TEMA_PADRAO = {
  accent:     '#E85D75',
  accent2:    '#4ECDC4',
  text:       '#1C1917',
  bg:         '#FAF9F7',
  surface:    '#FFFFFF',
  nomeLoja:   'Loja da Fran',
  emoji:      '🛍️',
  fonteTitulo: 'Fraunces',
};

const FONTES = [
  { id: 'Fraunces',      label: 'Fraunces',      url: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@300;600;700&display=swap' },
  { id: 'Playfair Display', label: 'Playfair',   url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
  { id: 'DM Serif Display', label: 'DM Serif',   url: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap' },
  { id: 'Cormorant Garamond', label: 'Cormorant',url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap' },
  { id: 'Space Grotesk',  label: 'Space Grotesk',url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap' },
  { id: 'Syne',           label: 'Syne',          url: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700&display=swap' },
];

export { FONTES, TEMA_PADRAO };

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    try {
      const salvo = localStorage.getItem('fran_tema');
      return salvo ? { ...TEMA_PADRAO, ...JSON.parse(salvo) } : TEMA_PADRAO;
    } catch { return TEMA_PADRAO; }
  });

  // Aplica as variáveis CSS no :root sempre que o tema mudar
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--accent',  tema.accent);
    r.setProperty('--accent2', tema.accent2);
    r.setProperty('--text',    tema.text);
    r.setProperty('--bg',      tema.bg);
    r.setProperty('--surface', tema.surface);
    r.setProperty('--fonte-titulo', `'${tema.fonteTitulo}', serif`);

    // Carrega a fonte dinamicamente se necessário
    const fonte = FONTES.find(f => f.id === tema.fonteTitulo);
    if (fonte) {
      const id = `font-${fonte.id.replace(/\s/g, '-')}`;
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id   = id;
        link.rel  = 'stylesheet';
        link.href = fonte.url;
        document.head.appendChild(link);
      }
    }
  }, [tema]);

  const salvarTema = (novoTema) => {
    const merged = { ...tema, ...novoTema };
    setTema(merged);
    localStorage.setItem('fran_tema', JSON.stringify(merged));
  };

  const resetarTema = () => {
    setTema(TEMA_PADRAO);
    localStorage.removeItem('fran_tema');
  };

  return (
    <ThemeCtx.Provider value={{ tema, salvarTema, resetarTema, FONTES }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
