const algosdk = require('algosdk');

const baseServer = "https://testnet-api.algonode.cloud";
const port = "";
const token = "";
const client = new algosdk.Algodv2(token, baseServer, port);

// Mettiamo un account di test (dopo ti spiego come crearne uno tuo)
const adminMnemonic = "price length ... (qui andranno le tue 25 parole)"; 
const adminAccount = algosdk.mnemonicToSecretKey(adminMnemonic);

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

            const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                from: adminAccount.addr,
                suggestedParams: params,
                total: 1, 
                decimals: 0,
                defaultFrozen: false,
                assetName: assetName,
                unitName: unitName,
                assetURL: url,
                // SPIEGAZIONE COMANDO: La blockchain non legge il testo normale. 
                // Buffer.from() e Uint8Array trasformano la nostra frase in una sequenza di byte (numeri grezzi).
                note: new Uint8Array(Buffer.from(notaBiglietto)), 
            });

            const signedTxn = txn.signTxn(adminAccount.sk);
            const tx = await client.sendRawTransaction(signedTxn).do();
            
            console.log(`NFT in creazione... TxID: ${tx.txId}`);
            return tx.txId;

        } catch (error) {
            console.error("Errore Algorand:", error);
            return "ALGO-FALLBACK-" + Math.floor(Math.random() * 100000);
        }
    }
};

module.exports = AlgorandService;