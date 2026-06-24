# Deploy no Cloudflare Pages

Este documento registra a configuração dos sites públicos do ecossistema Wicolly no Cloudflare Pages.

## Arquitetura

```text
Cloudflare Pages
├── wicolly.com.br
│   └── TSWill03/Wicolly-Sites/main
├── hefesto.wicolly.com.br
│   └── TSWill03/Wicolly-Sites/hefesto
├── poseidon.wicolly.com.br
│   └── TSWill03/Wicolly-Sites/poseidon
└── portfolio.wicolly.com.br
    └── TSWill03/Portifolio
```

Os serviços SSH, APIs, jogos e aplicações que realmente executam nos servidores continuam utilizando Cloudflare Tunnel quando necessário.

## Pré-requisitos

* domínio `wicolly.com.br` administrado pela Cloudflare;
* repositório `TSWill03/Wicolly-Sites` disponível no GitHub;
* repositório `TSWill03/Portifolio` disponível no GitHub;
* integração do Cloudflare Pages autorizada no GitHub;
* arquivos `index.html` presentes nas pastas `main`, `hefesto` e `poseidon`.

---

# Projeto 1 — Site principal

## Configuração

```text
Nome do projeto: wicolly-main
Repositório: TSWill03/Wicolly-Sites
Branch de produção: main
Framework preset: None
Diretório raiz: main
Comando de build: vazio
Diretório de saída: .
```

Caso o painel obrigue um comando de build, use:

```text
exit 0
```

## Domínios personalizados

```text
wicolly.com.br
www.wicolly.com.br
```

## Endereço temporário esperado

```text
https://wicolly-main.pages.dev
```

---

# Projeto 2 — Hefesto

## Configuração

```text
Nome do projeto: wicolly-hefesto
Repositório: TSWill03/Wicolly-Sites
Branch de produção: main
Framework preset: None
Diretório raiz: hefesto
Comando de build: vazio
Diretório de saída: .
```

Caso o painel obrigue um comando de build:

```text
exit 0
```

## Domínio personalizado

```text
hefesto.wicolly.com.br
```

## Endereço temporário esperado

```text
https://wicolly-hefesto.pages.dev
```

---

# Projeto 3 — Poseidon

## Configuração

```text
Nome do projeto: wicolly-poseidon
Repositório: TSWill03/Wicolly-Sites
Branch de produção: main
Framework preset: None
Diretório raiz: poseidon
Comando de build: vazio
Diretório de saída: .
```

Caso o painel obrigue um comando de build:

```text
exit 0
```

## Domínio personalizado

```text
poseidon.wicolly.com.br
```

## Endereço temporário esperado

```text
https://wicolly-poseidon.pages.dev
```

---

# Projeto 4 — Portfólio

## Configuração

```text
Nome do projeto: wicolly-portfolio
Repositório: TSWill03/Portifolio
Branch de produção: master
Framework preset: Vite
Diretório raiz: vazio
Comando de build: npm run build
Diretório de saída: dist
```

## Domínio personalizado

```text
portfolio.wicolly.com.br
```

## Endereço temporário esperado

```text
https://wicolly-portfolio.pages.dev
```

---

# Ordem recomendada para publicação

Para cada projeto:

1. Conecte o repositório ao Cloudflare Pages.
2. Configure a branch, o diretório raiz e os campos de build.
3. Faça o primeiro deploy.
4. Teste o endereço `pages.dev`.
5. Confirme que o site e os recursos carregam corretamente.
6. Somente depois associe o domínio personalizado.
7. Remova registros DNS ou rotas antigas que estejam em conflito.

Não remova rotas antigas antes de testar o endereço `pages.dev`.

---

# Adicionar domínio personalizado

Dentro do projeto do Cloudflare Pages:

```text
Workers & Pages
→ Projeto
→ Custom domains
→ Set up a domain
```

Informe o domínio correspondente ao projeto.

Não basta criar manualmente um registro CNAME. O domínio deve primeiro ser associado ao projeto pela área de `Custom domains`.

Se já existir um registro `A`, `AAAA` ou `CNAME` com o mesmo hostname, faça backup e remova apenas o registro conflitante.

## Rotas antigas que podem ser removidas após a migração

Quando os projetos Pages estiverem funcionando:

```text
wicolly.com.br
www.wicolly.com.br
portfolio.wicolly.com.br
hefesto.wicolly.com.br
poseidon.wicolly.com.br
```

Esses hostnames não precisam mais apontar para os Cloudflare Tunnels dos servidores.

## Rotas que devem ser preservadas

Exemplo:

```text
poseidon-ssh.wicolly.com.br
```

Também devem ser preservadas rotas de:

* APIs;
* Minecraft;
* painéis privados;
* serviços internos;
* aplicações que realmente executam nos servidores.

---

# Atualizações futuras

Depois que a integração Git estiver configurada, cada `push` na branch de produção causará um novo deploy.

```powershell
git add .
git commit -m "chore: atualizar sites"
git push
```

O repositório `Wicolly-Sites` pode gerar três deploys separados, um para cada projeto conectado.

---

# Testes

## Testar os endereços do Pages

```powershell
curl.exe -I https://wicolly-main.pages.dev
curl.exe -I https://wicolly-hefesto.pages.dev
curl.exe -I https://wicolly-poseidon.pages.dev
curl.exe -I https://wicolly-portfolio.pages.dev
```

## Testar os domínios finais

```powershell
curl.exe -I https://wicolly.com.br
curl.exe -I https://www.wicolly.com.br
curl.exe -I https://portfolio.wicolly.com.br
curl.exe -I https://hefesto.wicolly.com.br
curl.exe -I https://poseidon.wicolly.com.br
```

O resultado esperado é uma resposta HTTP válida, normalmente:

```text
HTTP/2 200
```

---

# Solução de problemas

## Página 404

Verifique:

* se o diretório raiz está correto;
* se existe `index.html` na pasta;
* se o diretório de saída está como `.`;
* se o deploy foi feito usando a branch correta.

## Projeto principal mostrando outra página

Confira se o projeto `wicolly-main` usa:

```text
Diretório raiz: main
```

## Hefesto ou Poseidon mostrando o site principal

Confirme os diretórios:

```text
wicolly-hefesto → hefesto
wicolly-poseidon → poseidon
```

## Domínio não ativa

Verifique:

* registros DNS conflitantes;
* rota antiga no Cloudflare Tunnel;
* domínio associado ao projeto correto;
* status do certificado;
* configuração dos nameservers;
* eventuais registros CAA.

## Portfólio sem CSS ou imagens

Verifique:

* resultado de `npm run build`;
* conteúdo da pasta `dist`;
* configuração de `base` no Vite;
* caminhos absolutos dos arquivos;
* erros no console do navegador.

---

# Checklist

* [ ] `wicolly-main.pages.dev` funcionando
* [ ] `wicolly-hefesto.pages.dev` funcionando
* [ ] `wicolly-poseidon.pages.dev` funcionando
* [ ] `wicolly-portfolio.pages.dev` funcionando
* [ ] `wicolly.com.br` associado
* [ ] `www.wicolly.com.br` associado
* [ ] `portfolio.wicolly.com.br` associado
* [ ] `hefesto.wicolly.com.br` associado
* [ ] `poseidon.wicolly.com.br` associado
* [ ] rotas antigas conflitantes removidas
* [ ] rota SSH do Poseidon preservada
* [ ] HTTPS válido em todos os domínios
* [ ] links entre os sites testados
