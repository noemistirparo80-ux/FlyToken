const http = require('http');//http è un modulo integrato in Node.js che consente di creare un server web.
const fs = require('fs');//fs è un modulo integrato in Node.js che consente di lavorare con il file system, ad esempio per leggere o scrivere file. In questo caso, viene utilizzato per leggere il file JSON che contiene i dati dei voli.
const FlightService = require('./services/FlightService');//importa il modulo FlightService, che contiene la logica per simulare l'acquisto di un volo. Questo modulo è definito in un file separato all'interno della cartella "services".


const server = http.createServer((req, res) => { 
    if (req.url === '/api/flights' && req.method === 'GET') { //controlla se la richiesta è per l'endpoint "/api/flights" e se il metodo HTTP è GET. Se entrambe le condizioni sono vere, procede a leggere il file JSON che contiene i dati dei voli.  
        fs.readFile('./lista_voli.json', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error reading flight data');
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    else if (req.url === '/api/purchase' && req.method === 'POST'){ //controlla se la richiesta è per l'endpoint "/api/purchase" e se il metodo HTTP è POST. Se entrambe le condizioni sono vere, procede a leggere i dati della richiesta, che dovrebbero contenere le informazioni necessarie per simulare l'acquisto di un volo. 
        let body = '';
        req.on('data', chunk => {body += chunk.toString(); });
        req.on('end', () => {
            const purchaseData = JSON.parse(body);
            //simulatepurchase è una funzione che simula l'acquisto di un volo e restituisce una risposta
            const response = FlightService.simulatePurchase(purchaseData);
            res.end(JSON.stringify(response));
        });
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});