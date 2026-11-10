# MeuX — site informativo e ingresso no WhatsApp (10/11/2026)

## Estado validado

- Página pública canônica: `https://wicolly.com.br/meux/`, hospedada no Cloudflare Pages `wicolly-site` a partir de `TSWill03/Wicolly-Sites` (build `npm run build`, `dist/meux`). O domínio e o QR Code foram preservados.
- O site desta branch **não tem chat web**. Primeiro componente no corpo: formulário de número WhatsApp (DDD brasileiro) e botão **Iniciar teste pelo WhatsApp**, seguido de apresentação do produto e estado de implementação.
- O formulário valida dados e exige consentimento. A página **não envia mensagens por si só nem armazena o telefone**: redireciona por `wa.me` para o WhatsApp dedicado da MeuX com solicitação pré-preenchida que o visitante precisa efetivamente enviar.
- A origem do pedido deve ser conferida pelo **remetente real autenticado pela plataforma WhatsApp**, não pelo número digitado (que é apenas uma declaração). A verificação individual por PIN/OTP **não está implementada**; não afirmar que foi enviada. A liberação de visitas ainda não é automática.
- O bridge Hermes está restrito a contatos explicitamente autorizados. Até existir implementação testada de cadastro/validação e acesso de visitantes, **nenhum visitante deve receber ferramentas ou respostas automáticas**. O botão atual é uma solicitação de ingresso, não uma autorização.

## Políticas desejadas, a implementar no CORE

1. **Proprietário:** identificador JID canônico verificado e conta isolada. Escopo ampliado apenas para ferramentas já registradas no Tool Registry/Policy Engine, com aprovações e auditoria quando necessárias. Nunca liberar shell/SSH/arquivos ou acesso irrestrito apenas com correspondência textual de número.
2. **Visitante verificado:** somente comandos explícitos de ajuda, apresentação da Little X e pesquisas públicas na web (consulta de fontes com links, taxa de uso e tempo limitado). Sem acesso a dados internos, sistema operacional/kernel, memória do proprietário, inventário, processos, servidores, terminais, sistema de arquivos ou ferramentas administrativas.
3. **Desconhecido/sem verificação:** nenhuma chamada ao AgentRuntime nem resposta automática. Identidade do remetente precisa ser conferida via WhatsApp (PN/LID/JID canônico) antes de qualquer sessão; não confiar no campo de formulário.
4. **Abuso e privacidade:** limitar solicitações por IP e telefone e tentativas de verificação, challenge anti-bot, registros mínimos com TTL, opt-in explícito, política de exclusão. Mensagens de WhatsApp iniciadas por sistema requerem avaliação das regras e do método aprovado de integração, nunca disparo irrestrito para números arbitrários.

## Requisito ainda pendente: envio automático de código

É necessário um backend HTTPS público, autenticado para operações administrativas e sem acesso direto ao runtime Little X. Deve criar PIN aleatório de curta duração, enfileirar uma tentativa para o transporte autorizado no Destruking, monitorar o envio, limitar retentativas e comprovar PIN antes de ativar o visitante. Cloudflare Worker + armazenamento persistente e Turnstile são possibilidades a testar em ambiente de staging. **Não há endpoint de OTP publicado neste lote.**

## Testes e segurança

- `npm run build`, `npm run validate`, `npm run check:links`, `npm run lint` aprovados no Destruking.
- Playwright no Chrome mobile e desktop: formulário primeiro, chat removido, telefone e DDD validados, consentimento obrigatório, link `wa.me` correto, nenhuma alegação de PIN enviado, nenhum erro JS.
- Suite `tests/meux.spec.mjs` revisada para fluxo atual, evitando testes legados do chat removido.
- Não foram alterados outros serviços do Pages, GitHub público da Little X, o CORE privado em main nem o servidor Hefesto.

## Publicação / rollback

- Origem do deploy: `.github/workflows/deploy-cloudflare-pages.yml` em `TSWill03/Wicolly-Sites`, que publica apenas `main` depois do gate completo de qualidade.
- Base de produção antes da alteração: `f5d141f4678ad96b35810e429ccd788e79113900`, Cloudflare deployment `6a206fe5-f2f5-441f-8cdd-8e5d7749af32`.
- Caso a publicação falhe, reverter especificamente `meux/index.html`, `meux/styles.css`, `meux/app.js` e `tests/meux.spec.mjs` usando um commit reversível; não executar reset/force push.
