import {useState, useEffect} from "react";
import Error from "../Error";
import Loading from "../Loading";

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
    
    const storedTags = sessionStorage.getItem("tags");
    if(!storedCategorie){
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("http://localhost:5000/api/admin/Tag", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const resultJSON = JSON.parse(result);
          if(!resultJSON.success) throw "Error fetching data";
          const tags = resultJSON.data;
          sessionStorage.setItem("tags",JSON.stringify(tags));
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
    return <Loading message="Recuperando i dati..." />;
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
      <div className="flex gap-6 flex-col">
        <div
          className="flex flex-col gap-6 justify-between items-start py-4 px-4 rounded-lg w-full">
          <div className="flex justify-between w-full items-center">
            <h1 
              onClick={() => router.push("/admin/segnalazioni")}
              className="font-semibold cursor-pointer text-4xl">Segnalazioni</h1>
          <span className="text-4xl relative pr-3">{segnalazioni.length}{notifica ? <><span 
            className="absolute inline-flex size-3 animate-ping rounded-full bg-red-400 opacity-75" 
            style={{top: "-2px",right: "-2px"}}></span>
          <span 
            className="absolute inline-flex size-3 rounded-full bg-red-500" 
            style={{top: "-2px",right: "-2px"}}></span></> : ""}</span>
          </div>
            <span className="text-gray-500 text-md">{message}</span>
        </div>
        <div 
          onClick={() => router.push("/admin/parchi")}
          className="flex text-4xl justify-between py-4 px-4 cursor-pointer w-full">
          <h1 className="font-semibold">Parchi</h1>
          {parchi.length}
        </div>
      </div>
    </div>
  );
}
