SALA GIOCHI — v2.2.0

PWA offline-first per un singolo utente.
Archivio, palette, statistiche e avanzamento sono salvati esclusivamente nel browser del dispositivo tramite localStorage.

GIOCHI
- Sudoku
- Cerca-parole
- Anagrammi
- Quiz
- Logica
- Escape Room
- Partita Mista
- Sfida del giorno

DIFFICOLTÀ
Facile · Medio · Difficile · Difficilissimo

SISTEMA SESSIONI
Sudoku, Cerca-parole, Anagrammi, Quiz, Logica e Partita Mista hanno un percorso persistente di 100 sessioni per ciascun livello.
Al termine di una sessione viene proposta la successiva dello stesso livello.
Dopo la sessione 100 puoi:
1) rigenerare l'intero ciclo e ripartire dalla Sessione 1;
2) passare al livello di difficoltà successivo.
Il contenuto della singola sessione è deterministico: se la interrompi e rientri prima di terminarla, la generazione usa lo stesso seme.

ESCAPE ROOM 2.0
La stanza non è una sequenza di domande. Gli elementi possono essere esplorati in ordine libero.
Sono presenti:
- indizi distribuiti nella stanza;
- codici dedotti collegando più indizi;
- inventario;
- oggetti utilizzabili sull'ambiente;
- combinazione di oggetti;
- quadro elettrico, armadietto, cassaforte, parete UV e porta finale;
- animazioni legate alle azioni.

PALETTE
La Home e ciascuna tipologia di gioco possono utilizzare palette differenti. Le preferenze sono locali.

ARCHIVIO
Lo storico conserva fino a 5000 partite, con gioco, livello, ciclo, sessione, esito, punteggio e durata.
È possibile esportare/importare il backup JSON.

GITHUB PAGES
Caricare tutti i file nella radice del repository e pubblicare main / (root) con GitHub Pages.
Dopo l'aggiornamento può essere necessario chiudere e riaprire la PWA per consentire al service worker di attivare la nuova cache v2.2.0.


NOVITÀ v2.2.0
- spiegazioni "Come si gioca" riscritte e strutturate per tutti i giochi;
- Cerca-parole: istruzioni operative visibili durante la partita, stato della prima lettera selezionata e pulsante per annullarla;
- contrasto corretto per lettere e parole da trovare;
- parole trovate barrate ma ancora leggibili;
- generatore Cerca-parole irrobustito per inserire sempre il numero previsto di parole;
- contrasto migliorato anche negli Anagrammi;
- Taccuino locale per singola sessione con copia dell’elemento corrente e calcolatrice rapida.
