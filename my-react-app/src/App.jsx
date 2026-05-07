import { useState, useEffect } from "react";

function App () { 
  // 1. Creiamo uno stato per memorizzare i dati dei voli
  const [voli, setVoli] = useState([]) 

  // 2. Usiamo useEffect per eseguire una funzione al montaggio del componente, che farà una richiesta al server per ottenere i dati dei voli
  useEffect(() => { 
    // 3. Creiamo una funzione asincrona che utilizza fetch per ottenere i dati dei voli dall'endpoint del server e aggiorna lo stato con i dati ricevuti
    async function fetchVoli() { 
      try { //fetch è una funzione integrata in JavaScript che consente di effettuare richieste HTTP. In questo caso, stiamo facendo una richiesta GET all'endpoint
        const res = await fetch("http://localhost:3001/api/flights"); 
        const data = await res.json(); 
        //salviamo i dati dei voli nello stato usando setVoli, in modo che possiamo usarli per renderizzare la lista dei voli disponibili
        setVoli(data); 
      }
      catch (error) {
        console.error("Error connecting to server", error);
      }
    }
    //chiamata alla funzione per ottenere i dati dei voli quando il componente viene montato
    fetchVoli(); 
  }, []); 


//codice HTML (JSX) che disegna sullo schermo
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Fly-Token: Prenota il tuo volo</h1>
      
      <h3>Voli Disponibili:</h3>
      <ul>
        {/* 4. Cicliamo l'array dei voli con .map() */}
        {voli.map((volo) => (
          <li key={volo.id} style={{ marginBottom: '10px' }}>
            <strong>{volo.departure} ➔ {volo.destination}</strong> <br/>
            Data: {volo.flight_date} | Ora: {volo.dep_time} | 
            Prezzo: €{volo.price} | Posti: {volo.availability}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;