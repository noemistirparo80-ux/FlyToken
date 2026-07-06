const http = require('http'); 
const FlightService = require('./services/FlightService'); 

// 1. Connessione al database ESATTAMENTE come da slide 52 del professore
let mysql = require('mysql2'); 
let connection = mysql.createConnection({ 
    host     : 'localhost', 
    user     : 'root', 
    password : '', 
    database : 'flytoken_db' 
}); 
connection.connect(); 

// Regole CORS per far comunicare React e Node
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// 2. Creazione del server (Senza async/await, come da slide)
const server = http.createServer(function(req, res) { 

    // Gestione Preflight CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        return res.end();
    }
    
    // --- A. AREA CLIENTE: VEDERE I VOLI ---
    if (req.url === '/api/flights' && req.method === 'GET') { 
        // Query ESATTAMENTE come da slide 53 del prof (uso delle callbacks)
        connection.query('SELECT * FROM flights', function(err, result) { 
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain', ...corsHeaders });
                return res.end('Errore database');
            }
            res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
            res.end(JSON.stringify(result));
        });
    }
    
    // --- B. AREA CLIENTE: COMPRARE UN BIGLIETTO ---
    else if (req.url === '/api/purchase' && req.method === 'POST'){ 
        let body = '';
        req.on('data', function(chunk) { body += chunk.toString(); });
        req.on('end', function() {
            try {
                const purchaseData = JSON.parse(body);
                const purchaseResponse = FlightService.simulatePurchase(
                    purchaseData.flightObject,
                    purchaseData.userObject,
                    purchaseData.passengerName,
                    purchaseData.numTickets
                );
                const ticket = purchaseResponse.ticket;

                // 1a Query: Salva la prenotazione (Callback stile prof)
                const insertQuery = `INSERT INTO reservations (ticket_id, passenger_name, numTickets, flight_id, nft_id, final_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                connection.query(insertQuery, [ticket.id, ticket.passengerName, ticket.numTickets, ticket.flight.id, ticket.idNFT, ticket.finalPrice, ticket.status], function(err, result) {
                    if (err) {
                        res.writeHead(500, corsHeaders);
                        return res.end("Errore salvataggio acquisto");
                    }

                    // 2a Query: Scala il posto dal volo (Callback annidata)
                    connection.query("UPDATE flights SET availability = availability - ? WHERE id = ?", [ticket.numTickets, ticket.flight.id], function(err2, result2) {
                        if (err2) {
                            res.writeHead(500, corsHeaders);
                            return res.end("Errore aggiornamento posti");
                        }
                        
                        res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
                        res.end(JSON.stringify(purchaseResponse));
                    });
                });
            } catch (err) {
                res.writeHead(400, corsHeaders);
                res.end("Errore dati inviati");
            }
        });
    }

    // --- C. AREA ADMIN: AGGIUNGERE UN VOLO ---
    else if (req.url === '/api/flights' && req.method === 'POST') {
        const auth = req.headers['authorization'];
        
        // Controllo della password per proteggere il database
        if (auth !== 'Chiave') {
            res.writeHead(403, { 'Content-Type': 'application/json', ...corsHeaders });
            return res.end(JSON.stringify({ message: "Accesso negato" }));
        }

        let body = '';
        req.on('data', function(chunk) { body += chunk.toString(); });
        req.on('end', function() {
            try {
                const f = JSON.parse(body);
                const insertFlightQuery = `INSERT INTO flights (departure, destination, flight_date, dep_time, price, availability) VALUES (?, ?, ?, ?, ?, ?)`;
                // Query per inserire il volo (Callback stile prof)
                connection.query(insertFlightQuery, [f.departure, f.destination, f.flight_date, f.dep_time, f.price, f.availability], function(err, result) {
                    if (err) {
                        res.writeHead(500, corsHeaders);
                        return res.end("Errore inserimento volo");
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json', ...corsHeaders });
                    res.end(JSON.stringify({ success: true, message: "Volo aggiunto!", insertId: result.insertId }));
                });
            } catch (err) {
                res.writeHead(400, corsHeaders);
                res.end("Errore dati inviati");
            }
        });
    }

    // --- D. AREA ADMIN: MODIFICARE UN VOLO ---
    else if (req.url.startsWith('/api/flights/') && req.method === 'PUT') {
        const auth = req.headers['authorization'];
        if (auth !== 'Chiave') {
            res.writeHead(403, { 'Content-Type': 'application/json', ...corsHeaders });
            return res.end(JSON.stringify({ message: "Accesso negato" }));
        }
        let body = '';
        req.on('data', function(chunk) { body += chunk.toString(); });
        req.on('end', function() {
            try {
                const f = JSON.parse(body);
                const updateFlightQuery = `UPDATE flights SET departure = ?, destination = ?, flight_date = ?, dep_time = ?, price = ?, availability = ? WHERE id = ?`;
                // Query per aggiornare il volo (Callback stile prof)
                connection.query(updateFlightQuery, [f.departure, f.destination, f.flight_date, f.dep_time, f.price, f.availability, f.id], function(err, result) {
                    if (err) {
                        res.writeHead(500, corsHeaders);
                        return res.end("Errore aggiornamento volo");
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json', ...corsHeaders });
                    res.end(JSON.stringify({ success: true, message: "Volo aggiornato!" }));
                });
            } catch (err) {
                res.writeHead(400, corsHeaders);
                res.end("Errore dati inviati");
            }
        });
    }
    
    // --- E. AREA ADMIN: VEDERE LE PRENOTAZIONI ---
    else if (req.url === '/api/reservations' && req.method === 'GET') {
        const auth = req.headers['authorization'];
        
        // Proteggiamo la rotta: solo l'admin con la password può vedere i biglietti
        if (auth !== 'Chiave') {
            res.writeHead(403, { 'Content-Type': 'application/json', ...corsHeaders });
            return res.end(JSON.stringify({ message: "Accesso negato" }));
        }

        // Query in stile prof (callback) per prendere tutto dalla tabella reservations
        connection.query('SELECT * FROM reservations', function(err, result) { 
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain', ...corsHeaders });
                return res.end('Errore database nel recupero prenotazioni');
            }
            // Se tutto va bene, restituiamo la lista in formato JSON
            res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
            res.end(JSON.stringify(result));
        });
    }
    // --- ROTTA NON TROVATA ---
    else {
        res.writeHead(404, corsHeaders);
        res.end('Not Found');
    }
});

// Avvio del server
server.listen(3001, function() {
    console.log('🚀 Server in ascolto sulla porta 3001 (Connesso a MySQL)');
});