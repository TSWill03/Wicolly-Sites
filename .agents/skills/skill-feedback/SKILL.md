---
name: skill-feedback
description: Registra feedback estruturado e sanitizado depois do uso de qualquer skill, enviando para o GitHub ou usando fallback JSONL local.
metadata:
  version: 0.1.0
  owner: TSWill03
  projects: "Todos os projetos"
---
# Skill Feedback

## Quando usar

Use obrigatoriamente ao terminar a participacao de qualquer skill em uma tarefa. Use uma vez por skill, inclusive quando o resultado foi totalmente correto.

## Objetivo

Criar evidencia operacional para que o mantenedor semanal saiba:

- quais skills foram usadas;
- se entregaram o resultado esperado;
- onde falharam ou exigiram correcao manual;
- quais comportamentos positivos devem ser preservados;
- quais melhorias possuem evidencia suficiente.

## Procedimento

1. Verifique o resultado real da skill antes de avaliar.
2. Escolha `success`, `partial` ou `failure` conforme o protocolo.
3. Descreva o esperado e o obtido em frases objetivas.
4. Inclua somente o menor trecho de erro necessario.
5. Redija qualquer segredo antes de chamar o registrador.
6. Execute `scripts/record_feedback.py` desta skill.
7. Confirme a URL da issue ou o caminho do fallback local.
8. Se houve fallback, inclua `.agent-feedback/pending/` no handoff e tente `--flush-local` antes de finalizar.

## Status

- `success`: entregou o que prometia sem correcao relevante.
- `partial`: ajudou, mas faltou cobertura ou houve correcao manual relevante.
- `failure`: nao atingiu o objetivo, falhou ou criou risco.

## Operacoes proibidas

- Inventar feedback sem verificar a saida.
- Omitir falha para manter aparencia de sucesso.
- Enviar logs completos quando um trecho pequeno basta.
- Registrar credenciais ou conteudo privado desnecessario.
- Fechar a issue de feedback manualmente antes da revisao semanal.

## Saida esperada

Uma issue `[skill-feedback]` em `TSWill03/AgentsSkills` ou um evento JSONL local valido.
## Feedback obrigatorio

Antes de declarar a tarefa concluida, registre uma avaliacao desta skill. Uma tarefa que use varias skills deve registrar um evento para cada uma.

Codex/agentes universais:

```bash
python .agents/skills/skill-feedback/scripts/record_feedback.py \
  --skill skill-feedback \
  --skill-version 0.1.0 \
  --project OWNER/REPO \
  --agent codex \
  --status success \
  --severity info \
  --expected "resultado esperado" \
  --actual "resultado verificado" \
  --improvement "Nenhuma"
```

OpenClaw usa o mesmo comando a partir de `skills/skill-feedback/scripts/record_feedback.py`.

Use `partial` ou `failure` quando houver lacunas. Nunca coloque segredos, tokens, cookies, conteudo de `.env` ou dados pessoais desnecessarios no feedback.
