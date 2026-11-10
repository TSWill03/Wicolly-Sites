## MundoFit X — apresentação de 10/11/2026

Página pública não indexada `/mundofit/` (aliases `/MundoFit` e `/MundoFit/`). A página **não aparece** na navegação, homepage, mapa de projetos ou sitemap; URL conhecida continua acessível sem autenticação. Não armazenar dados pessoais. O protótipo de roteiro em `mundofit/app.js` é uma simulação determinística no navegador, **não é uma integração com LLM nem editor de vídeo**. O arquivo selecionado só aparece na prévia local, não é enviado.

A referência funcional do app Windows é `TSWill03/x-assistant` e a versão local `MundoFit X 0.7.1 - Corrigido`; o conceito de laboratório separado do CORE segue o padrão da rota `/meux/`. Recursos reais: conversa Ollama local, voz e comandos allowlist, ainda pendentes testes em campo com Diógenes. Edição FFmpeg, legendagem, redes sociais, Drive e publicação não estão implementados.

A página usa CSP própria, X-Robots-Tag e `robots.txt`, mas **não constitui controle de acesso**. Confirme o cabeçalho no domínio após deploy. Para validação: `npm run build`, `npm run test:browser -- tests/mundofit.spec.mjs`, `npm test`; conferir desktop/mobile e console. Deploy normal somente pelo workflow do GitHub na `main` após aprovação dos checks. Rollback: revert do commit.
