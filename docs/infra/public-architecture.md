# Arquitetura pública

```text
visitante
  -> Cloudflare
     -> Pages wicolly-site (site estático + Function do Veredra)
     -> Tunnels separados (serviços operacionais autorizados)
```

O domínio principal e `www` pertencem ao Pages `wicolly-site`. `main` é a única branch de produção. O artefato testado carrega `version.json` com SHA, branch e horário.

O Veredra permanece em `/veredra/`, com base path, assets, fallback de navegação e service worker isolados. A BlackLight passa a ser totalmente estática no Pages. Painéis e serviços internos não devem ser expostos pela navegação pública.
