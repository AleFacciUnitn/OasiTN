import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Parco from "./Parco";

export default function GestioneParchi(){
  const router = useRouter();
  const [parchi, setParchi] = useState([]);

  useState(() => {
    if(parchi.length != 0) return;
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
  }, [parchi]);

  return (
    <>
      <div>Gestione parchi</div>
      <div>
        <ul>
         {parchi.map(parco => 
           <Parco 
             key={parco.nome} 
             parco={parco} 
             onClick={() => {
               sessionStorage.setItem("parco", JSON.stringify(parco));
               router.push("/admin/parchi/"+parco.nome.toLowerCase().replaceAll(" ", ""));
             }}
           />)}
        </ul>
      </div>
    </>
  );
}
