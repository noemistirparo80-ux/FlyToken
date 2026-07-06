const Flight = require('./Flight'); 
const User =require('./User');

class Reservation {
    constructor(id, passengerName, numTickets, flightObject, userObject, status, idNFT, finalPrice) {
        this.id = id;
        this.flight = flightObject;
        this.passengerName = passengerName;
        this.numTickets = numTickets;
        this.user = userObject;
        this.status = status;
        this.finalPrice = finalPrice;
        this.idNFT = idNFT;

        this.idFlight = flightObject.id;
        this.idUser = userObject.id;

    }
}

module.exports = Reservation;