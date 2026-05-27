const http = require('http');//http è un modulo integrato in Node.js che consente di creare un server web.
const FlightService = require('./services/FlightService');//importa il modulo FlightService, che contiene la logica per simulare l'acquisto di un volo. Questo modulo è definito in un file separato all'interno della cartella "services".
const inizializzaDatabase = require('./database'); // Importiamo il ponte per MySQL

let db; // Variabile globale per la connessione al database
// Prepariamo le regole CORS in un blocco unico per non dimenticarle mai
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Allow-Headers': 'Content-Type'
};

const server = http.createServer(async (req, res) => { 

    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        return res.end();
    }
    
    if (req.url === '/api/flights' && req.method === 'GET') { //controlla se la richiesta è per l'endpoint "/api/flights" e se il metodo HTTP è GET. Se entrambe le condizioni sono vere, procede a leggere il file JSON che contiene i dati dei voli.  
        try {
            const [rows] = await db.query("SELECT * FROM flights");
            res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain', ...corsHeaders });
            res.end('Errore database');
        }
    }
    else if (req.url === '/api/purchase' && req.method === 'POST'){ //controlla se la richiesta è per l'endpoint "/api/purchase" e se il metodo HTTP è POST. Se entrambe le condizioni sono vere, procede a leggere i dati della richiesta, che dovrebbero contenere le informazioni necessarie per simulare l'acquisto di un volo. 
        let body = '';
        req.on('data', chunk => {body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const purchaseData = JSON.parse(body);
                const purchaseResponse = FlightService.simulatePurchase(
                    purchaseData.flightObject,
                    purchaseData.userObject,
                    purchaseData.passengerName
                );
                const ticket = purchaseResponse.ticket;

                // Salva nella tabella 'reservations'
                await db.query(
                    `INSERT INTO reservations (ticket_id, passenger_name, flight_id, nft_id, final_price, status) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [ticket.id, ticket.passengerName, ticket.flight.id, ticket.idNFT, ticket.finalPrice, ticket.status]
                );

                // Scala un posto dal volo
                await db.query("UPDATE flights SET availability = availability - 1 WHERE id = ?", [ticket.flight.id]);

                res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
                res.end(JSON.stringify(purchaseResponse));
            } catch (err) {
                res.writeHead(400, corsHeaders);
                res.end("Errore acquisto");
            }
        });
    }
    // --- 3. AREA ADMIN: POST (Aggiunge nuovi voli - Protetto!) ---
    else if (req.url === '/api/flights' && req.method === 'POST') {
        const auth = req.headers['authorization'];
        
        // Il controllo di sicurezza
        if (auth !== 'ChiaveSegretaAdmin123') {
            res.writeHead(403, { 'Content-Type': 'application/json', ...corsHeaders });
            return res.end(JSON.stringify({ message: "Accesso negato" }));
        }

        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const f = JSON.parse(body);
                await db.query(
                    `INSERT INTO flights (departure, destination, flight_date, dep_time, price, availability) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [f.departure, f.destination, f.flight_date, f.dep_time, f.price, f.availability]
                );
                res.writeHead(201, { 'Content-Type': 'application/json', ...corsHeaders });
                res.end(JSON.stringify({ success: true, message: "Volo aggiunto!" }));
            } catch (err) {
                res.writeHead(500, corsHeaders);
                res.end("Errore inserimento volo");
            }
        });
    }
    else {
        res.writeHead(404, corsHeaders);
        res.end('Not Found');
    }
});

inizializzaDatabase().then(connection => {
    db = connection; // Ora il database è pronto e salvato nella variabile!
    server.listen(3001, () => {
        console.log('🚀 Server running on port 3001 con MySQL!');
    });
});