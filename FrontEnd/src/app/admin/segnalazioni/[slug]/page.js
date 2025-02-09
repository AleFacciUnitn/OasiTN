"use client";
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import GoBack from "../../GoBack";

export default function Page(){
  const router = useRouter();
  const [segnalazione, setSegnalazione] = useState(null);
  const [action, setAction] = useState(() => {});
  const [isVisible, setIsVisible] = useState(false);
  const endpoint = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")+"/admin/Segnalazioni";

  useEffect(() => {
    const storedSegnalazione = sessionStorage.getItem("segnalazione");
    setSegnalazione(JSON.parse(storedSegnalazione));
  }, []);

  if(segnalazione === null){
    return "Loading...";
  }
  
  const handleChange = (key, value) => {
    setSegnalazione((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const showDialog = () => {
    return isVisible ? "visible" : "hidden";
  }

  const statiPossibili = ["in attesa", "in lavorazione", "completata"];

  const changedSomething = () => {
    const oldData = sessionStorage.getItem("segnalazione");
    return oldData !== JSON.stringify(segnalazione);
  }

  const handleResolve = () => {
    const myHeaders = new Headers();
    myHeaders.append("password", "123456789");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${endpoint}/${segnalazione._id}`, requestOptions)
      .then((response) => {
        console.log(response);
        if(!response.ok) throw "Error resolving segnalazione";
        router.back();
      })
      .catch((error) => console.error(error));
  }

  const handleSubmit = () => {
    if(segnalazione.stato === "completata") return handleResolve();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "id": segnalazione._id,
      "stato": segnalazione.stato,
      "password": "123456789"
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(endpoint, requestOptions)
      .then((response) => {
        if(!response.ok) throw "Error updating status"
        router.back();
      })
      .catch((error) => console.error(error));
  }

  const handleBack = () => {
    if(changedSomething()) {
      setIsVisible(true);
      setAction(() => router.back);
    } else { 
      router.back()
    }
  }

  return (
    <div className="h-full">
      <GoBack onClick={handleBack}/> 
      <div className="p-4 my-12 border rounded-lg shadow-md bg-white flex flex-col w-1/2 m-auto h-1/3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Modifica Stato Segnalazione</h2>
          <h3 className="text-gray-700 font-bold mb-2">{segnalazione.oggetto}</h3>
          <p className="text-gray-700">{segnalazione.descrizione}</p>
        </div>
        <select
          className="w-full p-2 border rounded"
          value={segnalazione.stato}
          onChange={(e) => handleChange("stato",e.target.value)}
        >
          {statiPossibili.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          disabled={changedSomething() ? false : true}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          onClick={() => {
            setIsVisible(true);
            setAction(() => handleSubmit);
          }}
        >
          Aggiorna Stato
        </button>
      </div> 
      <div 
        className="absolute inset-0 h-full flex items-center justify-center bg-black bg-opacity-50" 
        style={{visibility: showDialog()}}>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold">Are you sure?</h2>
          <p className="text-gray-600">"This action cannot be undone."</p>
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={() => {
                action();
                setIsVisible(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Conferma</button> 
            <button
              onClick={() => setIsVisible(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancella</button>
          </div>
        </div>
      </div>
    </div>
  );
}
