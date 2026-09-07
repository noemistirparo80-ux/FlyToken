const algosdk = require('algosdk');

const baseServer = "https://testnet-api.algonode.cloud";
const port = "";
const token = "";
const client = new algosdk.Algodv2(token, baseServer, port);

async function checkBalance() {
    try {
        const addr = "OHHM73TTYHM66KE6EDLKLLN7NODBCVI7L7EREEYGZX7Y75YCZVOTSZQUIY";
        const accountInfo = await client.accountInformation(addr).do();
        console.log("Saldo (in microAlgos):", accountInfo.amount);
    } catch (e) {
        console.error("Errore:", e);
    }
}

checkBalance();
