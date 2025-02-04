import {useState, useEffect} from "react";
import Error from "../Error";

export default function Dashboard({router}){
  const [segnalazioni, setSegnalazioni] = useState(null);
  const [parchi, setParchi] = useState(null);
  const [error, setError] = useState(null);

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
    
    const storedParchi = sessionStorage.getItem("parchi");
    if(!storedParchi) {
      const myHeaders = new Headers();
      myHeaders.append("password", "1234");

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
        .catch((error) => console.error(error));
    } else {
      setParchi(JSON.parse(storedParchi));
    }
  },[]);

  if(error != null){
    return <Error error={error}/>
  }

  if(segnalazioni === null || parchi === null){
    return "Loading...";
  }

  return (
    <div className="w-full">
      <div>Dashboard</div>
      <div className="flex gap-6 flex-col">
        <div
          onClick={() => router.push("/admin/segnalazioni")}
          className="flex relative justify-between py-4 px-4 rounded-lg bg-white hover:bg-gray-300 cursor-pointer w-full">
          {segnalazioni.length != 0 ? <><span 
            className="absolute inline-flex size-3 animate-ping rounded-full bg-red-400 opacity-75" 
            style={{top: "-2px",right: "-2px"}}></span>
          <span 
            className="absolute inline-flex size-3 rounded-full bg-red-500" 
            style={{top: "-2px",right: "-2px"}}></span></> : ""}
          <h1>Segnalazioni</h1>
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
