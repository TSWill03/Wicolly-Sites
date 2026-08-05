# Integracao com AgentSkills

## Fonte canonica

As skills deste projeto sao selecionadas e versionadas em `TSWill03/AgentsSkills`. O mapeamento oficial e `wicolly-sites` em `registry/skills.json`.

Skills mapeadas: skill-feedback, blacklight-product-publisher, frontend-design, web-design-guidelines, design-taste-frontend, vercel-react-best-practices, tdd, prototype, to-prd e to-issues.

## Sincronizacao

Execute `python scripts/sync-agent-skills.py --agent codex` quando `.agents/skills/skill-feedback/SKILL.md` nao existir ou antes de atualizar as skills. A instalacao deve ser local ao projeto. O repositorio central e privado e exige autenticacao no GitHub CLI ou no Git.

## Feedback obrigatorio

Depois de cada uso de qualquer skill, registre exatamente um evento seguindo `skill-feedback/SKILL.md`, com resultado esperado, resultado obtido, status, erros sanitizados e sugestao de melhoria. O destino preferencial e uma issue `[skill-feedback]` em `TSWill03/AgentsSkills`; sem rede, preserve o JSONL em `.agent-feedback/pending/`.

Nunca envie segredos, cookies, chaves, arquivos `.env` ou dados pessoais desnecessarios. Uma tarefa que utilizou skill somente esta encerrada depois que o feedback foi enviado ou persistido localmente.
