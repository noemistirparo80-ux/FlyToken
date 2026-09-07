CREATE DATABASE IF NOT EXISTS flytoken_db;
USE flytoken_db;

CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    flight_date DATE NOT NULL,
    dep_time TIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    availability INT NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(255) NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    numTickets INT NOT NULL,
    flight_id INT NOT NULL,
    nft_id VARCHAR(255),
    final_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

-- Inserimento di alcuni voli di test
INSERT INTO flights (departure, destination, flight_date, dep_time, price, availability) VALUES 
('Milano', 'Roma', '2023-12-01', '08:00:00', 50.00, 100),
('Roma', 'Parigi', '2023-12-05', '10:30:00', 120.50, 50),
('Napoli', 'Londra', '2023-12-10', '15:00:00', 85.00, 75);
