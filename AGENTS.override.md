# Skills locais do Wicolly-Sites

- Use `TSWill03/AgentsSkills` como catálogo canônico e instale skills somente em `.agents/skills/`.
- Execute `python scripts/sync-agent-skills.py --agent codex` para conferir ou restaurar o conjunto aprovado.
- Não use atualização global nem instale skills fora de `.agents/skills/` para este projeto.
- Antes de atualizar uma skill, revise origem, licença, diff, comandos e commit; depois atualize `.agents/skills.lock.json` e a documentação em `docs/skills/`.
- Use somente skills aplicáveis à tarefa atual. Instalação não autoriza deploy, alteração de DNS, segredos ou infraestrutura remota.
- Depois de usar qualquer skill, registre exatamente um feedback sanitizado com `skill-feedback`. Se o GitHub estiver indisponível, preserve `.agent-feedback/pending/` e tente `--flush-local` antes do handoff.
- Nunca registre tokens, cookies, chaves, conteúdo de `.env`, dados pessoais desnecessários ou logs extensos nos feedbacks.
