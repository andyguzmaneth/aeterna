# Scraping Difficulty Ranking

A quick assessment of how hard each target is to scrape **once** (a single,
one-time bulk pull of the catalog / dataset — not an ongoing, monitored feed).

- **Date:** 2026-06-20
- **Scope:** Tiendas EKONO, Sol Naciente, Pequeño Mundo, Universal, Cédula TSE
- **Metric:** Effort to obtain the full dataset in one pass (lower = easier).

## TL;DR ranking

| Rank | Target | Domain | Platform | Difficulty | One-shot path |
|------|--------|--------|----------|------------|----------------|
| 1 🟢 | **Cédula TSE** | `tse.go.cr` | ASP.NET forms + **bulk file** | Trivial | Download the full padrón ZIP — no scraping |
| 2 🟢 | **Universal** | `tiendauniversal.com` | **Shopify** | Very easy | `/products.json` (open, paginated) |
| 3 🟢 | **Sol Naciente** | `solnaciente.com` | **WooCommerce / WordPress** | Easy | Store REST API `/wp-json/wc/store/products` |
| 4 🟠 | **Tiendas EKONO** | `tiendasekono.com` | **VTEX** (inferred) | Moderate–hard | VTEX catalog API, but heaviest WAF |
| 5 🟠 | **Pequeño Mundo** | `tienda.pequenomundo.com` | **Magento** | Moderate–hard | No open JSON API; parse HTML + paginate |

> Difficulty is driven less by raw page count than by **(a)** whether the
> platform exposes a clean JSON catalog endpoint and **(b)** how aggressive the
> edge/anti-bot layer is.

## Scoring dimensions

Each target is judged on:

1. **Data access shape** — open JSON API vs. HTML-only parsing vs. bulk file.
2. **Anti-bot posture** — WAF / Cloudflare / CAPTCHA / rate limits.
3. **Pagination & volume** — how mechanical it is to walk the whole catalog.
4. **Stability** — how brittle a one-time scraper would be.

## Per-target detail

### 1. Cédula TSE — 🟢 Trivial

The Tribunal Supremo de Elecciones publishes the **entire electoral roll as a
single downloadable file** (`padron_completo.zip` → `PADRON_COMPLETO.txt`,
~3.5M records). This makes "scraping" unnecessary — one HTTP download yields the
whole dataset. Per-record lookups also exist via plain ASP.NET WebForms
endpoints (`consulta_cedula.aspx`, `consulta_nombres.aspx`), and open-source
wrappers already exist (e.g. `guntanis/padron`).

- **Access shape:** bulk flat file (best case).
- **Anti-bot:** none on the bulk file.
- **Effort:** minutes.

> ⚠️ **Legal/privacy:** this is national-ID / personal data governed by Costa
> Rican data-protection law (Ley 8968). Technically easy, but the easiest target
> here is also the only one with serious legal/ethical weight. Treat separately
> from the commercial sites and confirm a lawful basis before collecting/storing.

### 2. Universal (`tiendauniversal.com`) — 🟢 Very easy

The consumer store is **Shopify** (URL fingerprints: `/collections/...`,
`/pages/express`). Shopify exposes the open, undocumented-but-stable
`/products.json` endpoint (and `/collections/<handle>/products.json`), returning
clean paginated JSON at up to 250 products/page with no auth. This is the
gold-standard "easy scrape."

- **Access shape:** open JSON (`/products.json`).
- **Anti-bot:** generally light on `/products.json`.
- **Effort:** low; a few dozen lines.
- *Note:* the wholesale/bookstore brand also appears under `libreriauniversal.com`
  / `libreriainternacional.com`; the scrapeable retail catalog is `tiendauniversal.com`.

### 3. Sol Naciente (`solnaciente.com`) — 🟢 Easy

**WooCommerce on WordPress** (slugs: `categoria-producto/`, `tiendavirtual/`).
Pages are server-rendered HTML, and WooCommerce typically exposes the public
Store API (`/wp-json/wc/store/products?per_page=100&page=N`) returning JSON
without auth. Fallback is straightforward HTML parsing of category pages.

- **Access shape:** open JSON Store API (if not disabled), else clean HTML.
- **Anti-bot:** typically light; smallest stack of the retailers.
- **Effort:** low.

### 4. Tiendas EKONO (`tiendasekono.com`) — 🟠 Moderate–hard

Strongly inferred to be **VTEX** (VTEX dominates Costa Rican enterprise retail;
EKONO relaunched a "world-class, AI-personalized, secure" platform and is cited
in VTEX case-study material). VTEX *helps* — the public catalog API
(`/api/catalog_system/pub/products/search?_from=0&_to=49`) returns clean JSON in
50-item windows. **But** VTEX storefronts are modern SPAs and EKONO markets a
"secure" platform, so expect the most aggressive edge/WAF and rate-limiting of
this set; a one-time run needs realistic headers and throttling.

- **Access shape:** open JSON catalog API (50/page window).
- **Anti-bot:** likely heaviest (WAF + rate limits) — *inferred, not measured*.
- **Effort:** low-to-moderate code; risk is the edge layer, not the parsing.

### 5. Pequeño Mundo (`tienda.pequenomundo.com`) — 🟠 Moderate–hard

**Magento** (fingerprints: `/checkout/cart/`, `.html` catalog pages like
`liquidaciones.html`, `suministros.html`, `tienda.` subdomain). Catalog pages
are server-rendered HTML, which is good, but Magento exposes **no open JSON
product API by default** (the REST catalog endpoints generally require auth), so
you parse HTML and walk pagination (`?p=N`). More brittle and more manual than
the JSON-API targets, even if anti-bot is usually moderate.

- **Access shape:** HTML-only (no free JSON catalog).
- **Anti-bot:** typically moderate.
- **Effort:** moderate; most parsing/maintenance work of the retailers.

## Methodology & caveats

- **Fingerprints** come from URL-structure tells (Shopify `/collections`,
  WooCommerce `categoria-producto`, Magento `/checkout/cart` + `.html`) and
  public search results, **not** a live header/DOM probe.
- **Live probing was not possible from this environment.** The execution
  sandbox enforces a network egress allowlist, and both raw `curl` and the
  fetch tool were blocked (HTTP 403 / "host not in allowlist") for every target
  and for third-party profilers (BuiltWith). Anti-bot posture for the retailers
  is therefore **inferred from platform norms, not measured**.
- **Confidence:** Universal/Shopify, Sol Naciente/WooCommerce, Pequeño
  Mundo/Magento, and TSE = high. EKONO/VTEX = medium-high.
- **To verify properly**, run from an unrestricted network: check response
  headers + `robots.txt`, hit `/products.json` (Universal),
  `/wp-json/wc/store/products` (Sol Naciente),
  `/api/catalog_system/pub/products/search` (EKONO), and inspect a Magento
  category page's pagination (Pequeño Mundo).

## Sources

- TSE consulta por cédula — https://servicioselectorales.tse.go.cr/chc/consulta_cedula.aspx
- TSE padrón bulk download / API project — https://github.com/guntanis/padron
- Universal store (Shopify) — https://tiendauniversal.com/collections/libros-1
- Sol Naciente (WooCommerce) — https://solnaciente.com/tiendavirtual/
- Pequeño Mundo (Magento) — https://tienda.pequenomundo.com/checkout/cart/
- Tiendas EKONO virtual store launch — https://ekaenlinea.com/tiendas-ekono-lanza-nuevo-sitio-de-compras/
