# Relazione di Progetto: FlyToken

**Progetto a cura di:** Noemi S.

---

## 1. Introduzione e Scopo del Progetto
**FlyToken** è un'applicazione web full-stack sviluppata per la gestione e la prenotazione di voli aerei. L'obiettivo principale del progetto è simulare un sistema di biglietteria aerea che integri le tecnologie web tradizionali con la tecnologia **Blockchain**, garantendo l'unicità e l'autenticità dei biglietti emessi tramite la creazione di Non-Fungible Token (NFT) sulla rete Algorand.

## 2. Specifica dei Requisiti
Il sistema è stato progettato per soddisfare le esigenze di due tipologie di utenti: **Clienti** (viaggiatori) e **Amministratori** (gestori della compagnia aerea).

### 2.1 Requisiti Funzionali
**Lato Cliente (Accesso Pubblico):**
* **Visualizzazione Voli:** L'utente può visualizzare la lista dei voli disponibili, con dettagli su partenza, destinazione, orario, prezzo e posti disponibili.
* **Selezione Volo:** L'utente può selezionare un volo specifico.
* **Prenotazione e Acquisto:** L'utente può inserire il proprio nome, la quantità di biglietti desiderata e procedere all'acquisto. 
* **Emissione Biglietto (Blockchain):** Al termine dell'acquisto, il sistema genera una ricevuta che include un ID univoco della prenotazione e il codice identificativo dell'NFT generato sulla rete Algorand, che funge da certificato di autenticità del biglietto.

**Lato Amministratore (Accesso Protetto):**
* **Autenticazione:** Accesso protetto da password per visualizzare i controlli avanzati.
* **Aggiunta Voli:** L'amministratore può inserire un nuovo volo nel database specificando partenza, destinazione, data, orario, prezzo e disponibilità posti.
* **Modifica Voli:** L'amministratore può aggiornare i dettagli di un volo esistente.
* **Visualizzazione Storico:** L'amministratore può consultare lo storico di tutte le prenotazioni effettuate, inclusi i dettagli dei passeggeri, il totale incassato e gli ID degli NFT (TxID) associati ai biglietti.

### 2.2 Requisiti Non Funzionali
* **Persistenza dei Dati:** Le informazioni sui voli e sulle prenotazioni devono essere memorizzate in modo duraturo in un database relazionale.
* **Integrità (Blockchain):** L'emissione dei biglietti deve sfruttare una rete P2P decentralizzata (Algorand) per garantire la tracciabilità e l'immutabilità del token associato al biglietto, impedendo la contraffazione.
* **Usabilità:** L'interfaccia utente deve essere dinamica, reattiva e costruita come Single Page Application (SPA).
* **Sicurezza del Data Layer:** Le interrogazioni al database devono essere protette da attacchi di tipo SQL Injection.

## 3. Progettazione del Sistema (Architettura)
Il sistema è stato progettato seguendo un'architettura a tre livelli (*Three-Tier Architecture*), integrata con chiamate a servizi Blockchain esterni.

### 3.1 Frontend (Presentation Layer)
L'interfaccia utente è sviluppata utilizzando la libreria **React.js**. 
* Gestisce lo stato dinamico dell'applicazione (es. voli caricati, pannello admin, carrello e ricevuta) interamente lato client tramite gli Hook (`useState`, `useEffect`).
* Comunica in modo asincrono con il server Node.js tramite chiamate HTTP RESTful utilizzando l'API `fetch`.

### 3.2 Backend (Application Layer)
Il server applicativo è sviluppato in **Node.js**.
Riceve le richieste dal Frontend, processa la logica di business e dialoga con il database. Espone le seguenti API:
* **`GET /api/flights`**: Recupera dal database la lista dei voli disponibili.
* **`POST /api/purchase`**: Gestisce il core logic dell'acquisto. Coordina in modo asincrono la decurtazione dei posti disponibili, il salvataggio della prenotazione e richiama i servizi per simulare la transazione economica e il minting dell'NFT.
* **`POST` e `PUT /api/flights`**: Rotte protette per operazioni CRUD (Create, Update) sui voli da parte dell'admin.
* **`GET /api/reservations`**: Rotta protetta per il recupero dello storico prenotazioni.

La logica è stata modularizzata delegando specifiche operazioni ai file `FlightService.js` (per la gestione logica della prenotazione) e `AlgorandService.js` (per l'interfacciamento con la rete P2P).

### 3.3 Database (Data Layer)
La persistenza locale è affidata al DBMS relazionale **MySQL**.
Il database (`flytoken_db`) è normalizzato sulle entità fondamentali del dominio applicativo:
* **Tabella `flights`**: Memorizza i metadati dei voli.
* **Tabella `reservations`**: Traccia ogni singola prenotazione referenziando il volo acquistato e legando l'acquisto all'identificativo NFT.

Tutte le interazioni server-database (`INSERT`, `UPDATE`, `SELECT`) avvengono tramite libreria `mysql2` utilizzando query parametrizzate, garantendo la sanitizzazione degli input.

### 3.4 Livello Blockchain (Reti P2P)
Il modulo `AlgorandService` gestisce l'interfacciamento con la blockchain di Algorand. Durante un acquisto, il backend funge da client verso la rete P2P e richiede il "Minting" (la creazione) di uno Standard Asset (o NFT) che rappresenta digitalmente il biglietto. Una volta confermata la transazione dal network distribuito, il server riceve il Transaction ID (TxID) dell'asset creato e lo memorizza nel database locale per referenza incrociata.

## 4. Conclusioni
FlyToken dimostra praticamente come l'unione tra lo sviluppo web full-stack tradizionale (React, Node, MySQL) e la tecnologia distribuita basata su Blockchain (Algorand) possa risolvere potenziali criticità del settore ticketing, offrendo tracciabilità verificabile pubblicamente, decentralizzazione della prova di acquisto e immutabilità del dato emesso.
