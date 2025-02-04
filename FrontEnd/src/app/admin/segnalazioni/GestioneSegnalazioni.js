"use client";
import {useState, useEffect} from 'react';

export default function GestioneSegnalazioni(){
  const [segnalazioni, setSegnalazioni] = useState(null);

  useEffect(() => {
    const storedSegnalazioni = sessionStorage.getItem("segnalazioni");
    if(!storedSegnalazioni){
      fetch("http://localhost:5000/api/admin/Segnalazioni")
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          sessionStorage.setItem("segnalazioni",result);
          setSegnalazioni(data); 
        })
        .catch((error) => setError(error));
    }else{
      setSegnalazioni(JSON.parse(storedSegnalazioni));
    }
  }, []);

  if(segnalazioni === null) {
    return "Loading...";
  }

  return (
   <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestione Segnalazioni</h2>
      <div className="space-y-4">
        {segnalazioni.map((segnalazione) => (
          <div 
            key={segnalazione._id} 
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h3 className="text-lg font-semibold">{segnalazione.oggetto}</h3>
            <p className="text-gray-700">{segnalazione.descrizione}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-white ${
                segnalazione.priorita === 1 ? "bg-green-500" :
                segnalazione.priorita === 2 ? "bg-yellow-500" :
                segnalazione.priorita === 3 ? "bg-orange-500" : "bg-red-500"
              }`}>
                Priorità: {segnalazione.priorita}
              </span>
              <span className={`px-2 py-1 rounded text-white ${
                segnalazione.stato === "in attesa" ? "bg-gray-500" :
                segnalazione.stato === "in lavorazione" ? "bg-blue-500" :
                segnalazione.stato === "completata" ? "bg-green-500" : "bg-red-500"
              }`}>
                {segnalazione.stato}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Scadenza: {segnalazione.scadenza ? new Date(segnalazione.scadenza).toLocaleDateString() : "N/A"}</p>
            <p className="text-sm text-gray-500">Creato il: {new Date(segnalazione.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div> 
  );
}
