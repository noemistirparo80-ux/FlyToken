const algosdk = require('algosdk');

const baseServer = "https://testnet-api.algonode.cloud";
const port = "";
const token = "";
const client = new algosdk.Algodv2(token, baseServer, port);

// Mettiamo un account di test (dopo ti spiego come crearne uno tuo)
const adminMnemonic = "ocean elite cry mandate danger inch cash meat hat crash soccer need buffalo property stumble drastic list shadow dog head report puppy evidence absent slab"; 

let adminAccount;
try {
    adminAccount = algosdk.mnemonicToSecretKey(adminMnemonic);
    console.log("Portafoglio caricato correttamente:", adminAccount.addr);
} catch (e) {
    console.error("ERRORE: Le 25 parole non sono valide!", e);
}

const AlgorandService = {
    // NOTA: Ho aggiunto numTickets tra i parametri in ingresso!
    mintTicketNFT: async (passengerName, flightDetails, numTickets) => {
        try {
            const params = await client.getTransactionParams().do();
            
            const assetName = "FlyToken " + flightDetails.id; 
            const unitName = "FLYTKN";
            const url = "https://flytoken.it/ticket/" + Math.random();
            
            // Il testo da salvare nella blockchain
            const notaBiglietto = `Passeggero: ${passengerName} - Posti: ${numTickets}`;

            const senderAddress = adminAccount.addr.toString();

            const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                from: senderAddress,
                suggestedParams: params,
                total: 1n, 
                decimals: 0,
                defaultFrozen: false,
                manager: senderAddress,
                reserve: senderAddress,
                freeze: senderAddress,
                clawback: senderAddress,
                assetName: "FlyToken " + flightDetails.id,
                unitName: "FLYTKN",
                assetURL: "https://flytoken.it/ticket/" + Math.random(),
                note: new Uint8Array(Buffer.from(`Passeggero: ${passengerName} - Posti: ${numTickets}`)), 
            });

            // Firmiamo la transazione
            const signedTxn = txn.signTxn(adminAccount.sk);
            
            // Estraiamo l'ID in modo SICURO prima dell'invio
            const txId = txn.txID().toString();
            
            // Inviamo la transazione
            await client.sendRawTransaction(signedTxn).do();
            
            console.log(`NFT creato con successo! TxID: ${txId}`);
            
            // Restituiamo il vero ID alla schermata di React
            return txId;

        } catch (error) {
            console.error("Errore Algorand:", error);
            return "ALGO-FALLBACK-" + Math.floor(Math.random() * 100000);
        }
    }
};

module.exports = AlgorandService;