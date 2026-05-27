import { useState, useEffect } from "react";

function App () { 
  // 1. I nostri taccuini (Stati)
  const [flights, setFlights] = useState([]); 
  const [flightSelected, setFlightSelected] = useState(null); 
  // Usiamo nomi coerenti per il passeggero
  const [passengerName, setPassengerName] = useState("");
  const [ticket, setTicket] = useState(null);

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
        setFlightSelected(null); 
        setPassengerName(""); 
        setTicket(data.ticket);   
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

      {/* --- ZONA 3: LA RICEVUTA DI ACQUISTO (Appare solo se c'è un biglietto) --- */}
      {ticket && (
        <div style={{ padding: '20px', backgroundColor: '#e6ffe6', border: '2px solid #4CAF50', borderRadius: '10px', marginBottom: '30px' }}>
          <h2 style={{ color: '#4CAF50', marginTop: 0 }}>Acquisto Completato! </h2>
          <p>Grazie per aver viaggiato con noi, <strong>{ticket.passengerName}</strong>.</p>
          
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', border: '1px dashed gray' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Dettagli del tuo Biglietto</h4>
            <p><strong>Codice Prenotazione:</strong> {ticket.id}</p>
            <p><strong>Tratta:</strong> {ticket.flight.departure} ➔ {ticket.flight.destination}</p>
            <p><strong>Prezzo Pagato:</strong> €{ticket.finalPrice}</p>
            <p><strong>Stato:</strong> <span style={{color: 'green', fontWeight: 'bold'}}>{ticket.status}</span></p>
            
            <hr style={{ border: '0.5px solid #eee' }} />
            <h4 style={{ color: 'blue', margin: '10px 0 5px 0' }}>🔗 Certificato Blockchain</h4>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '1.2em' }}>{ticket.idNFT}</p>
          </div>
          
          <button onClick={() => setTicket(null)} style={{ marginTop: '15px', padding: '10px', cursor: 'pointer' }}>
            Chiudi ricevuta e prenota un altro volo
          </button>
        </div>
      )}
    </div>
  );
}

export default App;