# Sistema de Controle Financeiro

Um sistema completo para gerenciamento de despesas e finanças pessoais.

## 📚 Sumário
-----------------------------------------------------------------------------------

- [🚀 Sobre o Projeto](#sobre-o-projeto)
- [⚙️ Como Utilizar](#como-utilizar)
- [📦 Criar Ambiente](#criar-ambiente)
- [🛠️ Pré-requisitos](#pré-requisitos)
- [💻 No Terminal](#no-terminal)
- [▶️ Executar o Projeto](#executar-o-projeto)
- [🌐 Deploy para Produção](#deploy-para-produção)
  - [▲ Vercel](#vercel)
  - [🌍 Netlify](#netlify)
- [🔒 Segurança](#segurança)
- [🧩 Aplicação](#aplicação)
- [📈 Funcionalidades](#funcionalidades)
- [📄 Licença](#licença)

## Sobre o Projeto

## Como Utilizar

## Criar Ambiente

- Crie a pasta do projeto
- Crie um ambiente virtual

## Pré-requisitos

- Node.js 
- NPM 
- Conta no Convex 

## No Terminal
Execute os comandos abaixo no terminal:

- node -v
- Get-ExecutionPolicy
- Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
- Get-ExecutionPolicy
- npm -v
- npm install -g convex
- convex --version
- npm install npm-run-all

## Executar o Projeto
Para executar como desenvolvimento:

- npm install npm-run-all
- npm run dev

## Deploy para Produção

### Vercel

- Conecte seu repositório do Github ao Vercel
- Configure a variável de ambiente: 
   - VITE_CONVEX_URL / https://your-deployment-url.convex.cloud
- Deploy automático!

### Netlify

- Conecte seu repositório do Github ao Netlify
- Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_CONVEX_URL`

## Segurança

- Autenticação obrigatória para acesso
- Dados isolados por usuário
- Validação de entrada 
- Conexão segura com HTTPS

## Aplicação

- Local:
   - http://localhost:5173/
- Web:
   - https://sistema-financas-nu.vercel.app/

## Funcionalidades

- Autenticação segura com usuário/senha
- Gerenciamento de despesas por categorias
- Relatórios detalhados por período
- Exportação para CSV
- Interface responsiva e moderna
- Dados em tempo real

## Licença

Este projeto é privado e de uso restrito.

