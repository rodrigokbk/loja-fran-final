# 🚀 Guia Completo de Deploy — Loja da Fran

## Bem-vinda! 👋

Este é um guia passo a passo para colocar sua loja no ar. Leia com calma e siga cada etapa. **Tempo total: ~1 hora.**

---

## 📌 O que você vai fazer

1. **Testar localmente** — garantir que tudo funciona no seu computador
2. **Criar banco de dados** — Supabase (grátis, seguro, fácil)
3. **Configurar email** — para recuperação de senha
4. **Subir o backend** — API na nuvem (Railway)
5. **Subir o frontend** — app no navegador (Vercel)
6. **Usar no celular** — instalar como app no iPhone/Android

---

## ⚙️ Pré-requisitos

Você precisa ter instalado no computador:
- **Node.js** (baixar em https://nodejs.org/ — versão LTS)
- **Git** (baixar em https://git-scm.com/)
- Um navegador (Chrome, Safari, Firefox, etc)

Contas que você vai criar (todas grátis):
- **GitHub** (https://github.com) — para hospedar o código
- **Supabase** (https://supabase.com) — banco de dados
- **Railway** (https://railway.app) — backend na nuvem
- **Vercel** (https://vercel.com) — frontend na nuvem
- **Gmail** (se não tiver) — para enviar emails de recuperação de senha

---

## ✅ ETAPA 1: Teste Local (10 min)

### 1.1 Abra o terminal (Command Prompt, PowerShell ou Terminal)

**Windows:** pressione `Windows + R` → escreva `cmd` → Enter

**Mac:** Command (⌘) + Espaço → escreva `terminal` → Enter

### 1.2 Entre na pasta do projeto

```bash
cd /caminho/para/loja-fran-completo
```

Se não sabe o caminho, arraste a pasta para a janela do terminal.

### 1.3 Configure o backend

```bash
cd api-fran
npm install
```

Vai demorar 1-2 minutos. Aguarde a barra de progresso terminar.

Agora crie um arquivo chamado `.env` na pasta `api-fran`:

**Conteúdo do `.env` (substituir pelos seus dados):**
```
DATABASE_URL=temporariamente-vazio
SUPABASE_URL=temporariamente-vazio
SUPABASE_KEY=temporariamente-vazio
SUPABASE_BUCKET=fotos-produtos
JWT_SECRET=sua-chave-longa-e-aleatoria-123456789
ADMIN_EMAIL=fran@loja.com
ADMIN_PASSWORD=mudar123
PORT=3000
```

**Importante:** Não compartilhe este arquivo! Ele tem senhas.

Inicie o backend:
```bash
npm run dev
```

Se vir `🚀 API rodando em http://localhost:3000`, tudo OK! ✅

**Deixe este terminal aberto.**

### 1.4 Configure o frontend

Abra **outro terminal** (não feche o primeiro):

```bash
cd frontend-fran
npm install
```

Crie um arquivo `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

Inicie:
```bash
npm run dev
```

Se vir `➜  Local: http://localhost:5173/`, tudo OK! ✅

### 1.5 Teste no navegador

Abra http://localhost:5173 no navegador.

Você vai ver a tela de login. Faça login com:
- **Email:** fran@loja.com
- **Senha:** mudar123

Se conseguiu entrar e viu o painel, **parabéns!** 🎉

Teste rapidamente:
- Clique em "Estoque" → veja se carrega (vai estar vazio)
- Clique em "Personalização" → mude uma cor e salve
- Clique em "Sair"

---

## ✅ ETAPA 2: Criar Banco de Dados (Supabase) — 10 min

O Supabase é onde os seus dados vão ficar guardados de forma segura e gratuita.

### 2.1 Criar conta no Supabase

1. Acesse https://supabase.com
2. Clique em "Sign Up" (canto superior direito)
3. Use sua conta Gmail, GitHub ou email
4. Confirme o email

### 2.2 Criar novo projeto

1. Clique em "New Project"
2. Escolha um nome (ex: `loja-fran`)
3. Coloque uma senha forte (anote em lugar seguro!)
4. Selecione a **região Brasil** (São Paulo)
5. Clique em "Create new project"

Vai demorar 1-2 minutos enquanto o Supabase cria tudo.

### 2.3 Colocar o banco de dados

Quando terminar, você vai estar no painel. No menu à esquerda:

1. Clique em **SQL Editor** (ícone de banco de dados)
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `estoque_loja_roupas.sql`
4. Clique em **Run** (botão azul)

Pronto! As tabelas foram criadas. ✅

### 2.4 Copiar credenciais do banco

Você vai precisar de 2 informações. No painel do Supabase:

1. Clique em **Settings** (⚙️ canto inferior esquerdo)
2. Clique em **API**
3. Copie:
   - `Project URL` (algo como `https://xxxxx.supabase.co`)
   - `anon public` (a chave longa de letras e números)

**Salve estas informações** — você vai usar em breve.

### 2.5 Criar bucket para fotos

Ainda no painel do Supabase:

1. Clique em **Storage** (no menu à esquerda)
2. Clique em **Create a new bucket**
3. Nome: `fotos-produtos`
4. **Importante:** Deixe como **Public** (não marque Private)
5. Clique em **Create bucket**

Pronto! ✅

---

## ✅ ETAPA 3: Configurar Email (5 min)

Você vai usar a conta Gmail para enviar emails de recuperação de senha.

### 3.1 Preparar Gmail

Se não tiver Gmail, crie em https://accounts.google.com/signup

Se já tiver:

1. Abra https://myaccount.google.com/
2. Clique em **Security** (à esquerda)
3. Ative **2-Step Verification** (se não tiver)
   - Siga os passos: telefone, código, pronto
4. Agora procure por **App passwords** (vai aparecer abaixo de 2-Step)
5. Selecione: **Mail** e **Windows Computer** (ou seu sistema)
6. Google vai gerar uma senha de 16 caracteres
7. **Copie** esta senha (você vai usar em breve)

---

## ✅ ETAPA 4: Deploy do Backend (Railway) — 15 min

Railway é a plataforma onde seu backend vai rodar.

### 4.1 Criar conta no Railway

1. Acesse https://railway.app
2. Clique em "Start Now"
3. Escolha **Login with GitHub** (mais fácil)
4. Autorize o Railway acessar sua conta GitHub

### 4.2 Criar novo projeto

1. Clique em **New Project**
2. Selecione **Deploy from GitHub repo**
3. Conecte sua conta GitHub (autorize)
4. Procure pelo repositório `loja-fran` (ou faça upload da pasta `api-fran`)

### 4.3 Adicionar variáveis de ambiente

Railway vai reconhecer que é um projeto Node.js. Agora você precisa adicionar as configurações (variáveis):

Clique em **Add Variable** e adicione:

```
DATABASE_URL = postgresql://postgres:[SENHA_SUPABASE]@db.[seu-projeto].supabase.co:5432/postgres

SUPABASE_URL = [cole aqui a Project URL do Supabase]

SUPABASE_KEY = [cole aqui a chave anon public do Supabase]

SUPABASE_BUCKET = fotos-produtos

JWT_SECRET = gera-uma-chave-longa-aleatoria-aqui-pode-ser-qualquer-coisa

ADMIN_EMAIL = fran@loja.com

ADMIN_PASSWORD = nova-senha-segura-aqui

SMTP_HOST = smtp.gmail.com

SMTP_PORT = 587

SMTP_USER = seu-email@gmail.com

SMTP_PASS = [a senha de 16 chars do Gmail]

FRONTEND_URL = https://loja-fran.vercel.app
```

**Importante:** substitua os valores com parênteses pelos seus dados reais.

### 4.4 Deploy

Clique em **Deploy** (botão azul).

Railway vai baixar, compilar e colocar no ar. Vai aparecer uma URL como:
```
https://api-fran-production.up.railway.app
```

**Copie esta URL** — você vai usar para o frontend.

Teste a API acessando:
```
https://api-fran-production.up.railway.app/health
```

Se vir `{"status":"ok","app":"Loja da Fran API"}`, funcionou! ✅

---

## ✅ ETAPA 5: Deploy do Frontend (Vercel) — 10 min

Vercel é onde o app vai rodar no navegador.

### 5.1 Criar conta no Vercel

1. Acesse https://vercel.com
2. Clique em **Sign Up**
3. Escolha **Continue with GitHub**
4. Autorize

### 5.2 Criar novo projeto

1. Clique em **Add New Project**
2. Selecione o repositório `loja-fran` (ou faça upload de `frontend-fran`)
3. Clique em **Import**

### 5.3 Adicionar variável de ambiente

Antes de fazer deploy, você precisa configurar a URL da API.

Procure a seção **Environment Variables** e adicione:

```
VITE_API_URL = https://api-fran-production.up.railway.app/api
```

(Substitua pela URL do Railway que você copiou)

### 5.4 Deploy

Clique em **Deploy** (botão azul).

Vai compilar e colocar no ar em ~2 minutos.

Quando terminar, você vai ter uma URL como:
```
https://loja-fran.vercel.app
```

**Copie esta URL!** 🎉

---

## ✅ ETAPA 6: Testes Finais — 5 min

Agora tudo está no ar. Vamos testar:

### 6.1 Acessar o app

Abra https://loja-fran.vercel.app no navegador

### 6.2 Fazer login

- Email: `fran@loja.com`
- Senha: a senha que você colocou em `ADMIN_PASSWORD`

Se conseguiu entrar, tudo está funcionando! ✅

### 6.3 Testar funcionalidades

- **Estoque:** cadastre um produto com foto
- **Financeiro:** registre um gasto
- **Lançamentos:** faça uma entrada de estoque
- **Personalização:** mude as cores e salve
- **Esqueci a senha:** clique, preencha email, verifique se recebeu no Gmail

Se tudo funcionou, **parabéns!** 🎉 Sua loja está no ar!

---

## 📱 ETAPA 7: Usar no Celular

### No iPhone (Safari):

1. Abra https://loja-fran.vercel.app no Safari
2. Toque no botão **Compartilhar** (↗️ no rodapé)
3. Role para baixo e toque **Adicionar à Tela de Início**
4. Dê um nome e toque **Adicionar**
5. Um ícone vai aparecer na sua tela inicial — é um "app"!

### No Android (Chrome):

1. Abra https://loja-fran.vercel.app no Chrome
2. Toque nos **3 pontos** (canto superior direito)
3. Toque **Instalar app**
4. Confirme

Pronto! Você tem um "app" sem precisar da App Store ou Google Play. 🎊

---

## 🔧 Troubleshooting (Se algo der errado)

| Problema | Solução |
|----------|---------|
| "Erro ao conectar ao servidor" | Verifique se a URL do Railway está correta no `.env` do frontend |
| "Email ou senha incorretos" | Verifique a senha em `ADMIN_PASSWORD` |
| "Fotos não aparecem" | Verifique se o bucket do Supabase é **Public** |
| "Email de recuperação não chega" | Verifique as credenciais do Gmail em `SMTP_USER` e `SMTP_PASS` |
| "Página em branco" | Abra o console (F12) e veja que erro aparece |

---

## 📞 Precisa de ajuda?

- **Documentação Supabase:** https://supabase.com/docs
- **Documentação Railway:** https://docs.railway.app
- **Documentação Vercel:** https://vercel.com/docs

---

## 🎯 Próximos passos (quando tiver rotina)

- **Trocar a senha regularmente**
- **Fazer backup do banco** (Supabase permite exportar SQL)
- **Compartilhar a vitrine com clientes:** `https://loja-fran.vercel.app/#/vitrine/inverno-2025`
- **Adicionar mais fornecedores/categorias**
- **Integrar com Instagram/WhatsApp** (futuro)

---

**Desenvolvido com ❤️ para a Loja da Fran**

Versão 1.0 — Maio 2025
