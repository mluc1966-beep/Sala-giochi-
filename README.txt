SALA GIOCHI - V1.1.0

CONTENUTO
- Partita Mista
- Sudoku 9x9 a soluzione unica
- Cerca-parole
- Anagrammi
- Quiz
- Logica
- Escape Room
- Sfida del giorno
- 3 livelli per ogni gioco: Facile, Medio, Difficile
- Archivio locale con storico, statistiche, export/import JSON
- PWA offline, nessun account e nessun backend

ARCHIVIO
I dati sono salvati nel localStorage del browser con chiave:
sala_giochi_locale_v1
Lo storico conserva fino a 250 partite.

INSTALLAZIONE SU GITHUB PAGES
1. Crea un repository GitHub, ad esempio "sala-giochi".
2. Carica nella radice i file contenuti in questa cartella.
3. In Settings > Pages scegli Deploy from a branch.
4. Seleziona branch main e cartella /root.
5. Apri l'indirizzo GitHub Pages generato.
6. Su Android/Chrome usa "Aggiungi a schermata Home" o "Installa app".

IMPORTANTE
Per service worker e installazione PWA l'app va aperta tramite HTTPS (GitHub Pages va bene) oppure localhost. Aprire index.html direttamente come file locale permette molte funzioni ma non garantisce il service worker.


Aggiornamento v1.4.0: aggiunto il livello Difficilissimo e un restyling grafico dei giochi, con Escape Room animata.

Aggiornamento v1.4.0: scelta palette per Home e per ciascun tipo di gioco, salvata in locale.

Aggiornamento v1.4.0: Escape Room realmente interattiva con hotspot cliccabili, inventario, oggetti, cassaforte, porta e animazioni visibili legate alle azioni.