# Sistema de Controle Financeiro

Um sistema completo para gerenciamento de despesas e finanças pessoais.
-----------------------------------------------------------------------------------

## ⚙️ Como Utilizar
### 📦 Criar Ambiente

- Crie a pasta do projeto
- Crie um ambiente virtual

### 🛠️ Pré-requisitos

- Node.js 
- NPM 
- Conta no Convex 

## 💻 No Terminal
Execute os comandos abaixo no terminal:

- node -v
- Get-ExecutionPolicy
- Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
- Get-ExecutionPolicy
- npm -v
- npm install -g convex
- convex --version
- npm install npm-run-all

## ▶️ Executar o Projeto
Para executar como desenvolvimento:

- npm install npm-run-all
- npm run dev

## 🌐 Deploy para Produção

### ▲ Vercel

- Conecte seu repositório do Github ao Vercel
- Configure a variável de ambiente: 
   - VITE_CONVEX_URL / https://your-deployment-url.convex.cloud
- Deploy automático!

### 🌍 Netlify

- Conecte seu repositório do Github ao Netlify
- Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_CONVEX_URL`

## 🔒 Segurança

- Dados protegidos
- Validação de entrada 
- Conexão segura com HTTPS

## 🧩 Aplicação

- Local:
   - localhost
- Web:
   - https://sistema-financas-nu.vercel.app/

## 📈 Funcionalidades

- Autenticação segura com usuário/senha
- Gerenciamento de despesas por categorias
- Relatórios detalhados por período
- Consulta pelo calendário
- Exportação para CSV
- Interface responsiva e moderna
- Dados em tempo real

## 📄 Licença

Este projeto é privado e de uso restrito.