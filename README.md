# FlyToken - Progetto Universitario

Questo progetto è un'applicazione web full-stack per la gestione e prenotazione di voli aerei, con integrazione della tecnologia Blockchain (Algorand) per l'emissione di biglietti come NFT (Non-Fungible Tokens).

## 🚀 Requisiti di Sistema
Per eseguire il progetto sulla tua macchina, assicurati di avere installato:
- **Node.js** (versione 14 o superiore)
- **MySQL** (es. tramite XAMPP o installazione nativa)

## 🛠️ Istruzioni per l'Installazione e l'Avvio

### 1. Configurazione del Database (MySQL)
1. Avvia il server MySQL (ad esempio tramite il pannello di controllo di XAMPP).
2. Apri PhpMyAdmin (di solito su `http://localhost/phpmyadmin`) o il tuo client MySQL preferito.
3. Importa il file `database.sql` presente nella cartella principale di questo progetto per creare automaticamente il database `flytoken_db` e le relative tabelle (`flights`, `reservations`), includendo alcuni dati di test.

### 2. Avvio del Server (Backend)
Il server gestisce le API e comunica con la blockchain di Algorand.
1. Apri un terminale nella cartella principale del progetto (`FlyToken`).
2. Installa le dipendenze eseguendo:
   ```bash
   npm install
   ```
3. Avvia il server eseguendo:
   ```bash
   npm start
   ```
4. Il server sarà in ascolto all'indirizzo `http://localhost:3001`.

### 3. Avvio dell'Interfaccia Utente (Frontend)
Il frontend è sviluppato in React.js.
1. Apri un **nuovo terminale** ed entra nella cartella del frontend:
   ```bash
   cd my-react-app
   ```
2. Installa le dipendenze eseguendo:
   ```bash
   npm install
   ```
3. Avvia l'applicazione React in modalità sviluppo:
   ```bash
   npm run dev
   ```
4. Il terminale ti fornirà un URL locale (di solito `http://localhost:5173`) da aprire nel browser per utilizzare l'applicazione.

## 👥 Modalità d'uso
* **Modalità Cliente:** Appena apri l'applicazione, sei nella vista cliente. Puoi visualizzare i voli, selezionarne uno, inserire il nome del passeggero, il numero di biglietti desiderati e procedere all'acquisto.
* **Modalità Amministratore:** Clicca sul pulsante "Accedi come admin". Ti verrà chiesta una password (la password predefinita inserita a scopo didattico è **`Chiave`**). Da qui potrai aggiungere nuovi voli, modificare quelli esistenti e visualizzare lo storico dei biglietti venduti.