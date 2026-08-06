# Seleção de Agent Skills

Catálogo canônico auditado: `TSWill03/AgentsSkills` em `a636bc9c0f97c699ce8fb6ef0989c8dbfef64d3e`.

Critérios: utilidade real, compatibilidade com o build estático/React legado, licença, sobreposição, contexto, comandos, rede e risco de alteração destrutiva. `REJECTED` inclui candidatas não registradas no catálogo canônico; `NOT_APPLICABLE` indica incompatibilidade objetiva com a stack ou o escopo.

| Skill | Origem | Versão/commit | Aplicação no projeto | Risco | Decisão | Justificativa |
| --- | --- | --- | --- | --- | --- | --- |
| frontend-design | anthropics/skills via catálogo | b29e7cf | Inventário e crítica da identidade existente | Baixo | APPROVED | Útil sem exigir migração; Apache-2.0; sem scripts |
| web-design-guidelines | vercel-labs/agent-skills via catálogo | 1.0.0 / 7c180d9 | Auditoria visual, a11y, formulário e responsividade | Médio | APPROVED | Busca regras atuais na rede, mas não executa mudanças |
| vercel-react-best-practices | vercel-labs/agent-skills via catálogo | 1.0.0 / 7c180d9 | Revisão do React legado e bundle isolado | Baixo | APPROVED | Evidenciou que React não está no build publicado; MIT |
| vercel-composition-patterns | vercel-labs/agent-skills | 7c180d9 | Composição React | Baixo | REJECTED | Não está mapeada pelo catálogo canônico e o React não é produção |
| tailwind-design-system | não registrada | — | Tokens Tailwind | Médio | NOT_APPLICABLE | O projeto usa CSS nativo |
| shadcn | não registrada | — | Componentes shadcn | Alto | NOT_APPLICABLE | Exigiria Tailwind e migração ampla |
| web-design-reviewer | não registrada | — | Revisão visual | Médio | REJECTED | Sobrepõe `web-design-guidelines` e não tem origem canônica registrada |
| web-perf | disponível no ambiente, não no catálogo | ambiente | Lighthouse/CWV | Médio | REJECTED | Não instalada localmente; método MCP indisponível. Usada apenas como metodologia externa |
| webapp-testing | anthropics/skills, não registrada | — | Teste de navegador | Médio | REJECTED | Playwright já existe e evita duplicação |
| playwright-best-practices | não registrada | — | Boas práticas Playwright | Médio | REJECTED | Sem entrada canônica; a skill Playwright do ambiente guiou a execução |
| check-fix-accessibility | não registrada | — | WCAG | Médio | REJECTED | Sem origem canônica e forte sobreposição com guidelines/Lighthouse/Playwright |
| seo-audit | não registrada | — | Metadados e indexação | Médio | REJECTED | Auditoria coberta pelos validadores existentes e inspeção por rota |
| copywriting | não registrada | — | Texto comercial | Médio | REJECTED | Não havia autorização/evidência para reescrever conteúdo |
| page-cro | não registrada | — | Conversão | Médio | REJECTED | Fora do escopo incremental e sem analytics de produto |
| schema-markup | não registrada | — | JSON-LD | Baixo | REJECTED | JSON-LD já é validado e a skill não está no catálogo |
| analytics-tracking | não registrada | — | Analytics | Alto | NOT_APPLICABLE | Analytics é deliberadamente bloqueado por decisão de privacidade |
| cloudflare | não registrada | — | Configuração Cloudflare | Alto | REJECTED | Nenhuma mudança remota autorizada e não está no catálogo |
| cloudflare-deploy | não registrada | — | Publicação | Alto | NOT_APPLICABLE | Deploy manual foi explicitamente proibido |
| security-best-practices | disponível no ambiente, não no catálogo | ambiente | Auditoria JS/TS frontend | Baixo | REJECTED | Não instalada localmente; usada somente como metodologia externa obrigatória |
| skill-feedback | TSWill03/AgentsSkills | 0.1.0 / a636bc9 | Feedback sanitizado de cada skill usada | Médio | APPROVED | Obrigatória pelo protocolo canônico; script inspecionado |
| ui-ux-pro-max | não registrada | — | UI/UX ampla | Médio | REJECTED | Origem não governada e sobreposição ampla |
| design-taste-frontend | leonxlnx/taste-skill via catálogo | e988add | Redesign/landing pages | Alto | REJECTED | Muito extensa, sobrepõe `frontend-design` e inclui sugestões de instalação/migração não aplicáveis |
| polish | não registrada | — | Acabamento visual | Médio | REJECTED | Sem origem canônica e redundante |
| critique | não registrada | — | Crítica visual | Médio | REJECTED | Sem origem canônica e redundante |
| agent-browser | vercel-labs/agent-browser via catálogo | acbc22b | Browser automation | Médio | REJECTED | Playwright já cobre o projeto; evitar duas superfícies de automação |
| tdd | mattpocock/skills via catálogo | bb8fdc3 | Desenvolvimento test-first | Baixo | REJECTED | A tarefa é auditoria incremental sobre suíte existente, não uma feature TDD |
| handoff | mattpocock/skills via catálogo | bb8fdc3 | Continuidade | Baixo | REJECTED | Documentação final já cobre handoff; responsabilidade duplicada |
| triage | mattpocock/skills via catálogo | bb8fdc3 | Incidentes | Baixo | REJECTED | Não há incidente/bug report aberto a triar |
| prototype | mattpocock/skills via catálogo | bb8fdc3 | Protótipo descartável | Médio | NOT_APPLICABLE | Nenhuma decisão exigia protótipo e código descartável não deve entrar em `main` |
| find-skills | vercel-labs/skills via catálogo | a4d243c | Descoberta de skills | Médio | REJECTED | Lista e catálogo já foram fornecidos; busca adicional ampliaria supply chain sem benefício |

Não há skills `EXPERIMENTAL` instaladas. `blacklight-product-publisher`, embora mapeada como experimental para Wicolly-Sites no catálogo, não foi adotada porque esta tarefa não publica produtos nem possui fotos/dados reais novos.
