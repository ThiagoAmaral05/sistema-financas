# Sistema de Controle Financeiro

Um sistema completo para gerenciamento de despesas e finanças pessoais, construído com React, Convex e TailwindCSS.

## 🚀 Funcionalidades

- ✅ Autenticação segura com usuário/senha
- ✅ Gerenciamento de despesas por categorias
- ✅ Relatórios detalhados por período
- ✅ Exportação para CSV
- ✅ Interface responsiva e moderna
- ✅ Dados em tempo real

## 📋 Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta no Convex (gratuita)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd controle-financas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Convex

1. Crie uma conta em [https://convex.dev](https://convex.dev)
2. Instale a CLI do Convex:
```bash
npm install -g convex
```

3. Faça login no Convex:
```bash
npx convex login
```

4. Inicialize o projeto:
```bash
npx convex dev
```

### 4. Configure as variáveis de ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Edite `.env.local` e adicione sua URL do Convex:
```
VITE_CONVEX_URL=https://your-deployment-url.convex.cloud
```

### 5. Execute o projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm run build
npm run preview
```

## 🌐 Deploy para Produção

### Opção 1: Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente `VITE_CONVEX_URL`
3. Deploy automático!

### Opção 2: Netlify

1. Conecte seu repositório ao Netlify
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_CONVEX_URL`

### Opção 3: Outros provedores

Para qualquer provedor que suporte sites estáticos:
1. Execute `npm run build`
2. Faça upload da pasta `dist`
3. Configure a variável `VITE_CONVEX_URL`

## 📊 Categorias de Despesas

O sistema suporta 8 categorias principais:

1. **Colina** - Condomínio, Luz, Água
2. **Porto** - Condomínio, Luz, Internet  
3. **Azul** - Condomínio, Luz, IPTU, Gás
4. **Praia** - Condomínio, Luz
5. **Hangar** - Condomínio, Luz, Internet
6. **Contador** - Patrimonial, Facility, MJD
7. **Despesas** - Consomínio, Faculdade, Aluguel, Fiança Mensal
8. **Outros** - Baia Marina, Seguro de Vida

## 🔐 Segurança

- Autenticação obrigatória para acesso
- Dados isolados por usuário
- Validação de entrada em todas as operações
- Conexão segura com HTTPS

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se a URL do Convex está correta
2. Confirme que o deployment do Convex está ativo
3. Verifique o console do navegador para erros
4. Teste a conexão com o Convex Dashboard

## 📝 Licença

Este projeto é privado e de uso restrito.
