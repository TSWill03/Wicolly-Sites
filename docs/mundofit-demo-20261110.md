# MundoFit Goiás — pesquisa de marca, fontes e entrega (09/11/2026)

## Escopo
Página de apresentação **não oficial, não indexada**, em `/mundofit/`. A identidade antes existente (verde limão e logotipo inventado `MF+`) foi rejeitada pelo usuário, pois não corresponde à marca. A página foi reconstruída com referências reais do Instagram e Linktree. Não se trata de um site contratado e publicado em domínio do cliente: é uma demonstração técnica de apresentação em `wicolly.com.br`.

## Identidade e conteúdo realmente verificados

| Tipo | Evidência pública | Aplicação |
| --- | --- | --- |
| Instagram oficial | [@mundofitgoias](https://www.instagram.com/mundofitgoias/), título “MundoFit Suplementos”, com vínculo cruzado no Linktree | Referência prioritária de identidade, campanhas e tom de voz |
| Logotipo | [Avatar de marca no Linktree oficial](https://linktr.ee/Mundofitgoias) e foto de perfil Instagram | Logotipo original: silhueta de atleta com halter e globo, lettering preto e detalhes vermelhos em fundo branco |
| Paleta observada | Avatar e posts originais em preto, branco e vermelho | Base preta e branca, `#e51b23` vermelho editorial aproximado (não alegar hexadecimal oficial de manual) |
| Loja e canais | [Linktree oficial](https://linktr.ee/Mundofitgoias) | Goiatuba/GO, Instagram, [TikTok](https://www.tiktok.com/@mundofitgoias), WhatsApp vinculado, Google Maps |
| Endereço | Linktree oficial e [dados cadastrais do CNPJ](https://maiscnpj.com.br/cnpj/40685001000131-mundo-fit-goias-gtba-ltda) | Rua Mato Grosso, 2063 — Vila Esperança, Goiatuba/GO |
| Ramo e bio | Perfil diz “Suplementos a pronta entrega”, “Preço de internet” e “16 anos de experiência” | Textos atribuídos ao próprio perfil, não verificação independente de estoque, preço, prazo ou qualificações |
| Post motivacional | [Instagram /DfRqjQ5lm6P/](https://www.instagram.com/mundofitgoias/p/DfRqjQ5lm6P/) | Foto original com tipografia editorial forte em branco/vermelho sobre fundo preto e mascote ilustrado |
| Post de saúde | [Instagram /DfQCI_YiZyo/](https://www.instagram.com/mundofitgoias/p/DfQCI_YiZyo/) | Foto e composição reais para hero, com crédito e vínculo à publicação |
| Reel da loja | [Instagram /DfFRIjixJcT/](https://www.instagram.com/mundofitgoias/reel/DfFRIjixJcT/) | Fotograma de prateleiras/estoque reais, sem alegar processamento de vídeo no laboratório |
| Voz de marca | Caption do Reel /DfFRIjixJcT/, 29/10/2026 | Linguagem direta, pessoal, orientação sobre procedência, autodenominação “Paizão MundoFit” |
| Contato formal | CNPJ cadastral | Atividade de suplementação; outras atividades cadastradas não são prova de estoque |

**Limites de identificação:** A pessoa apelidada de **“Jorginho”** não foi identificada/confirmada nos materiais consultados. Não associar pessoa ou rosto a nome não verificado; a persona de comunicação é **tom da marca**, não cadastro biométrico de indivíduo. “Paizão MundoFit” é assinatura pública da marca e não confirmação da identidade civil.

**Direitos:** Fotografias/logotipo no protótipo são cópias locais de referências publicamente exibidas pela própria loja e estão vinculadas às URLs originais. Para qualquer campanha comercial ou uso em domínio do cliente, obter aprovação do titular e dos responsáveis por imagem de pessoas e marcas. Não utilizar mídia de terceiros do feed como se fosse autoria da loja; selecionar apenas posts do perfil @mundofitgoias.

## Arquivos e provas
- Origem e capturas preservadas no Destruking em `D:\Wicolly\MundoFit-Site-Release-20261109\output\mundofit-reference-20261109\`. Há screenshots `instagram-feed-raw.png`, `linktree-full.png`, 22 imagens de perfil/posts `instagram-assets/`, `posts-details.json`, `brand-social-research.json`, `browser-research.json` e `selected-assets-manifest.json` com fonte e SHA-256.
- Arquivos selecionados versionados para a demonstração em `mundofit/assets/`: `logo-mundofit-goias-oficial.jpg`, `post-mundofit-inicio-saudavel.jpg`, `post-mundofit-comece-pelo-possivel.jpg`, `reel-mundofit-loja-suprimentos.jpg`. As capas são **fotogramas e fotos reais**, não imagens de IA.
- Recomendação de design das skills locais `frontend-design` e `web-design-guidelines`: identidade ancorada na fonte, tipo condensado alto contraste com moderação, navegação sem distrações, CTA explícita, layout visualmente inspecionado, foco acessível, sem movimento desnecessário.

## Funcionamento e limitações
- `mundofit/app.js` cria um **roteiro determinístico** de 45 segundos no navegador e permite copiá-lo ou salvar `.txt`; quatro pautas correspondem a suplementos, rotulagem, bastidores e novidade/marca própria, a confirmar com a loja.
- O `video` usa `URL.createObjectURL`, não faz upload ou edição, aceita formatos suportados de até 500 MB.
- A Web não usa nem representa o modelo IA Windows. **MundoFit X 0.7.1** instalado localmente usa Ollama/Qwen e voz, mas precisa de microfone/testes reais no ambiente do cliente.
- Editor FFmpeg, legendagem, renderização e publicação futura **não implementados**.

## Proteções e lançamento
- Não adicionar `/mundofit/` no menu público, home ou sitemap. `robots.txt`, `meta noindex`, `X-Robots-Tag`, CSP própria com `connect-src 'none'`. Não é acesso autenticado: URL conhecida continua pública.
- Testar `npm run build`, `npm run validate`, `npm run lint`, `npm run check:links`, `npx playwright test tests/mundofit.spec.mjs` e `npm test`. Provar responsividade 320–1366, mídia real, rotas e erros de JS; acompanhar CI GitHub antes de merge.
- Produção apenas via PR com checks verdes, merge sem force push na `main`, e verificação de Cloudflare Pages `wicolly-site` após deploy. Reverter via novo `git revert` se necessário.
