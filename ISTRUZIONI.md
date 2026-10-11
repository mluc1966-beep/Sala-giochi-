# Sala giochi V2.14.0 — Rebus su Google Drive

## Stato effettivo

Questa consegna contiene **l'infrastruttura funzionante per l'archivio** e **un solo rebus di prova** fornito nella V2.13.1. Non contiene 50 rebus autentici: le immagini e le relative soluzioni non sono state fornite. Il CSV allegato è un esempio di formato, **non** una selezione di 50 rebus.

## File da caricare su GitHub

Sostituisci o aggiungi **soltanto** i file presenti nello ZIP nelle stesse posizioni:

- Root: `index.html`, `sw.js`, `rebus.js`, `rebus.css`, `rebus-config.js`, `rebus_archivio_001.png`.
- Cartella `app`: `app/index.html`, `app/sw.js`.

**Non eliminare** `app.js`, `styles.css`, `nextgen.js`, `nextgen.css`, `nomi-cose-citta.js`, `nomi-cose-citta.css`, le icone, i manifest o le risorse già presenti nel repository. I file di `apps-script` e il CSV sono materiali di configurazione, non vanno pubblicati nella webapp. Il file `rebus_archivio_001.png` è incluso per il funzionamento locale di prova.

## Preparare Drive

1. Crea su Google Drive una cartella `SalaGiochi_Rebus`.
2. Inserisci le immagini autentiche dei rebus, con nomi file univoci (`.png`, `.jpg`, `.webp`). Preferisci immagini sotto 1,8 MB ciascuna.
3. Prepara un CSV denominato **`rebus_selected_50.csv`**, con le colonne dell'esempio `rebus_archivio_esempio.csv` e un record per ogni rebus. La colonna `accepted` contiene eventuali soluzioni alternative separate da `|`. La colonna `hint` contiene **soltanto la prima parola** della soluzione.
4. La colonna `image` contiene il nome del file nella stessa cartella Drive, non un URL. Non usare virgole senza virgolette nei campi CSV.
5. Il CSV può contenere inizialmente meno di 50 righe: la webapp mostrerà il numero effettivo di record.

## Collegare Apps Script

1. Vai su [script.google.com](https://script.google.com/) e crea un progetto.
2. Copia il contenuto di `apps-script/Code.gs` nel file `Code.gs`.
3. Sostituisci `INSERISCI_ID_CARTELLA_DRIVE` con l'ID della cartella (la parte finale dell'URL Drive).
4. Seleziona ed esegui `setupArchive()`, autorizzando l'accesso a Drive. Controlla il log e risolvi eventuali immagini mancanti.
5. Distribuisci → Nuova distribuzione → Applicazione web. Esegui come: **Me**. Accesso: **Chiunque**, se vuoi che la PWA possa leggere l'archivio senza effettuare login Google. Valuta attentamente la visibilità delle soluzioni: l'API è pubblicamente interrogabile.
6. Copia l'URL che termina in `/exec`.
7. In `rebus-config.js` inserisci l'URL tra gli apici: `window.SALA_GIOCHI_REBUS_API_URL = 'https://script.google.com/macros/s/...../exec';`.
8. Carica `rebus-config.js` su GitHub e ricarica la PWA. A ogni modifica di `Code.gs` crea una **nuova versione** della distribuzione Apps Script.

## Comportamento e limiti

- Senza URL API configurato la webapp usa il solo rebus di prova incluso, così puoi verificare la grafica prima di configurare Drive.
- Con URL API configurato carica l'elenco dei record, poi la singola immagine e soluzione del rebus selezionato.
- I pulsanti Precedente, Successivo e Casuale sono attivi quando l'archivio contiene più record.
- L'unico aiuto è la prima parola della soluzione; restano disponibili **Prima lettura** e **Soluzione** come funzioni di rivelazione separate.
- Il caricamento da Drive **richiede Internet**. Il resto della PWA mantiene il proprio comportamento offline, ma i rebus remoti non sono garantiti offline.
- L'API restituisce le soluzioni al client per consentire la verifica; non è un sistema anti-cheat.
- Non sono stati forniti i file base `app.js`, `styles.css`, `nextgen.js` ecc.: l'integrazione è stata verificata staticamente sui file consegnati, non eseguita end-to-end nell'intera webapp.
