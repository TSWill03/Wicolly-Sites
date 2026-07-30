# Auditoria do redesign de wicolly.com.br

Data da auditoria: 2026-07-30 (America/Sao_Paulo)

## Escopo e estado inicial

- Repositório confirmado: `TSWill03/Wicolly-Sites`, público, branch padrão `main`.
- Checkout inicial limpo em `41773aadfff4243509fbb523d565aaaf4b51cc82`.
- Produção oficial: Cloudflare Pages Direct Upload, projeto `wicolly-site`, branch `main`.
- O workflow existente testa um artefato unificado, publica apenas a `main` e confere o SHA por `version.json` no domínio real.
- Rotas legadas relevantes: `/servicos/`, `/portfolio/`, `/veredra/`, `/blacklight3d/`, `/hefesto/`, `/poseidon/`, `/madrinha/` e `/privacidade/`.

## Arquitetura encontrada

- Páginas públicas majoritariamente estáticas, copiadas por `scripts/build-site.mjs`.
- `/portfolio/` era uma aplicação React/Vite separada, com conteúdo duplicado em TypeScript.
- Contatos parcialmente centralizados em `shared/site-config.js`.
- CSS e navegação compartilhados em `shared/`.
- Proteções existentes: validação de estrutura e segredos, verificador de links, artefato de deploy, Cloudflare Pages e smoke de produção.
- `/veredra/` é um bundle Flutter Web pré-compilado e deve permanecer isolado.

## Problemas de conteúdo

1. A apresentação atual é comercial e genérica demais; faculdade, aprendizagem, liderança acadêmica e trajetória pessoal não aparecem com clareza.
2. O portfólio legado contém exemplos não comprovados de cursos, certificados, instituições, datas e links; esses itens não podem ser publicados como credenciais reais.
3. O conteúdo está duplicado em HTML, JavaScript e TypeScript, o que já causou divergência de contatos e redes sociais.
4. O LinkedIn confirmado não está configurado em `shared/site-config.js`, embora apareça no portfólio legado.
5. Há dois telefones públicos já configurados, um para tecnologia e outro para BlackLight 3D. O formato e os links são válidos, mas a titularidade não pode ser comprovada apenas pelo repositório.
6. Não existe fotografia real de Wícolly no repositório.
7. Não existem fotografias reais de produtos BlackLight 3D no repositório. Os dois WebP encontrados são identidade visual, não fotos de peças.
8. Existem screenshots reais do CampusFlow e do Veredra; outros projetos precisam de placeholders honestos até receberem imagens.

## Problemas de produto e navegação

- Não existem `/sobre/`, `/projetos/`, estudos de caso individuais ou `/novidades/`.
- A Home não expõe atualização recente por projeto.
- Projetos experimentais e serviços contratáveis não são separados de modo consistente.
- A BlackLight possui categorias genéricas, mas não um cadastro estruturado de itens, estados, materiais, medidas ou galeria real.
- O orçamento da BlackLight não coleta os campos necessários nem monta uma mensagem completa.
- Não existe gerador local de materiais de divulgação.

## GitHub e privacidade

Visibilidade verificada em 2026-07-30:

| Repositório | Visibilidade | Política pública |
| --- | --- | --- |
| `TSWill03/Wicolly-Sites` | Público | releases e commits filtrados |
| `TSWill03/Campus_Flow` | Público | releases e commits filtrados |
| `TSWill03/Veredra` | Público | releases e commits filtrados |
| `TSWill03/LittleX` | Privado | atualizações manuais somente |
| `TSWill03/OpenClaw_LittleX` | Privado | atualizações manuais somente |

O site não deve revelar mensagens, branches, caminhos, SHAs completos ou metadados de repositórios privados. As páginas de infraestrutura devem permanecer em alto nível e não expor IPs, credenciais, topologia privada ou instruções operacionais.

## Decisão arquitetural

Manter a stack estática e substituir a duplicação de conteúdo por JSON versionado e um gerador Node.js sem framework de runtime. O build produzirá Home, Sobre, Projetos, estudos de caso, Novidades, BlackLight e currículo HTML a partir da mesma fonte. O bundle Flutter do Veredra e as rotas especiais existentes serão preservados.

## Plano de validação

- `npm ci` pelo lockfile.
- Sincronização GitHub com cache e teste de falha de rede.
- Build unificado e validação estrutural/privacidade.
- Lint/check de scripts.
- Verificação de links internos e externos.
- Testes de navegador em desktop, notebook, tablet e celulares.
- Auditoria de acessibilidade e desempenho.
- Workflow da PR, merge em `main`, deploy do artefato aprovado e smoke do domínio real pelo SHA esperado.

