import { useState, useEffect } from "react";

function App () { 
  // 1. I nostri taccuini (Stati)
  const [flights, setFlights] = useState([]); 
  const [flightSelected, setFlightSelected] = useState(null); 
  // Usiamo nomi coerenti per il passeggero
  const [passengerName, setPassengerName] = useState("");
  const [ticket, setTicket] = useState([]);

  // 2. Il caricamento iniziale
  useEffect(() => { 
    async function fetchFlights() { 
      try {
        const res = await fetch("http://localhost:3001/api/flights"); 
        const data = await res.json(); 
        setFlights(data); 
      }
      catch (error) {
        console.error("Errore server:", error);
      }
    }
    fetchFlights(); 
  }, []); 

  // 3. Selezione
  function handleFlightSelect(flightSelected) {
    setFlightSelected(flightSelected);
  }

  // 4. L'Acquisto
  async function handlePurchase(){
    if(!passengerName){
      alert("Inserisci il nome del passeggero");
      return;
    }
    
    const dati = {
      flightObject: flightSelected,
      userObject: { id: "U-123", name: "Noemi", surname: "S.", email: "test@test.it" },
      passengerName: passengerName
    };

    try {
      const res = await fetch("http://localhost:3001/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dati)
      });

      // ECCO LA RIGA CHE MANCAVA! Dobbiamo trasformare la risposta in JSON
      const data = await res.json();

      if (data.success) {
        alert(`${data.message}! NFT: ${data.ticket.idNFT}`);
        setFlightSelected(null); 
        setPassengerName("");    
      }
    } catch (error) {
      console.error("Errore acquisto:", error);
      alert("Errore durante la prenotazione. Controlla il server!");
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Fly-Token: Scegli il tuo volo</h1>

      {/* --- ZONA 1: LA LISTA DEI VOLI --- */}
      <h3>Voli Disponibili:</h3>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong>{flight.departure} ➔ {flight.destination}</strong> <br/>
            Prezzo: €{flight.price} | Posti: {flight.availability} <br/>
            <button onClick={() => handleFlightSelect(flight)} style={{ marginTop: '10px', cursor: 'pointer' }}>
              Seleziona questo volo
            </button>
          </li>
        ))}
      </ul>

      {/* --- ZONA 2: IL VOLO SELEZIONATO (IL "CARRELLO") --- */}
      <hr style={{ margin: '40px 0' }} />
      
      <h3>Riepilogo Selezione:</h3>
      
      {!flightSelected ? (
        <p style={{ color: 'gray' }}>Nessun volo selezionato. Clicca su un volo per iniziare.</p>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
          <h4>Stai per prenotare:</h4>
          <p>Tratta: <strong>{flightSelected.departure} - {flightSelected.destination}</strong></p>
          <p>Data: {flightSelected.flight_date} alle {flightSelected.dep_time}</p>
          <p>Costo totale: €{flightSelected.price}</p>
          
          <input type="text" 
            placeholder="Nome del passeggero" 
            value={passengerName} 
            onChange={(e) => setPassengerName(e.target.value)}
            style={{ padding: '8px', width: '250px', display: 'block', marginBottom: '10px' }}
          />

          {/* Tolte le parentesi tonde dalla funzione completaPrenotazione */}
          <button onClick={handlePurchase} style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Procedi all'acquisto
          </button>
        </div>
      )}

    </div>
  );
}

export default App;