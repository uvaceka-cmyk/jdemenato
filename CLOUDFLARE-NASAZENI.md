# Nasazení Zakly na Cloudflare (vlastní účet)

Web běží na frameworku **vinext** (Next.js API na Vite) a nasazuje se jako
Cloudflare Worker s D1 databází. Přihlašování je teď vlastní (e-mail +
heslo), nezávisí na žádné externí platformě.

## Co budeš potřebovat

- Node.js 22.13 nebo novější
- účet na [cloudflare.com](https://cloudflare.com) (stačí zdarma)
- nainstalované `pnpm` (`npm install -g pnpm`)

## Postup krok za krokem

1. **Nainstaluj závislosti**
   ```bash
   pnpm install
   ```

2. **Přihlas se do Cloudflare přes Wrangler**
   ```bash
   npx wrangler login
   ```
   Otevře se prohlížeč, potvrď přístup.

3. **Vytvoř D1 databázi**
   ```bash
   npx wrangler d1 create jdemnato-d1
   ```
   Příkaz vypíše `database_id`. Zkopíruj ho do `wrangler.jsonc`
   místo `REPLACE_AFTER_WRANGLER_D1_CREATE`.

4. **Spusť databázové migrace na produkční D1** (v pořadí 0000 až 0008)
   ```bash
   for f in drizzle/0*.sql; do
     npx wrangler d1 execute jdemnato-d1 --remote --file="$f"
   done
   ```

5. **Vyzkoušej lokálně** (volitelné, ale doporučené)
   ```bash
   pnpm dev
   ```
   Otevři http://localhost:5173, zkus registraci účtu a projdi klíčové
   stránky (nabídka práce, poptávka, registrace dodavatele).

6. **Nasaď na Cloudflare**
   ```bash
   pnpm deploy
   ```
   (spustí `vinext build` a `wrangler deploy`). Wrangler vypíše veřejnou
   adresu tvaru `https://jdemnato.<tvůj-subdomain>.workers.dev` — to je
   veřejná URL webu bez vlastní domény, na kterou se lze rovnou podívat.

## Později — vlastní doména

Až budeš mít doménu a bude spravovaná přes Cloudflare, přidáš do
`wrangler.jsonc` sekci `routes` a doménu napojíš přes Cloudflare Dashboard
nebo `wrangler`. Zatím web plně funguje na `workers.dev` adrese.

## Důležité před ostrým spuštěním

- doplnit identifikaci a kontaktní údaje provozovatele v právních textech,
- rozhodnout o ceně předplatného a vybrat platební bránu,
- napojit automatické ověřování IČO/subjektů,
- nechat právní texty zkontrolovat podle skutečného provozu,
- zvážit e-mailové notifikace (potvrzení registrace, reset hesla) — v MVP
  zatím není reset zapomenutého hesla, jen registrace a přihlášení.

Platby zákazníků za zakázky přes Zakly neprobíhají. Budoucí platba se
týká pouze měsíčního přístupu dodavatelů ke kontaktům.
