const algosdk = require('algosdk');

// 1. Genera un nuovo account casuale
const account = algosdk.generateAccount();

// 2. Converte la chiave segreta (sk) nelle 25 parole umane (Mnemonic)
const mnemonic = algosdk.secretKeyToMnemonic(account.sk);

// 3. Stampa il risultato nel terminale in modo leggibile
console.log("=========================================");
console.log("🎉 IL TUO NUOVO PORTAFOGLIO ALGORAND 🎉");
console.log("=========================================\n");

console.log("📍 1. INDIRIZZO PUBBLICO (L'IBAN per ricevere soldi finti):");
console.log(account.addr + "\n");

console.log("🔐 2. LE TUE 25 PAROLE SEGRETE (Da mettere in AlgorandService.js):");
console.log(mnemonic + "\n");

console.log("=========================================");