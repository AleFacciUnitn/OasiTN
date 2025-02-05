import {useState, useEffect} from "react";
import Error from "../Error";

export default function Dashboard({router}){
  const [segnalazioni, setSegnalazioni] = useState(null);
  const [parchi, setParchi] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [notifica, setNotifica] = useState(false);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("password", "123456789");

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
    
    const storedParchi = sessionStorage.getItem("parchi");
    if(!storedParchi) {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("http://localhost:5000/api/admin/Parco?", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if(!data.data) return;
          sessionStorage.setItem("parchi", JSON.stringify(data.data));
          setParchi(data.data);
        })
        .catch((error) => setError(error));
    } else {
      setParchi(JSON.parse(storedParchi));
    }

    const storedCategorie = sessionStorage.getItem("categorie");
    if(!storedCategorie){
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("http://localhost:5000/api/admin/Categoria", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const resultJSON = JSON.parse(result);
          if(!resultJSON.success) throw "Error fetching data";
          const categorie = resultJSON.data;
          sessionStorage.setItem("categorie",JSON.stringify(categorie));
        })
        .catch((error) => setError(error));
    }
  },[]);

  useEffect(() => {
    if (segnalazioni === null) return;
    const segnalazioniPending = segnalazioni.filter((s) => s.stato === "in attesa");
    if (segnalazioniPending.length > 0) {
      setMessage(`${segnalazioniPending.length} Segnalazione/i in attesa`);
      setNotifica(true);
    }
  }, [segnalazioni]);

  if(error != null){
    return <Error error={error}/>
  }

  if(segnalazioni === null || parchi === null){
    return "Loading...";
  }

  const notificheSegnalazioni = () => {
    const segnalazioniPending = segnalazioni.filter((s) => s.stato === "in attesa");
    if (segnalazioniPending.length > 0) {
      setMessage(`${segnalazioniPending.length} Segnalazion${segnalazioniPending.length > 1 ? e : i} in attesa`);
      setNotifica(true);
    }
  }
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="flex gap-6 flex-col">
        <div
          onClick={() => router.push("/admin/segnalazioni")}
          className="flex relative justify-between items-center py-4 px-4 rounded-lg bg-white hover:bg-gray-300 cursor-pointer w-full">
          {notifica ? <><span 
            className="absolute inline-flex size-3 animate-ping rounded-full bg-red-400 opacity-75" 
            style={{top: "-2px",right: "-2px"}}></span>
          <span 
            className="absolute inline-flex size-3 rounded-full bg-red-500" 
            style={{top: "-2px",right: "-2px"}}></span></> : ""}
          <div>
            <h1>Segnalazioni</h1>
            <span className="text-gray-500 text-sm">{message}</span>
          </div>
          {segnalazioni.length}
        </div>
        <div 
          onClick={() => router.push("/admin/parchi")}
          className="flex justify-between py-4 px-4 rounded-lg bg-white hover:bg-gray-300 cursor-pointer w-full">
          <h1>Parchi</h1>
          {parchi.length}
        </div>
      </div>
    </div>
  );
}
