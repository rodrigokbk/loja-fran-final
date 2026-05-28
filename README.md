# 🛍️ Loja da Fran — App de Estoque & Financeiro

App web completo para controle de estoque, financeiro e mostruário de loja de roupas.
Funciona em qualquer navegador: celular, tablet ou computador.

---

## 📁 Estrutura do projeto

```
loja-fran/
├── api-fran/          ← Backend (Node.js + Express)
└── frontend-fran/     ← Frontend (React + Vite)
```

---

## 🚀 Como rodar localmente

### 1. Banco de dados (Supabase — gratuito)

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Vá em **SQL Editor** e cole o conteúdo de `estoque_loja_roupas.sql`
4. Clique em **Run** — todas as tabelas serão criadas
5. Em **Settings → API**, copie:
   - `Project URL`
   - `anon public key`
6. Em **Storage**, crie um bucket chamado `fotos-produtos` e deixe como público

---

### 2. Backend (API)

```bash
cd api-fran
npm install
cp .env.example .env
```

Preencha o `.env`:
```
DATABASE_URL=postgresql://postgres:[senha]@db.[seu-projeto].supabase.co:5432/postgres
SUPABASE_URL=https://[seu-projeto].supabase.co
SUPABASE_KEY=[sua-anon-key]
SUPABASE_BUCKET=fotos-produtos
PORT=3000
```

```bash
npm run dev   # inicia em http://localhost:3000
```

Teste: http://localhost:3000/health

---

### 3. Frontend

```bash
cd frontend-fran
npm install
```

Crie `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev   # inicia em http://localhost:5173
```

---

## ☁️ Deploy na nuvem (gratuito)

### Backend → Railway

1. Acesse https://railway.app e faça login com GitHub
2. Clique em **New Project → Deploy from GitHub repo**
3. Selecione a pasta `api-fran`
4. Em **Variables**, adicione as mesmas variáveis do `.env`
5. Railway gera uma URL pública automaticamente (ex: `api-fran.up.railway.app`)

### Frontend → Vercel

1. Acesse https://vercel.com e faça login com GitHub
2. Clique em **Add New Project**
3. Selecione a pasta `frontend-fran`
4. Em **Environment Variables**, adicione:
   ```
   VITE_API_URL=https://api-fran.up.railway.app/api
   ```
5. Clique em **Deploy** — Vercel gera uma URL pública em segundos

---

## 🌐 Vitrine pública para clientes

Após o deploy, a Fran pode compartilhar o link da vitrine com clientes:

```
https://loja-fran.vercel.app/#/vitrine/inverno-2025
```

O botão "Encomendar" abre o WhatsApp direto com a mensagem preenchida.

---

## 📱 Usar como app no celular (PWA)

**No iPhone (Safari):**
1. Abra o link da loja no Safari
2. Toque no botão de compartilhar (□↑)
3. Toque em **"Adicionar à Tela de Início"**
4. Pronto — aparece como ícone na tela, igual a um app!

**No Android (Chrome):**
1. Abra o link no Chrome
2. Toque nos 3 pontos → **"Adicionar à tela inicial"**

---

## 📋 Resumo das telas

| Tela        | O que faz |
|-------------|-----------|
| 🏠 Dashboard  | Visão geral: receita, lucro, alertas e gráfico |
| 📦 Estoque    | Grid de produtos com fotos, cores e SKUs |
| 💰 Financeiro | Saldo, breakdown de gastos, histórico |
| ＋ Lançar     | Entrada/saída de estoque ou novo gasto |
| 🗂 Mostruário | Coleções temáticas com link público |
| 🌐 Vitrine    | Catálogo público com botão de WhatsApp |

---

## 💰 Custo mensal estimado

| Serviço   | Plano     | Custo |
|-----------|-----------|-------|
| Supabase  | Free      | R$ 0  |
| Railway   | Hobby     | ~R$ 15 (ou grátis com créditos) |
| Vercel    | Free      | R$ 0  |
| **Total** |           | **~R$ 0 a R$ 15/mês** |

---

Desenvolvido com ❤️ para a Fran
