# Tremfya IBD - sito virtuale con PDF incorporati

Preparazione del 29/10/2026. Nessuna pubblicazione o invio email effettuato.

## File da caricare

Caricare insieme tutto il contenuto di questa cartella, mantenendo i percorsi:

- `index.html`: HOME, una sola pagina PDF, con cinque collegamenti HTML ai materiali.
- `colite-ulcerosa.html`: ultimo PDF UC, inclusa la didascalia QUASAR corretta.
- `crohn.html`: ultimo PDF Crohn con figura integrale GRAVITI.
- `meccanismo-azione.html`: ultimo PDF MOA con script completo.
- `posologia.html`: ultimo PDF posologia.
- `pushpen.html`: ultimo PDF PushPen con tre referenze e nuova immagine finale sotto i tre frame.
- `pdf/`: documenti sorgenti; contenuti e dimensioni dei master conservati, immagini ricompresse in modo adattivo per l’upload.
- `assets/`: lettore PDF.js, codice, stili e manifest delle ancore.
- `destinazioni-home.json`: indirizzi dei cinque materiali nella HOME.
- `.nojekyll`: file da conservare nel caricamento.

Gli HTML non sono file autosufficienti: la cartella `pdf/` e le risorse `assets/` devono rimanere disponibili ai percorsi indicati. Non caricare solo l'HTML.

## Navigazione

I PDF vengono aperti e renderizzati dal lettore incorporato, senza convertirli in immagini precalcolate o ricostruirne i testi. I controlli dei PDF sono sovrapposti con veri elementi HTML `<a>` nelle coordinate originali.

Esempi di ancore:

- `colite-ulcerosa.html#figura-2-rif-2`
- `colite-ulcerosa.html#figura-4-rif-2`
- `crohn.html#figura-2-rif-4`
- `meccanismo-azione.html#script-video`
- `pushpen.html#script-video`
- Ogni documento accetta anche `#pagina-1`, `#pagina-2`, ecc.

I collegamenti esterni ai quattro RCP e ai video Brightcove sono conservati identici. L'indice del lettore consente di raggiungere script e pagine. HOME usa i link relativi ai cinque HTML: non incorpora più gli altri PDF in un documento unico. Il PDF della sola HOME, aperto separatamente dal lettore, e' una vista statica: la navigazione tra materiali appartiene al livello HTML.

## Indirizzi GitHub da inserire successivamente

Per caricare tutto nello stesso sito, i link relativi presenti funzionano già anche in una sottocartella. Se i cinque materiali verranno pubblicati a indirizzi distinti, sostituire i valori di `destinazioni-home.json` con gli URL pubblici degli HTML, senza frammento finale. Non sono stati inventati URL di produzione. Il generatore conserva le fonti e la configurazione locale; i valori futuri vanno preservati prima di rigenerare.

## Preview locale

Aprire tramite HTTP, non con doppio clic `file://`, perché il lettore carica i PDF e i moduli JavaScript tramite richieste web.

Da questa cartella:

```powershell
python -m http.server 8767 --bind 127.0.0.1
```

Poi aprire `http://127.0.0.1:8767/index.html`.

## Fonti e identificativi

I cinque componenti alleggeriti derivano dal manifest `2026-10-29_UC_DidascaliaQuasar`: UC CP-603518, Crohn CP-603519, MOA CP-603612, posologia CP-603521, PushPen CP-603524. Sono codici dei rispettivi materiali/landing; non codici di una 1to1. Le date restano quelle presenti nei master, inclusi i segnaposto da completare dal team.

Non sono stati modificati i master PDF o i video, né aggiornati Brightcove o Contentstack. Il vecchio aggregatore HOME rimane conservato nell'archivio ma non viene distribuito qui.

## Dipendenze e controlli

PDF.js 6.4.299, distribuzione ufficiale npm verificata con SHA-512. Licenza Apache 2.0 inclusa sotto `assets/vendor/LICENSE`; risorse del lettore distribuite localmente. Nessuna CDN necessaria al caricamento; RCP e player video continuano a usare gli URL esterni originali.

Verifiche: sei HTML, sei PDF, 21 pagine complessive e 35 hotspot; struttura e contenuti verificati rispetto ai master; pagina HOME separata identica visivamente; browser reale su tutte le pagine, figure, script, HOME, zoom e viewport mobile. Report, inventario fonti, generatore e prova di integrità ZIP sono conservati nella cartella operativa superiore.

La verifica tecnica non costituisce conferma dell'accettabilità regolatoria del formato da parte di AIFA.


## Edizione compatta per caricamento web

Questa edizione contiene 50 file invece di 219. Sono escluse le 169 risorse CMap del lettore, non utilizzate dai sei documenti attuali. Contenuti, dimensioni pixel e collegamenti sono conservati; le immagini di alcuni PDF sono ricompresse per ridurre il peso; font standard, motore PDF.js, worker e moduli di decodifica sono conservati localmente. Nessuna CDN aggiunta.

Caricare insieme tutti i 50 file, conservando le cartelle. Il file ZIP serve al trasferimento: estrarlo prima di caricare i contenuti nel repository. Non e' necessario caricare anche il precedente pacchetto da 219 file.

La selezione delle risorse vale per questi PDF verificati. Prima di aggiungere nuovi documenti con altri alfabeti o codifiche occorre controllare se richiedono CMap aggiuntive.


## PDF alleggeriti

Nuova edizione per l’upload web: JPEG qualità92 senza riduzione pixel, soltanto dove riduce effettivamente il peso. PushPen preservato integralmente, inclusi gli script ad alta risoluzione. I master originali restano conservati. Report tecnico nella cartella operativa superiore. Gli hash dei PDF compressi differiscono dai master; testi, correzioni, pagine, ancore e URL restano quelli approvati.


Per aggiornare i PDF gia caricati: estrarre Solo_PDF_leggeri.zip, aprire la cartella pdf e caricare i sei PDF nella cartella pdf del repository, mantenendo i nomi esistenti. Se il caricamento multiplo fallisce, eseguire un file per commit. Non caricare lo ZIP ne il vecchio aggregatore HOME completo.
