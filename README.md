# Zakly MVP

Český inzertní a vyhledávací portál propojující zaměstnání, zakázky a dodavatele. Portál není agenturou práce, nepřebírá životopisy, nevybírá kandidáty ani dodavatele a nevstupuje do ceny, smlouvy nebo platby za zakázku.

## Funkce

- veřejné nabídky práce a jejich detail s expirací,
- JobPosting strukturovaná data pouze na detailu aktivní nabídky,
- veřejné zadání poptávky bez účtu,
- bezplatná startovní registrace dodavatele a přístup ke kontaktům,
- registrace zaměstnavatele a správa pracovních inzerátů,
- vlastní registrace a přihlášení e-mailem a heslem (heslo se ukládá jako PBKDF2 hash, nikdy v čitelné podobě),
- D1 databáze pro profily, pracovní nabídky, poptávky a evidenci přístupů,
- právní patička a souhlas s cookies bez spuštění volitelných trackerů před souhlasem.
- profil uchazeče s řízenou viditelností kontaktu pro zaměstnavatele,
- kontrola formátu a kontrolní číslice českého IČO a stav následného ověření,
- hodnocení dodavatelů navázané na skutečně zpřístupněný kontakt a pořadí podle hodnocení,
- veřejný seznam dodavatelů a zpětná vazba k portálu,
- připravené stavy bezplatného startu a budoucího měsíčního předplatného dodavatelů.

## Lokální spuštění

Vyžaduje Node.js 22.13 nebo novější.

```bash
pnpm install
pnpm db:generate
pnpm dev
```

Kontrola projektu: `pnpm test`.

## Před ostrým spuštěním

Doplňte identifikaci provozovatele, skutečný kontaktní e-mail, finální doménu a nechte právní texty zkontrolovat českým právníkem. Měsíční předplatné dodavatelů je připravené jako budoucí obchodní model; startovní režim je zdarma a platby mezi zákazníkem a dodavatelem nikdy neprocházejí portálem.
