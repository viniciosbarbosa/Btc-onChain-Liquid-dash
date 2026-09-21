# ₿ BTC & Liquid On-Chain Dashboard

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

Dashboard moderno, profissional e de alta performance para exploração de **Bitcoin On-Chain** e **Liquid Network (Sidechain)**, com suporte nativo a nós próprios **Tor (.onion)** via Tor Gateways, rastreador gráfico de transações pendentes, sistema de transmissão de transações brutas (*Push Raw Tx*), internacionalização (PT/EN) e um **UI Design System** proprietário.

---

## ✨ Principais Funcionalidades

### 1. ₿ Bitcoin On-Chain Explorer
- **Fluxo da Mempool em Tempo Real**: Visualização dinâmica de blocos pendentes na mempool e blocos recém-minerados na blockchain.
- **Rastreador de Transações (Pending Tx Tracer)**: Permite seguir o rastro de qualquer transação pendente ou minerada, navegando recursivamente por inputs, outputs e endereços conectados.
- **Transmissão de Transações Assinadas (Push Raw Tx)**: Modal especializado para inspecionar tamanho virtual (`vB`), suporte a SegWit/Taproot e broadcast direto de transações hex brutas para a rede.
- **Explorador Completo**: Consulta de TxIDs, Hashes de Blocos, Endereços (`bc1q`, `bc1p`, `1A1...`), XPUBs e métricas de taxas em tempo real (`sat/vB`).

### 2. 💧 Liquid Network (Elements Core Sidechain)
- **Painel Dedicado para Liquid**: Visualizador de blocos, ativos e mempool específicos da rede Liquid.
- **Suporte a Transações Confidenciais**: Visualização de ativos como L-BTC, USDt e tokens emitidos na Liquid Network.
- **Integração RPC Elements Core**: Suporte a credenciais RPC salvas para conexão direta com nós Liquid Core.

### 3. 🧅 Suporte a Nós Próprios & Tor Gateways
- **Tor Gateway Resolvers**: Resolução transparente de domínios `.onion` via `onion.ly`, `onion.pet` ou proxy local SOCKS5.
- **Integração Umbrel / BitcoinExplorer**: Conectividade direta com a API REST de nós caseiros (Umbrel, RaspiBlitz, Start9) com fallback automático para APIs públicas de terceiros.

### 4. 🎨 UI Design System & Responsividade
- **Componentes Reutilizáveis (`src/components/ui/`)**: Biblioteca própria contendo `Button`, `Badge`, `Card`, `Modal` (com `createPortal`), e `Input`.
- **Estética Dark Glassmorphic**: Interface inspirada em dashboards financeiros de alta densidade visual, com suporte total a telas mobile e desktop.

### 5. 🌐 Internacionalização (i18n)
- Suporte bilíngue alternável em tempo real: **Português (PT-BR)** e **Inglês (EN)**.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React 18, TypeScript, Vite.
- **Roteamento**: React Router DOM v6.
- **Estilização**: Tailwind CSS, Vanilla CSS, Lucide React (Ícones).
- **HTTP Client**: Axios com interceptores customizados para gateways Tor.

---

## 📁 Estrutura do Projeto

```text
src/
├── components/           # Componentes da aplicação
│   ├── ui/               # 🎨 UI Design System (Button, Badge, Card, Modal, Input)
│   ├── MempoolVisualizer.tsx
│   ├── LiquidDashboard.tsx
│   ├── BroadcastTxModal.tsx
│   ├── PendingTxTracer.tsx
│   └── ...
├── config/               # Endpoints de API e fallbacks padrão
├── context/              # Contextos React (Network, Node, Language)
├── services/             # Serviços HTTP e cliente de exploração
├── types/                # Definições de tipos TypeScript
└── utils/                # Utilitários e validadores Bitcoin/Liquid
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18.x ou superior
- npm / yarn / pnpm

### Passos para Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/viniciosbarbosa/Btc-onChain-Liquid-dash.git
   cd Btc-onChain-Liquid-dash
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Opcional: edite o `.env` se desejar apontar para o seu nó Umbrel `.onion` ou Liquid RPC pessoal)*.

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000` (ou na porta informada no terminal).

5. **Compilar para Produção**:
   ```bash
   npm run build
   ```

---

## 🛡️ Segurança Operacional (OpSec)

Este repositório segue estritamente as melhores práticas de **OpSec**:
- O arquivo `.env` contendo credenciais ou nós privados é mantido **estritamente local** (protegido via `.gitignore`).
- Os valores padrão (*fallbacks*) no código publicado apontam apenas para APIs públicas de terceiros (`mempool.space` e `blockstream.info`), sem expor IPs ou serviços ocultos `.onion` pessoais.

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.