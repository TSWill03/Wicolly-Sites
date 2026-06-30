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

## Rota dinâmica /blacklight3d

O projeto usa Cloudflare Pages Functions para interceptar:

```text
wicolly.com.br/blacklight3d*
```

A Function está em:

```text
functions/blacklight3d/[[path]].js
```

Ela encaminha para `BLACKLIGHT3D_ORIGIN` ou, se a variável não existir, para:

```text
https://wp-origin.wicolly.com.br
```

Para completar a produção, crie no Cloudflare Tunnel do Hefesto um Public Hostname:

```text
Hostname: wp-origin.wicolly.com.br
Service: http://localhost
```

O Nginx do Hefesto deve então responder esse hostname e proxyar `/blacklight3d/` para `http://127.0.0.1:8085/blacklight3d/`.
