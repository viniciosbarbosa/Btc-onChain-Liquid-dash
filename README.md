# ₿ BTC & Liquid On-Chain Dashboard

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-PT--BR%20%7C%20EN-emerald.svg?style=for-the-badge)](src/context/LanguageContext.tsx)
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

Dashboard moderno, profissional e de alta performance para exploração de **Bitcoin On-Chain** e **Liquid Network (Sidechain)**, com suporte nativo a nós próprios **Tor (.onion)** via Tor Gateways, roteamento inteligente de APIs por ambiente (dev vs produção), rastreador gráfico de transações pendentes, transmissão de transações brutas (*Push Raw Tx*), **internacionalização completa (PT/EN)** e um **UI Design System** proprietário.

---

## ✨ Principais Funcionalidades

### 1. 🌐 Internacionalização Completa (i18n)
- **Suporte Bilíngue Nativo (PT-BR / EN)**: Alternância em tempo real com 100% de cobertura em toda a interface (Navbar, SearchBar, Sub-tabs, Métricas de Taxa, Halving Clock, Modais de Configuração, Visualizador de Mempool, Detalhes de Tx/Endereço/XPUB/Bloco e Painel Liquid).
- **Persistência de Preferência**: O idioma selecionado pelo usuário é salvo automaticamente no `localStorage`.

### 2. ⚡ Roteamento Inteligente de APIs por Ambiente (Dev vs Produção)
- **Modo Desenvolvimento (`import.meta.env.DEV === true`)**: Prioriza a conexão direta com o nó local ou gateway Tor `.onion` (ex: Umbrel, RaspiBlitz, Start9). Caso esteja offline, faz *fallback* automático para a API de terceiros.
- **Modo Produção (`import.meta.env.DEV === false`)**: Redireciona diretamente para **APIs públicas de terceiros de alta disponibilidade** ([Mempool.space](https://mempool.space) para Bitcoin On-Chain e [Blockstream.info](https://blockstream.info) para Liquid Network), garantindo carregamento instantâneo sem *delays* causados por domínios `.onion` ou `.local` inacessíveis.

### 3. ₿ Bitcoin On-Chain Explorer
- **Fluxo da Mempool em Tempo Real**: Visualização dinâmica estilo mempool.space com blocos pendentes na mempool (esquerda) e blocos recém-minerados na blockchain (direita).
- **Rastreador de Transações Pendentes (Pending Tx Tracer)**: Acompanhe a posição em vByte na fila da mempool e estimativas de inclusão em bloco.
- **Transmissão de Transações Assinadas (Push Raw Tx)**: Modal especializado para inspeção de tamanho virtual (`vB`), SegWit/Taproot e broadcast direto de hexadecimais de transações brutas para a rede.
- **Explorador Completo**: Consulta de TxIDs, Hashes de Blocos, Endereços (`bc1q`, `bc1p`, `1A1...`), XPUBs e métricas de taxas em tempo real (`sat/vB`).

### 4. 💧 Liquid Network (Elements Core Sidechain)
- **Painel Dedicado para Liquid**: Visualizador de blocos, ativos e mempool específicos da rede Liquid.
- **Suporte a Transações Confidenciais**: Visualização de ativos como L-BTC, USDt e tokens emitidos na Liquid Network.
- **Integração RPC Elements Core**: Suporte a credenciais RPC salvas para conexão com nós Liquid Core.

### 5. 🧅 Suporte a Nós Próprios & Tor Gateways
- **Tor Gateway Resolvers**: Resolução transparente de domínios `.onion` via `onion.ly`, `onion.pet` ou proxy local SOCKS5.
- **Indicador Visual de Status**: Badge dinâmico no modal de configuração mostrando se a aplicação está operando em Modo Dev (Nó Próprio) ou Modo Produção (API Pública de Terceiros).

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React 18, TypeScript, Vite.
- **Roteamento**: React Router DOM v7.
- **Estilização**: Tailwind CSS, Vanilla CSS, Lucide React (Ícones).
- **HTTP Client**: Axios com roteador customizado para ambiente dev/prod e gateways Tor.

---

## 📁 Estrutura do Projeto

```text
src/
├── components/           # Componentes da aplicação
│   ├── ui/               # 🎨 UI Design System (Button, Badge, Card, Modal, Input)
│   ├── MempoolVisualizer.tsx
│   ├── FeeEstimator.tsx
│   ├── OnChainAnalytics.tsx
│   ├── QuotesWidget.tsx
│   ├── LiquidDashboard.tsx
│   ├── BroadcastTxModal.tsx
│   ├── NodeConfigModal.tsx
│   └── ...
├── config/               # Endpoints de API e fallbacks padrão
├── context/              # Contextos React (Network, Node, Language i18n)
├── services/             # Serviços HTTP e cliente de exploração (httpClient.ts)
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

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000` (ou na porta informada no terminal).

5. **Verificar Tipos TypeScript**:
   ```bash
   npm run lint
   ```

6. **Compilar para Produção**:
   ```bash
   npm run build
   ```

---

## 🛡️ Roteamento de APIs & Segurança Operacional (OpSec)

- **Modo Desenvolvimento**: O arquivo `.env` contendo credenciais ou nós privados é mantido **estritamente local** (protegido via `.gitignore`).
- **Modo Produção**: Em builds de produção, o cliente HTTP utiliza automaticamente APIs públicas de terceiros (`mempool.space` e `blockstream.info`), garantindo máxima disponibilidade sem expor IPs ou depender de infraestrutura local privada.

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.