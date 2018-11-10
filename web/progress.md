
# Poznámky (přetavit do checklistů)

- Widgety (viz hledání konstanty WWW).
- Integrace zbytku větve redesign homepage (tj. další stránky).
- Scroll-sneak pro admin (pro budoucí refreshe stavů aktivit, z public webu vymazán).
- Nice to have: ročníkový styl, viz https://trello.com/c/iK34SHYX/324-neutr%C3%A1ln%C3%AD-vzhled-webu. Podle toho, jestli Martin bude chtít nějaký dělat.
- Modul::bezMenu (je potřeba?)
- Do nastaveni-local (tj. osobní neverzované) vložena cesta gamecon-redesign-development, dát do defaultu či ne?
- Je potřeba mít bootstrap lokálně nebo stačí includnout css z cdn?
- modul ajax-omnibox (může se používat z adminu, ověřit)
- modul ajax-vyjimkovac (asi je potřeba pro logování výjimek, ověřit, rozjet výjimkovač celkově)
- _modul odhlas-z-mailu - imho od zavedení mailchimpu nechceme_
- modul rss?
- modul sponzoři? existoval, ale možná nevyužijeme nyní (nebo uděláme jinak, nebo widget/komponent)

- Stránky:
    - aktivity
    - blog
    - finance
    - novinky
    - program
    - registrace
    - přihláška
    - statická stránka obecně
    - zapomenuté heslo

- deployment, aby šel ukazovat postup

# Epic: Přeskinování

- [ ] stránka: titulka
    - [x] hello world zobrazení
    - [x] chceme bootstrap? -- ne. Viz dodatek A.
    - [ ] asset manager
        - [x] první funkční nástřel
        - [x] asset-url dávat spíš relativní k aktuálnímu souboru (zvážit)
            > JJEL: No, to bych očakával, že je relatívne k stávajucemu súboru.
        - [x] povolovací soubory kvůli sestavování
            - [x] samotné povolování
            - [x] buildění povolených
            - [x] pro otestování bude nutné mít nějaké testovací sassy a assety
        - [x] předělat do balíčku
        - [x] nainstalovat a nacommitovat změny v GC repu
        - [ ] includování v sassech (kvůli ověřování časů. Než bude, includovat v php)
    - [ ] deployment na redesign.gamecon.cz
        - [ ] sestavování a určení složek nahrávaných na FTP
        - [ ] zaheslovat vstup, jinak je to ghey
    - [ ] watcher
        - při změně souborů reloadnout prohlížeč - imho by šel udělat skriptík, otázka jestli dělat do asset manageru (viz také hodně speciální distro / tools kombinaci), ale v principu má linux geniálně jednoduché [api přes inotify](https://stackpointer.io/unix/linux-monitor-file-system-changes/397/).
    - [ ] přejmenovat složky do češtiny
    - [ ] pořešit velké soubory
        - Obecně je to spíš průšvih, cover fotka má půl mega a bude se tipuji měnit. To v repu nechceš. Stejně tak je otázka, jestli to zapékat do sassu. Možná dát symlink styl/foo.jpg -> grafika/foo.jpg?
        - symlinky v gitu / apache / ftp můžou fungovat všelijak
        - zapečením rozumíme kopii do složky assetů svázanou s konkrétní verzí stylů
        - prozatím necommituji velké soubory
        - [ ] rozhodnout, jak to řešit
        - [ ] projít co je a není commitnuté
        - [ ] zkomprimovat, nakopírovat co je kde potřeba
        - [ ] napsat a nacommitovat řešení, nacommitovat soubory, které mají být commitnuté
            - [ ] pořešit deployment skript (zejména ne/ignore soubory pro ftp)
    - [ ] odladit chyby v JS konzoli
    - [ ] vyhledat a pořešit TODOs (případně co jde a udělat nový bullet point na TODOs)
    - [ ] projít kód titulka.xtpl
    - [ ] odjebat infopruh do databáze
        - možná widget "odpočet" nebo něco tak?
        - pozor, zatím není nový návrh
    - [ ] fonty - projít, které potřebujeme, zbytek vyhodit (do té doby necommitovat)
        - martin asi bude měnit, počkat
    - [ ] porovnat s ref. screenshotem
        - Pozor na to, že hodně věcí se odvozuje od šířky obrazovky a referenční screeny jsou pro 1920.
        - [ ] aktivity by imho spíš měly na titulce a ve výpisu vypadat stejně. Nebo dafuq? Probrat s martinem.
    - [ ] masonry? Prověřit. Viz také co výpis aktivit. -- prozatím ne a uvidí se, jak mají aktivity vypadat
    - [ ] menu
    - [ ] validovat výsledek
        - [ ] s Martinem
        - [ ] určit validátory z GC týmu
        - [ ] s validátory z GC týmu
        - ... zde přibudou požadované úpravy

- [ ] co říct na sraze
    - ideální mít už funkční deployment
    - "asi se to nestihne, ale konzultace a náhled bude průběžný na {deploymentUrl} a {trelloKarta}" -- probrat se Shakem

- [ ] předělat věci ze záhlaví na checklist níž

- [ ] stránka: výpis linie

- [ ] stránka: dynamická stránka z databáze

- [ ] stránky: přihláška + registrace
    - přeskinovat stávající řešení

- [ ] stránka: program
    - viz epic, budeme řešit

- [ ] stránky: blog, novinky
    - nemá žádnou prioritu - řešit později / nakonec

# Epic: Program

Po dokončení přeskinování (bez programu) budeme vědět, jak rychle dokážeme postupovat a kolik času nám zbývá. Podle toho jsou na stole následující možnosti, resp. škála (jsou i možnosti mezi):

- Zachovat stávající backend programu, jen změnit CSS (jedeme na rychlost).
- ★ Zachovat stávající backend programu, jen změnit CSS (jedeme na kvalitu shody s redesignovým vizuálem).
- Zachovat převážně stávající backend programu s mírnými úpravami, aby se to už trochu chovalo jak redesign (včetně CSS na kvalitu shody).
- Přepsat program do Reactu (jedeme na rychlost, tj. aby to vůbec nějak fungovalo).
- Přepsat program do Reactu (plná palba, původní záměr a stav, ke kterému se chceme někdy v dalších iteracích nakonec dostat).

Nějaké nezřejmé věci, které je nutné pro dotažení do plné palby udělat:

- Např. týmové modály a podobně se musí zobrazovat i v normálním výpisu aktivit, tj. sdílení reactího kódu a podobně.
- Výpis aktivit tím pádem asi též do Reactu.

# Epic: Přihláška

Určitě letos udělat nejde, je potřeba přeskinovat stávající přihlášku a registraci.

# Dodatky

## Dodatek A -- diskuze nad Bootstrapem

- [x] zeptat se Maníka

> Maník: Je to proto, že ten návrh se dělal nezkušeně. Sešel jsem se s Ondrou Henkem s tím, co použít a on řekl "Bootstrap". Nebyl tam jako nikdo kdo by řekl "Aha a jaké komponenty budete používat? Responziva se nemusí řešit jen boostrapem, můžete to dělat ručně, foundantionem nebo si vzít jen grid z balíku XY"
>
> Dnes, po necelém roce bych řekl, že se tam používá jen grid a jestli se nemýlím, i ten je někde dělaný ručně. Tzn. moje doporučení dnes by bylo naimportovat jen grid (pokud se nepoužívá nic jiného) a tím by bylo vystaráno.

> Maník (osobně): Lidi používají bootstrap, je to rozšířené, dost jich nechce vanillu.

> Jana píše: používám scss, framework nepoužívám.

- [ ] includnout z bootstrapu jen co potřebujeme

```
'soubory/styl/bootstrap/bootstrap-grid.scss',

'soubory/styl/bootstrap/utilities/_spacing.scss',

'soubory/styl/bootstrap/mixins/_text-truncate.scss',
'soubory/styl/bootstrap/mixins/_text-emphasis.scss',
'soubory/styl/bootstrap/mixins/_hover.scss',
'soubory/styl/bootstrap/utilities/_text.scss',
```

- [ ] přemlátit do vanilly?
    - ty marginy a všechno je úplně dosrané a bude se muset mega měnit
    - [ ] podívat se, jaké stránky vlastně ne/máme
    - pro vanillu mluví i udržitelnost
    - argument "bootstrap má lepší dokumentaci" -- kontra "lepší než vanilla?"
    - jako ne, pokud není odpověď jednoznačná, je prostě nahovno to dělat v techu, s kterým to dělat nechci
    - [x] zjistit, v čem dělá Janča -- vanilla scss, viz výš
    - "bootstrap grid je dobrý wrapper nad flexbox" => "then use the f**ing flexbox in the first place"

- [x] přetíkající stránka => dolní posuvník
    - Maník rozbil bootstrap, protože odstranil implicitní marginy, proto to dělalo
