# Deploy no Cloudflare Pages

```text
Nome do projeto: wicolly-site
Repositorio: TSWill03/Wicolly-Sites
Branch: main
Build command: npm run build
Build output directory: dist
Root directory: vazio
Dominio: wicolly.com.br
```

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
