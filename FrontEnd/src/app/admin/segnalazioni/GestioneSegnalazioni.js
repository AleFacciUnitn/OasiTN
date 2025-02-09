"use client";
import {useState, useEffect} from 'react';
import {useRouter} from "next/navigation";
import { MdRefresh } from "react-icons/md";

export default function GestioneSegnalazioni(){
  const router = useRouter();
  const [segnalazioni, setSegnalazioni] = useState(null);
  const endpoint = (process.env.API_URL || "http://localhost:5000/api")+"/admin/Segnalazioni";

  const fetchSegnalazioni = () => {
    fetch(endpoint)
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result);
        sessionStorage.setItem("segnalazioni",result);
        setSegnalazioni(data); 
      })
      .catch((error) => setError(error));
  }

  useEffect(() => {
    const storedSegnalazioni = sessionStorage.getItem("segnalazioni");
    if(!storedSegnalazioni){
      fetchSegnalazioni();
    }else{
      setSegnalazioni(JSON.parse(storedSegnalazioni));
    }
  }, []);

  if(segnalazioni === null) {
    return "Loading...";
  }

  const getScadenza = (segnalazione) => {
    if(segnalazione.stato === "completata") return new Date(segnalazione.scadenza);
    const createdAt = new Date(segnalazione.createdAt).getTime();
    const priorita = segnalazione.priorita;
    const scadenza = new Date(segnalazione.scadenza);
    switch(priorita){
      case 4:
        scadenza.setTime(createdAt + (7 * 24 * 60 * 60 * 1000));
        break;
      case 3:
        scadenza.setTime(createdAt + (3 * 7 * 24 * 60 * 60 * 1000));
        break;
      case 2:
        scadenza.setTime(createdAt + (2 * 3 * 7 * 24 * 60 * 60 * 1000));
        break;
      case 1:
        scadenza.setTime(createdAt + (4 * 3 * 7 * 24 * 60 * 60 * 1000));
        break;
    }
    return scadenza;
  };

  return (
   <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestione Segnalazioni</h2>
        <MdRefresh
          className="cursor-pointer"
          onClick={fetchSegnalazioni}/>
      </div>
      <div className="space-y-4">
        {segnalazioni.map((segnalazione) => (
          <div
            onClick={() => {
              sessionStorage.setItem("segnalazione",JSON.stringify(segnalazione));
              router.push("/admin/segnalazioni/"+segnalazione.oggetto.toLowerCase().replaceAll(" ", ""));
            }}
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
            {segnalazione.stato === "completata" ? <p 
              className="text-sm text-gray-500 mt-2"
              >Visibile fino a: {getScadenza(segnalazione).toLocaleDateString()}</p> :
            <><p 
              className="text-sm text-gray-500 mt-2"
              >Scadenza: {getScadenza(segnalazione).toLocaleDateString()}</p>
            <p 
              className="text-sm text-gray-500"
              >Creato il: {new Date(segnalazione.createdAt).toLocaleDateString()}</p></>}
          </div>
        ))}
      </div>
    </div> 
  );
}
