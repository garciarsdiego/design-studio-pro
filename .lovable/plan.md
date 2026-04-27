# Reorganização da cockpit — "Panel of Glass"

A direção atual está validada. Esta revisão reestrutura navegação, repensa o Console como workflow editor, simplifica o Chat e promove Ask a tela principal de conversa. Tudo continua acontecendo sobre o mesmo desktop preto único, sem rotas — apenas troca de "view" no canvas central.

## 1. Navegação (cápsula superior)

Reduzir para 3 itens + ícone:

```text
[ ◇ OMNIFORGE ]   [ Chat ]  [ Console ]  [ Data ]     [ ⌘ ] [ 🔔 ] [ ⚙ ] [ 👤 ]
```

- **Chat** (novo padrão / antigo Ask) — vista principal de conversa.
- **Console** — workflow visual (canvas / kanban / lista).
- **Data** — consolida Runs + Memory em uma única tela com sub-abas.
- **Setup** vira só o ícone de engrenagem ⚙ (abre modal como hoje).

Atualizar `navItems` em `src/data/mock.ts` para `chat | console | data` e remover entries de runs/memory/ask/setup do menu.

## 2. Chat — tela principal "leve e flutuante"

Inspiração: Claude Cowork / Codex Desktop. Não é modal: é a view default da app quando se abre.

Layout (sobre o canvas preto + dot grid, sem sidebars):

```text
                ┌───────────────────────────────┐
                │   Conversa flutuante (glass)  │
                │   - bolhas user / agent       │
                │   - plan previews inline      │
                │   - max-w 760px, centrado     │
                └───────────────────────────────┘

           ┌───────────────────────────────────────┐
           │  ⌘ wf_atlas_main  ·  ses_4421  ·  ▾  │  ← strip de contexto
           ├───────────────────────────────────────┤
           │  ✦  Instruct the active nodes…   →   │  ← composer cápsula
           └───────────────────────────────────────┘
```

- A "janela" de chat é um container `surface-glass` de largura limitada centrado verticalmente, sem barra de título — só respira sobre o canvas.
- Composer permanece fixo no rodapé como hoje, mas ganha **acima dele** um strip fino com:
  - workflow ativo (`wf_atlas_main`)
  - sessão (`ses_4421`)
  - dropdown de modelo (mock)
  - botão "+ New session"
- Sem modal. Quando o usuário clica em "Console" ou "Data" na cápsula, o chat se esconde com fade e a outra view aparece. O composer pode permanecer visível em todas as views (já é o caso).

Componentes novos: `ChatView.tsx`, `SessionStrip.tsx`. Reaproveita `ChatComposer`, `CodeBlock`, dados de `askMessages`.

## 3. Console — workflow editor (n8n / Make style)

Substitui o `NodeCanvas` atual de "nós orbitando o Orchestrator" por um **DAG editável estilo n8n**, com 3 modos de visualização alternáveis por um toggle no canto.

```text
┌──────────────────────────────────────────────────────────┐
│                                       [ ▣ Canvas | ▦ Kanban | ☰ List ] │
│                                                          │
│   ┌──────┐      ┌────────────┐      ┌─────────────┐      │
│   │ Web_ │─────▶│ Data_      │─────▶│ Analysis_   │──┐   │
│   │Scraper│     │ Ingest     │      │ Engine      │  │   │
│   └──────┘      └────────────┘      └─────────────┘  │   │
│                                                ▼     ▼   │
│                                         ┌────────┐ ┌────┐│
│                                         │CodeGen │ │Repo││
│                                         └────────┘ └────┘│
└──────────────────────────────────────────────────────────┘
```

### 3.1 Canvas mode (default)
- Nós retangulares em cards glass com: ícone do agente, nome, status dot pulsante, métrica curta (ex: "812 vec", "ctx 8k").
- Conexões com curvas Bézier (não linhas retas) em `hsl(0 0% 100% / 0.12)`, mais espessas (1.5px), com seta no destino.
- Nó ativo recebe glow âmbar e pulse; demais ficam em tom neutro com status dot.
- Clique no nó abre o `NodeInspector` lateral (painel direito flutuante que escorrega — não sidebar fixa).
- Pan/zoom **não** é necessário no MVP — layout é fixo do mock.
- Reaproveita estrutura de `dagNodes` / `dagEdges` (já existe), expandida para representar o workflow principal.

### 3.2 Kanban mode
- Colunas por **status**: Idle · Processing · Active · Error · Completed.
- Cards do mesmo agente/nó migram entre colunas com base no status atual.
- Card mostra: nome do nó, agente responsável, último timestamp, métrica.

### 3.3 List mode
- Tabela densa estilo `runs` com: status dot, nome, agente, último update, duração, ações.

### 3.4 Toggle
- Cápsula de 3 ícones no canto superior direito da view (abaixo do menu), `surface-glass`, mesmo estilo dos `CapsuleTabs`.

Componentes novos:
- `src/components/cockpit/console/WorkflowCanvas.tsx` (substitui `NodeCanvas`)
- `src/components/cockpit/console/WorkflowKanban.tsx`
- `src/components/cockpit/console/WorkflowList.tsx`
- `src/components/cockpit/console/ConsoleView.tsx` (orquestra o toggle)
- `src/components/cockpit/console/WorkflowNode.tsx` (card do nó)

Mock: estender `dagNodes` em `mock.ts` para virar o `workflowNodes` principal (com posições, métricas, agente, status). `agentNodes` antigo pode ser descontinuado.

## 4. Data — consolida Runs + Memory

Substitui dois itens do menu por um. Não é modal: é uma view full-canvas que entra com fade quando "Data" é selecionado.

Layout:

```text
┌──────────────────────────────────────────────┐
│  [ Runs ]  [ Memory ]  [ Deposits ]          │  ← CapsuleTabs no topo
├──────────────────────────────────────────────┤
│                                              │
│   Conteúdo da aba ativa                      │
│                                              │
└──────────────────────────────────────────────┘
```

- **Runs**: lista que já existe em `RunsModal` (`RunsList`) + drill-down. O drill-down (Overview / Structure / Activity / Conversations / Artifacts / Logs) permanece — é o único lugar que usa sidebar, na aba Structure (já aprovado).
- **Memory**: a matriz 48×16 + legenda.
- **Deposits**: a lista de `memoryDeposits` (estava junto da Memory no modal antigo, agora ganha aba própria).

Componentes:
- `src/components/cockpit/data/DataView.tsx` (host com tabs)
- Mover lógica de `RunsModal` → `RunsPanel.tsx` (sem `GlassModal` wrapper).
- Mover matriz → `MemoryPanel.tsx`. Mover deposits → `DepositsPanel.tsx`.
- `RunsModal.tsx` e `MemoryModal.tsx` antigos podem ser removidos.

## 5. Ask → absorvido pelo Chat

A tela "Chat" descrita em §2 já é o que era o Ask, agora como vista principal. `AskModal.tsx` é removido. Mensagens, plan previews e botões Execute/Deny migram para `ChatView.tsx`.

## 6. Setup

Permanece como modal acionado pelo ícone de engrenagem na cápsula superior. Sem mudança de layout. Removido do menu de navegação principal.

## 7. Ajustes em `Index.tsx`

Trocar `active` para `"chat" | "console" | "data"`. View default vira `chat`. Renderização condicional simples:

```tsx
{active === "chat" && <ChatView />}
{active === "console" && <ConsoleView />}
{active === "data" && <DataView />}
```

Modais restantes: `SetupModal`, `SystemStatusModal`, `NodeInspector`. Composer fixo continua para todas as views (no Data e dentro do drill-down de Run pode ser ocultado para não poluir).

## 8. Detalhes técnicos

- **Transições entre views**: fade + leve scale (`animate-fade-in` + `scale-in`) no container de cada view, 200ms, para reforçar "panel of glass".
- **Sem rotas**: continua tudo em `/`. Estado `active` controla a view.
- **Tokens**: nenhum token novo. Reusar `surface-glass`, `surface-glass-strong`, `glow-amber-soft`, `bg-grid-dots`.
- **Z-index**: cápsula superior 40, composer 30, modais 50, inspetor flutuante 35.
- **Acessibilidade**: cada view recebe `role="region"` + `aria-label`.
- **Dados mock**: estender `dagNodes` no `mock.ts` para o workflow principal do Console; manter `runs`, `memoryDeposits`, `askMessages` como estão.

## 9. Entregáveis em ordem

1. Atualizar `navItems` e `Index.tsx` para nova estrutura de 3 views + ícone.
2. Criar `ChatView` + `SessionStrip`; remover `AskModal`.
3. Criar `console/` (Canvas, Kanban, List, host com toggle); aposentar `NodeCanvas` antigo.
4. Criar `data/` (Runs, Memory, Deposits panels) reaproveitando código existente; remover `RunsModal` e `MemoryModal`.
5. Polir transições entre views, ocultar composer onde apropriado.
