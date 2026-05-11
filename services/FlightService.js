const Reservation = require('../models/Reservation');

const FlightService = {
    //metodo che gestisce la logica di acquisto
    simulatePurchase: (flightObject, userObject, passengerName) =>{
        //genera id casuale
        const idReservation = Math.floor(100000 + Math.random() * 900000).toString();

        //simulo NFT (in futuro sarà gestito da Algorand)
        const fintoNFT = "ALGO-NFT-" + idReservation;

        //istanziamo il nuovo biglietto usando la classe 
        const newTicket = new Reservation(
            idReservation,
            passengerName,
            flightObject,
            userObject,
            "Confermato",
            fintoNFT,
            flightObject.price
        );

        return {
            success: true,
            messagge: "Acquisto completato con successo",
            ticket: newTicket
        };
    }
};

module.exports = FlightService;