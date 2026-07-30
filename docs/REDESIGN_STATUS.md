# Status do redesign

Atualizado em: 2026-07-30

## Fase atual

Fase 1 — Auditoria concluída.

## Concluído

- Estado Git, remoto, branch padrão e autenticação GitHub verificados.
- Estrutura de páginas, build, validação, links, deploy e smoke inspecionada.
- Projeto Cloudflare oficial e regra de publicação pela `main` identificados.
- Visibilidade dos cinco repositórios de atividade confirmada.
- Imagens existentes classificadas entre screenshots reais e arte visual.
- Conteúdo legado não comprovado identificado.
- Estratégia estática orientada a dados definida.

## Pendente

- Criar dados centrais e gerador de páginas.
- Corrigir identidade, currículo e links sociais.
- Implementar novo design e páginas.
- Implementar changelog, BlackLight e content studio.
- Expandir testes e validar acessibilidade/desempenho.
- Publicar, integrar e validar produção.

## Decisões

- Não migrar para outro framework.
- Não usar fotografia ou produto gerado por IA.
- LittleX e OpenClaw Little X permanecerão em modo manual por serem privados.
- Dados não confirmados não serão inferidos.
- `/veredra/` será preservado como bundle independente.

## Testes executados

- `git status --short --branch`: árvore limpa no início.
- `gh auth status`: conta `TSWill03` autenticada.
- `gh repo view`: remoto, branch padrão e visibilidade confirmados.
- Inspeção estática dos workflows, scripts e páginas existentes.

## Problemas encontrados

- Conteúdo fictício ou de exemplo no portfólio legado.
- LinkedIn confirmado ausente na configuração compartilhada.
- Dados duplicados.
- Ausência das novas páginas e automações solicitadas.
- Ausência de retrato e fotos reais de produtos.

## Próxima ação

Implementar a fonte única de conteúdo e gerar as superfícies públicas a partir dela.
