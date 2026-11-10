## MundoFit X — apresentação à Mundo Fit Goiás (10/11/2026)

### Escopo e publicação
Página pública não indexada `/mundofit/` (aliases `/MundoFit` e `/MundoFit/`) no domínio `wicolly.com.br`. Não existe link na homepage, na navegação ou no sitemap. A URL é acessível a quem a conhece: **noindex não equivale a proteção por senha**. A apresentação é conceitual, **não é um site oficial da loja**.

### Pesquisa da empresa e separação entre fatos e hipóteses
- Empresa identificada: **Mundo Fit Goiás**, em **Goiatuba/GO**, endereço **Rua Mato Grosso, 2063, Vila Esperança**. Confirmado pelos registros [CNPJ Biz](https://cnpj.biz/40685001000131), [B2B Leads](https://b2bleads.com.br/empresa/mundo-fit-goias-gtba-ltda-40685001000131) e por anúncio da loja no [jornal Plural Notícias](https://jornal.pluralnoticias.com.br/208.pdf).
- Ramo confirmado: **comércio de suplementos/produtos alimentícios**. O cadastro também apresenta **vestuário/acessórios, artigos esportivos e calçados** como atividades econômicas secundárias. **CNAE não comprova estoque atual**.
- Sócio-administrador registrado: **Diógenes Rodrigues Cardoso**, presente nas fontes cadastrais. O nome do cliente não é exposto desnecessariamente na página.
- Há divergência entre fontes públicas quanto a telefone comercial e situação cadastral. Não incluir telefone, situação jurídica, preços ou horários sem confirmação do proprietário.
- Não foi encontrado e autenticado com segurança um perfil oficial atual no Instagram, nem catálogo, tabela de preços, fotos da fachada ou logo com autorização de uso. A marca visual `MF+`, os rótulos e embalagens na ilustração são **conceitos originais de demonstração**, não reproduções do logotipo/produtos reais.

### Nova experiência
A página é centrada **na loja**, não apenas no software: identidade editorial própria da Mundo Fit Goiás, ramo real, endereço, exemplos de campanhas para vitrine, informação de rótulo e bastidores; botões de pautas preenchem o briefing de vídeos verticais de **45 segundos**. O roteiro gera 3 cenas e legenda, com cópia e download `.txt`. Todos os dados digitados são processados no navegador; os arquivos de vídeo são apenas visualizados por `blob:`, sem transferência, edição ou publicação. Não há alegações médicas nem preços automáticos. CSS responsivo, acessibilidade básica e CSP `connect-src 'none'`.

### Separação de capacidades
- Aplicativo Windows **MundoFit X 0.7.1**: executável local, Ollama/Qwen empacotados, Vosk/Whisper, TTS, comandos de allowlist; testes de fala humana e no computador do cliente ainda são necessários.
- Laboratório Web: **roteirizador determinístico**, sem chamada a modelo LLM. Não está ligado à instalação local, ao WhatsApp ou às contas da loja.
- Cortes automáticos FFmpeg, legendagem, exportação de Reels, Instagram e Google Drive são **etapas futuras**, sujeitas a projeto, autorização e testes reais.

### Testes, publicação e rollback
- `node --check mundofit/app.js`
- `npm run build`, `npm run validate`, `npm run lint`, `npm run check:links`.
- `npx playwright test tests/mundofit.spec.mjs` — cinco casos por projeto (layout 320–1366px, scripts por pauta, validação, download, vídeo local, isolamento da rota).
- `npm test` — suíte integrada, CI e deploy GitHub Actions na `main` após aprovação.
- Monitorar headers HTTP reais no Cloudflare Pages: `X-Robots-Tag` e CSP. Não adicionar caminho à homepage ou sitemap.
- Rollback sem perda de dados: `git revert` do commit da alteração e novo deploy da `main`.
