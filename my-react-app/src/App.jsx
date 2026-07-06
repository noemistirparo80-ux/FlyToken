import { useState, useEffect } from "react";

function App () { 
  // 1. I nostri taccuini (Stati)
  const [flights, setFlights] = useState([]); 
  const [flightSelected, setFlightSelected] = useState(null); 
  // Usiamo nomi coerenti per il passeggero
  const [passengerName, setPassengerName] = useState("");
  const [numTickets, setNumTickets] = useState("");
  const [ticket, setTicket] = useState(null);
  //stato per admin
  const [isAdmin, setIsAdmin] = useState(false);
  //stati per aggiunta volo
  const [newDeparture, setNewDeparture] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newAvailability, setNewAvailability] = useState("");
  //stati per modifica volo
  const [editingFlight, setEditingFlight] = useState(null);
  // STATI PER LE PRENOTAZIONI
  const [reservations, setReservations] = useState([]); // Salverà i dati dal database
  const [showReservations, setShowReservations] = useState(false); // Accende/spegne la lista

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

  // 3a. Salva modifica volo (solo per admin)
  async function handleSaveEdit() {
    try {
      const res = await fetch(`http://localhost:3001/api/flights/${editingFlight.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Chiave" 
        },
        body: JSON.stringify(editingFlight) 
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Volo modificato con successo!");
        setFlights(flights.map(f => f.id === editingFlight.id ? editingFlight : f));
        setEditingFlight(null); // Chiude la schermata di modifica
      }
    } catch (error) {
      console.error("Errore modifica volo:", error);
      alert("Errore durante la modifica del volo. Controlla il server!");
    }
  }

  // 3b. Aggiunta volo (solo per admin)
  async function handleCreateFlight() {
    if (!newDeparture || !newDestination || !newPrice || !newDate || !newTime || !newAvailability) {
      alert("Compila tutti i campi per aggiungere un volo");
      return;
    }
    const newFlightData = {
      departure: newDeparture,
      destination: newDestination,
      price: parseFloat(newPrice),
      flight_date: newDate,
      dep_time: newTime,
      availability: parseInt(newAvailability) // Posti iniziali
    };
    try {
      const res = await fetch("http://localhost:3001/api/flights", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Chiave" // Password per admin
        },
        body: JSON.stringify(newFlightData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Volo aggiunto con successo!");
        setFlights([...flights, { id: data.insertId, ...newFlightData }]);
        // Reset campi
        setNewDeparture("");
        setNewDestination("");
        setNewPrice("");
        setNewDate("");
        setNewTime("");
        setNewAvailability("");
        setNumTickets("");
      }
    } catch (error) {
      console.error("Errore aggiunta volo:", error);
      alert("Errore durante l'aggiunta del volo. Controlla il server!");
    }
  }
  // 3c. Recupero prenotazioni (solo per admin)
  async function fetchReservations() {
    try {
      const res = await fetch("http://localhost:3001/api/reservations", {
        method: "GET",
        headers: { 
          "Authorization": "Chiave" // Il nostro passaporto admin
        }
      });
      const data = await res.json();
      setReservations(data);
      setShowReservations(true); // Mostriamo la lista a schermo
    } catch (error) {
      console.error("Errore recupero prenotazioni:", error);
      alert("Errore. Controlla che il server sia acceso!");
    }
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
      passengerName: passengerName,
      numTickets: numTickets
    };

    try {
      const res = await fetch("http://localhost:3001/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dati)
      });


      const data = await res.json();

      if (data.success) {
        setFlightSelected(null); 
        setPassengerName(""); 
        setNumTickets("");
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
      {/* --- ZONA 0: IL BENVENUTO --- */}
      <button onClick={() => {
        if (isAdmin) {
          setIsAdmin(false);
        }
        else {
          const password = prompt("Inserisci la password per accedere alla modalità admin:");
          if (password === "Chiave") {
            setIsAdmin(true);
          } else {
            alert("Password errata! Accesso negato.");
          }
        }
      }} 
      style={{ marginBottom: '20px', padding: '10px', backgroundColor: isAdmin ? '#ffcccc' : '#cce5ff', cursor: 'pointer' }}>
        {isAdmin ? "Torna alla vista cliente" : "Accedi come admin"}
      </button>
      {isAdmin && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
          <h2>Aggiungi un nuovo volo</h2>
          <input type="text" placeholder="Partenza" value={newDeparture} onChange={(e) => setNewDeparture(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
          <input type="text" placeholder="Destinazione" value={newDestination} onChange={(e) => setNewDestination(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
          <input type="number" placeholder="Prezzo" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
          <input type="date" placeholder="Data" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
          <input type="time" placeholder="Orario" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
          <input type="number" placeholder="Posti disponibili" value={newAvailability} onChange={(e) => setNewAvailability(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
          <button onClick={handleCreateFlight} style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Aggiungi Volo
          </button>
          {/* --- ZONA PRENOTAZIONI ADMIN --- */}
          <hr style={{ border: '0.5px solid #ffcccc', margin: '20px 0' }} />
          <button 
            onClick={showReservations ? () => setShowReservations(false) : fetchReservations} 
            style={{ backgroundColor: '#0066cc', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {showReservations ? "Nascondi Prenotazioni" : "Vedi Biglietti Venduti"}
          </button>

          {showReservations && (
            <div style={{ marginTop: '15px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <h3 style={{ marginTop: 0 }}>Storico Prenotazioni</h3>
              {reservations.length === 0 ? (
                <p>Nessun biglietto venduto finora.</p>
              ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {reservations.map((res) => (
                    <li key={res.ticket_id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                      <strong>Passeggero:</strong> {res.passenger_name} | <strong>Posti:</strong> {res.numTickets} <br/>
                      <strong>Volo ID:</strong> {res.flight_id} | <strong>Incasso:</strong> €{res.final_price} <br/>
                      <span style={{ fontSize: '0.85em', color: 'gray' }}>NFT ID: {res.nft_id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}


      {/* --- ZONA 1: LA LISTA DEI VOLI --- */}
      <h3>Voli Disponibili:</h3>
      <ul>
        {!isAdmin ? (
          flights.map((flight) => (
            <li key={flight.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <strong>{flight.departure} ➔ {flight.destination}</strong> <br/>
              Prezzo: €{flight.price} | Posti: {flight.availability} <br/>
              <button onClick={() => handleFlightSelect(flight)} style={{ marginTop: '10px', cursor: 'pointer' }}>
                Seleziona questo volo
              </button>
            </li>
          ))
        ) : (
          flights.map((flight) => (
            <li key={flight.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              
              {editingFlight && editingFlight.id === flight.id ? (
                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Stai modificando il volo:</h4>
                  <input type="text" value={editingFlight.departure} onChange={(e) => setEditingFlight({...editingFlight, departure: e.target.value})} style={{ marginRight: '5px', padding: '5px' }} />
                  <input type="text" value={editingFlight.destination} onChange={(e) => setEditingFlight({...editingFlight, destination: e.target.value})} style={{ marginRight: '5px', padding: '5px' }} />
                  <input type="number" value={editingFlight.price} onChange={(e) => setEditingFlight({...editingFlight, price: parseFloat(e.target.value)})} style={{ marginRight: '5px', padding: '5px', width: '80px' }} />
                  <input type="date" value={editingFlight.flight_date} onChange={(e) => setEditingFlight({...editingFlight, flight_date: e.target.value})} style={{ marginRight: '5px', padding: '5px' }} />
                  <input type="time" value={editingFlight.dep_time} onChange={(e) => setEditingFlight({...editingFlight, dep_time: e.target.value})} style={{ marginRight: '5px', padding: '5px' }} />
                  <input type="number" value={editingFlight.availability} onChange={(e) => setEditingFlight({...editingFlight, availability: parseInt(e.target.value)})} style={{ marginRight: '10px', padding: '5px', width: '80px' }} />
                  
                  <button onClick={handleSaveEdit} style={{ backgroundColor: 'green', color: 'white', padding: '6px', marginRight: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Salva 
                  </button>
                  <button onClick={() => setEditingFlight(null)} style={{ backgroundColor: 'gray', color: 'white', padding: '6px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Annulla
                  </button>
                </div>
              ) : (
                <div>
                  <strong>{flight.departure} ➔ {flight.destination}</strong> <br/>
                  Prezzo: €{flight.price} | Posti: {flight.availability} <br/>
                  <button onClick={() => handleFlightSelect(flight)} style={{ marginTop: '10px', cursor: 'pointer', marginRight: '10px' }}>
                    Seleziona
                  </button>
                  <button onClick={() => setEditingFlight(flight)} style={{ backgroundColor: 'orange', color: 'white', padding: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Modifica Volo
                  </button>
                </div>
              )}
            </li>
          ))
        )}
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
          <input type="number"
            placeholder="Numero di biglietti"
            value={numTickets}
            onChange={(e) => setNumTickets(parseInt(e.target.value))}
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