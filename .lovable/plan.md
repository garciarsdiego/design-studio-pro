# Omniforge Studio — Design Cockpit

Direção fechada nas 3 referências: canvas preto puro com grid de pontos, cápsula de navegação flutuante no topo, nós dispersos como ícones, modais glass com dim sólido, composer de chat fixo no rodapé como cápsula translúcida. Sem colunas fixas, sem sidebars permanentes — sidebar só aparece dentro de Run → Structure (DAG).

## Linguagem visual

**Paleta (dark-only, state-driven)**
- Canvas: `#000` puro
- Grid: pontos `rgba(255,255,255,0.04)` espaçados 24px
- Surface glass: `rgba(18,18,20,0.65)` + `backdrop-blur-xl` + borda `rgba(255,255,255,0.08)`
- Surface elevated (cards de nó): `rgba(28,28,30,0.85)`
- Âmbar primário `#F0723A` — ações, item ativo, glow
- Teal `#5EE3C1` — status idle/ok
- Vermelho `#E5484D` — erro/bloqueio
- Roxo `#9B7BE3` — compiling/processing
- Texto: `rgba(255,255,255,0.95)` / mute `rgba(255,255,255,0.55)` / dim `rgba(255,255,255,0.35)`

**Tipografia**
- Inter — UI geral, títulos
- JetBrains Mono — IDs, labels de seção em CAIXA ALTA, logs, código, timestamps

**Glow & motion (médio + pulse vivo)**
- Glow âmbar radial sutil em: nó ativo, item de menu ativo, botão primário, send do chat
- Pulse 2s contínuo nos status dots (teal/vermelho/roxo)
- Pulse leve no nó ativo (scale 1 → 1.02, opacity glow 0.6 → 1)
- Transições: 180ms ease-out padrão, 240ms para modais

**Sem**: serifa, gradientes coloridos, sombras pretas pesadas, bordas duras de 1px claras.

## Estrutura de telas

**Home (`/`) — Canvas limpo**
- Fundo preto + grid de pontos
- Cápsula de navegação flutuante centralizada no topo: `Console · Ask · Runs · Memory · Setup` + ícones de sino, settings, avatar à direita (mesma cápsula ou cápsula gêmea)
- Item ativo: pill âmbar preenchido com glow
- Canvas central: nós do projeto (Orchestrator, Data_Ingest, Analysis_Engine, CodeGen_v2, Web_Scraper) dispersos organicamente
- Nó central destacado em card glass com glow âmbar + status dot pulsante
- Nós secundários: ícone circular + label mono pequeno embaixo
- Composer de chat fixo no rodapé: cápsula translúcida full-width com sparkle à esquerda, placeholder "Instruct the active nodes…", botão send âmbar à direita
- **Sem painel lateral**. System Status acessível pelo sino (abre modal).

**Console** = home (mesma rota). Clicar Console no menu = ir pra `/`.

**Ask (modal)**
- Abre como modal glass grande centralizado sobre o canvas escurecido (dim 75%)
- Header mono: `ASK · NEW THREAD`
- Lista de mensagens (user/agent) com bubbles glass discretos
- Plan preview embutido como bloco mono com fundo levemente mais escuro + botões Deny/Execute (estética da imagem 2)
- Composer interno reaproveita o do rodapé

**Runs (modal lista → modal detalhe)**
- Modal grande: tabela de runs com ID mono, status dot, agente, duração, timestamp
- Clicar uma run → expande para vista ampla com tabs em cápsula interna: Overview · Structure · Activity · Conversations · Artifacts · Logs
- **Structure** é a única tela com sidebar: DAG ocupa centro, sidebar direita lista nós + Inspector ao clicar um nó. Cápsula de menu permanece visível no topo.

**Memory (modal)**
- Modal amplo com matriz 48×16 de campos (grid de células pequenas, intensidade âmbar = densidade)
- Lista de depósitos abaixo da matriz (não lateral) em cards glass empilháveis

**Setup (modal)**
- Modal com tabs em cápsula interna: Workspace · Team · Integrations · Models · Data
- Conteúdo de cada tab em forma vertical simples

**Modais — comportamento padrão**
- Backdrop: `rgba(0,0,0,0.75)` sólido (não mostra canvas blur atrás — foco máximo)
- Container: glass `rgba(18,18,20,0.85)` + blur + borda 1px branco 8% + radius `xl`
- Header: ícone âmbar + label mono CAIXA ALTA + X no canto
- Footer sticky com ações (ghost à esquerda, primário âmbar à direita)
- Fecha com Esc, clique fora, ou X
- Animação: scale-in 0.95→1 + fade 200ms

**System Status (modal pelo sino)**
- Bloco mono: latência, nós ativos, recent activity timeline com timestamps mono

## Componentes a construir

1. `AppShell` — canvas grid + cápsula de menu + composer rodapé (presente em toda rota)
2. `MenuCapsule` — pill flutuante com nav + ações (sino, settings, avatar)
3. `ChatComposer` — cápsula glass no rodapé com sparkle + input + send
4. `NodeCanvas` — render dos nós dispersos com posicionamento absoluto, glow no ativo, pulse nos status
5. `NodeCard` — card glass para nó selecionado/central
6. `NodeDot` — ícone circular + label para nós secundários
7. `GlassModal` — wrapper padrão (header mono + content + footer sticky)
8. `CodeBlock` — bloco mono escuro embutido para prompts/logs com sintaxe `[SYS]` âmbar
9. `StatusDot` — ponto colorido com animação pulse
10. `CapsuleTabs` — tabs em cápsula para uso interno em modais
11. `DAGView` + `DAGSidebar` — única exceção com sidebar (só em Run → Structure)
12. `MemoryMatrix` — grid 48×16 de células com intensidade

## Mock data
`src/data/mock.ts` centraliza: projetos, nós, runs, threads, depósitos de memória, eventos. IDs em prefixos mono (`wf_`, `tk_`, `ses_`, `t_`). Updates simulados a cada 8s para dar sensação viva.

## Tokens & setup técnico
- `index.css`: nova paleta HSL, tokens glass, grid background utility
- `tailwind.config.ts`: cores semânticas (canvas, glass, amber, teal, danger, processing), animations (pulse-glow, fade-scale)
- Fontes Inter + JetBrains Mono via `<link>` no index.html
- Roteamento: `/` (home/console), `/runs/:id` (vista ampla), tudo mais é state de modal sobre `/`

## Ordem de entrega (tudo de uma vez, mas nessa sequência interna)
1. Tokens, fontes, grid background, shell (cápsula + composer)
2. NodeCanvas + NodeCard + NodeDot + StatusDot com mock
3. GlassModal base + System Status modal (sino)
4. Ask, Memory, Setup como modais
5. Runs lista (modal) + Run detalhe com CapsuleTabs
6. DAGView com sidebar (única exceção) dentro de Structure
7. Animações pulse, glow, transições de modal