# Deploy no Cloudflare Pages

```text
Projeto oficial: wicolly-site
Repositorio: TSWill03/Wicolly-Sites
Branch: main
Build command: npm run build
Build output directory: dist
Root directory: vazio
Dominio: wicolly.com.br
Metodo: upload direto pelo GitHub Actions
```

## Fonte oficial de produção

O domínio `wicolly.com.br` e o alias `www.wicolly.com.br` estão vinculados ao projeto `wicolly-site`. Esse projeto não possui integração Git direta: recebe somente o diretório `dist` testado pelo workflow `.github/workflows/deploy-cloudflare-pages.yml`.

O projeto antigo `wicolly-sites` continua preservado no Cloudflare para manter o histórico, porém não possui domínio personalizado. Em 25/07/2026, os deploys automáticos de produção, previews e comentários em PR foram desativados. Ele não é uma origem de produção.

O job de deploy possui a condição:

```yaml
if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
```

O checkout do job é validado contra `GITHUB_SHA`; o upload usa a branch real do evento, que precisa ser `main`. Nunca rotule conteúdo de feature branch como `main`.

Após o upload, o workflow valida `https://wicolly.com.br/version.json` e executa smoke tests no domínio real. O arquivo expõe apenas commit, data de build e branch.

## Rollback

O estado anterior foi preservado em `backup/pre-servicos-veredra-20260725-1152`. Se uma publicação crítica não puder ser corrigida, reverta a `main` com um commit rastreável baseado nesse tag e deixe o workflow republicar o estado anterior. Não use push forçado.

## Rota /blacklight3d

O projeto publica uma landing page estática em:

```text
wicolly.com.br/blacklight3d/
```

O projeto também usa Cloudflare Pages Functions para interceptar:

```text
wicolly.com.br/blacklight3d*
```

A Function está em:

```text
functions/blacklight3d/[[path]].js
```

Ela serve `/blacklight3d/`, `/blacklight3d/styles.css` e `/blacklight3d/assets/*` diretamente do build estático pelo binding `ASSETS`. Demais caminhos continuam encaminhando para `BLACKLIGHT3D_ORIGIN` ou, se a variável não existir, para:

```text
https://wp-origin.wicolly.com.br
```

Para completar a produção, crie no Cloudflare Tunnel do Hefesto um Public Hostname:

```text
Hostname: wp-origin.wicolly.com.br
Service: http://localhost
```

O Nginx do Hefesto deve então responder esse hostname e proxyar `/blacklight3d/` para `http://127.0.0.1:8085/blacklight3d/`.

Importante: `wp-origin.wicolly.com.br` é apenas hostname técnico do tunnel. No Nginx, repasse para o container:

```nginx
proxy_set_header Host wicolly.com.br;
proxy_set_header X-Forwarded-Proto https;
proxy_set_header X-Forwarded-Host wicolly.com.br;
```

A URL de uso do painel WordPress, caso a infraestrutura dinâmica esteja ativa, continua sendo:

```text
https://wicolly.com.br/blacklight3d/wp-admin/
```
