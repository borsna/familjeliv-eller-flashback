# Familjeliv eller Flashback

Gissa om en slumpad mening kommer från forumet Familjeliv eller Flashback.

<a href="https://borsna.github.io/familjeliv-eller-flashback"><img src="https://img.shields.io/badge/%E2%96%B6%20%20SPELA%20NU-46B6AC?style=for-the-badge" alt="Spela nu" height="80"></a>

## Så fungerar det

1. Tryck på *Starta*.
2. Läs meningen och gissa vilket forum den kommer från.
3. Du får direkt se om du hade rätt eller fel, och poängen räknas upp.

Tangentbordsgenvägar: **A** = Familjeliv, **B** = Flashback.

## Källa för meningar

Meningarna hämtas från [Korp](https://spraakbanken.gu.se/korp/), Språkbankens söktjänst, via [Korps API (v8)](https://ws.spraakbanken.gu.se/ws/korp/v8/). Ett antal meningar är förladdade i `assets/js/preloaded.js`, och nya hämtas i bakgrunden och sparas i webbläsarens `localStorage`.

[![Språkbanken](assets/img/sb-logo.png "Språkbanken")](https://spraakbanken.gu.se)

## Teknik

- Ren HTML, CSS och JavaScript, utan byggsteg
- [Bootstrap 5](https://getbootstrap.com/) och Bootstrap Icons (laddas från CDN)
- Responsiv, mobilanpassad design

## Köra lokalt

Det finns inget att bygga. Starta valfri statisk webbserver i projektmappen, till exempel:

```sh
python3 -m http.server 8000
```

Öppna sedan <http://localhost:8000>.

## Skapat av

[Olof Olsson](https://twitter.com/borsna) och [Robin Kahlbom](https://twitter.com/Kringelbagaren)

## Licens

[MIT](LICENSE)
