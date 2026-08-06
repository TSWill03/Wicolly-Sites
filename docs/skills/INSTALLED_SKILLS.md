# Skills instaladas no projeto

Instalação: 2026-08-06. Escopo: somente `.agents/skills/`. Agente: Codex. Modo: cópia local. Lock: `.agents/skills.lock.json`.

| Skill | Origem/commit | Versão | Motivo e uso | Rotas/componentes | Riscos | Responsável por atualização |
| --- | --- | --- | --- | --- | --- | --- |
| skill-feedback | TSWill03/AgentsSkills @ a636bc9 | 0.1.0 | Registrar um feedback sanitizado por skill usada | Integração inteira | Cria issue GitHub; fallback local preservado | Mantenedores de TSWill03/AgentsSkills |
| frontend-design | anthropics/skills @ b29e7cf | commit-pinned | Inventário de tokens, hierarquia e consistência | Todas as rotas públicas | Julgamento estético pode ampliar escopo; usado somente em auditoria | Anthropic; aprovação local antes de atualizar |
| web-design-guidelines | vercel-labs/agent-skills @ 7c180d9 | 1.0.0 | Revisão de a11y, interação, imagens, formulários e layout | Renderer, CSS compartilhado, Hefesto/Poseidon, BlackLight | Busca regras atuais pela rede; resultados exigem validação local | Vercel; aprovação local antes de atualizar |
| vercel-react-best-practices | vercel-labs/agent-skills @ 7c180d9 | 1.0.0 | Revisão do React/Vite preservado | `portfolio/src/` e build isolado | Parte das regras é Next.js e não se aplica; React não é publicado | Vercel; aprovação local antes de atualizar |

## Verificação e atualização

```bash
python scripts/sync-agent-skills.py --agent codex
npx skills list -a codex
```

O sincronizador instala ausências e verifica conteúdo normalizando apenas finais de linha. Se uma cópia divergir, ele falha sem sobrescrever. Para atualizar:

1. revise o novo commit, licença, `SKILL.md`, arquivos auxiliares e comandos;
2. atualize o SHA e a versão em `.agents/skills.lock.json` e nesta documentação;
3. execute `python scripts/sync-agent-skills.py --agent codex --force-update`;
4. confira `git diff`, execute os testes e registre feedback.

Nunca use `-g`, `--global` ou `npx skills update -g` neste repositório.
