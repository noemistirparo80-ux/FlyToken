const mysql = require('mysql2/promise');

async function inizializzaDatabase() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        console.log("Connesso a XAMPP! Sto preparando il database...");

        await db.query("CREATE DATABASE IF NOT EXISTS flytoken_db;");
        await db.query("USE flytoken_db;");

        // 1. Tabella 'flights' invece di 'voli'
        await db.query(`
            CREATE TABLE IF NOT EXISTS flights (
                id INT AUTO_INCREMENT PRIMARY KEY,
                departure VARCHAR(50) NOT NULL,
                destination VARCHAR(50) NOT NULL,
                flight_date VARCHAR(20) NOT NULL,
                dep_time VARCHAR(10) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                availability INT NOT NULL
            );
        `);

        // 2. Tabella 'reservations' invece di 'prenotazioni'
        await db.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ticket_id VARCHAR(50) NOT NULL,
                passenger_name VARCHAR(100) NOT NULL,
                flight_id INT NOT NULL,
                nft_id VARCHAR(100) NOT NULL,
                final_price DECIMAL(10,2) NOT NULL,
                status VARCHAR(20) NOT NULL
            );
        `);

        // 3. Popoliamo la tabella 'flights'
        const [righe] = await db.query("SELECT * FROM flights");
        if (righe.length === 0) {
            await db.query(`
                INSERT INTO flights (departure, destination, flight_date, dep_time, price, availability) VALUES
                ('Parma', 'Roma', '2026-06-15', '08:30', 99.50, 150),
                ('Roma', 'Parigi', '2026-06-16', '10:00', 145.00, 80),
                ('Milano', 'Londra', '2026-06-17', '14:45', 210.00, 45);
            `);
            console.log("Tabella 'flights' popolata con i dati iniziali!");
        }

        console.log("✅ Database 'flytoken_db' pronto all'uso!");
        return db; 

    } catch (error) {
        console.error("❌ Errore fatale con il Database:", error.message);
    }
}

module.exports = inizializzaDatabase;