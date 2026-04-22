import { Flight } from "./Flight.js";
import { User } from "./User.js";

export class Reservation {
    constructor(id, passengerName, flightObject, userObject, status, idNFT, finalPrice) {
        this.id = id;
        this.flight = flightObject;
        this.passengerName = passengerName;
        this.user = userObject;
        this.status = status;
        this.finalPrice = finalPrice;
        this.idNFT = idNFT;

        this.idFlight = flightObject.id;
        this.idUser = userObject.id;

    }
}