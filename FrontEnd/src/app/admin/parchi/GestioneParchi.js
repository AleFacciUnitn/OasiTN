import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Parco from "./Parco";
import CercaParchi from "../../CercaParchi";
import Error from "../../Error";
import { MdSortByAlpha, MdSouth, MdNorth, MdAdd, MdRefresh } from "react-icons/md";

export default function GestioneParchi(){
  const router = useRouter();
  var sortFunction = (a,b) => a.nome.localeCompare(b.nome);
  const [sortType, setSortType] = useState("az");
  const [parchi, setParchi] = useState([]);
  const endpoint = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")+"/admin/Parco";

  const refresh = () => {
      const myHeaders = new Headers();
      myHeaders.append("password", "123456789");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch(endpoint, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if(!data.data) return;
          sessionStorage.setItem("parchi", JSON.stringify(data.data));
          setParchi(data.data);
        })
        .catch((error) => console.error(error));
  }

  useEffect(() => {
    if(parchi.length != 0) return;
    const storedParchi = sessionStorage.getItem("parchi");
    if(!storedParchi) refresh();
    else setParchi(JSON.parse(storedParchi));
  }, [parchi]);

  const toggleSortType = () => {
    if(sortType === "az") setSortType("za");
    else setSortType("az");
  }

  switch(sortType){
    case "za": 
      sortFunction = (a,b) => b.nome.localeCompare(a.nome);
      break;
    case "az": 
      sortFunction = (a,b) => a.nome.localeCompare(b.nome);
      break;
    default:
      return <Error error="Sorting method not implemented"/>
  }

  const modificaParco = (parco) => {
    sessionStorage.setItem("parco", JSON.stringify(parco));
    router.push("/admin/parchi/"+parco.nome.toLowerCase().replaceAll(" ", ""));
  }
 
  const deleteParco = (parco) => {
    const myHeaders = new Headers();
    myHeaders.append("password", "123456789");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${endpoint}/${parco._id}`, requestOptions)
      .then((response) => {
         if(!response.ok) throw `Error ${response.status}`;
         refresh();
       })
      .catch((error) => console.error(error));
  }

  return (
    <div className="px-10 grow flex flex-col overflow-auto">
      <div className="flex justify-between py-4 items-center">
        <div className="flex lg:w-1/5 w-1/3 justify-between items-center">
          <h2 className="text-2xl font-bold">Gestione parchi</h2>
          <div
            className="cursor-pointer flex"
            onClick={toggleSortType}>
            {sortType === "az" ? <MdSouth/> : <MdNorth/>}
            <MdSortByAlpha />
          </div>
	  <MdRefresh onClick={refresh}/>
        </div>
        <CercaParchi className="py-4" parchi={parchi} OnClick={modificaParco}/>
      </div>
      <div className="grow flex flex-col overflow-auto">
        <ul className="flex flex-col gap-3 overflow-auto">
         {parchi.sort(sortFunction).map(parco => 
           <Parco 
             key={parco.nome} 
             parco={parco} 
             onClick={() => modificaParco(parco)}
             onClickX={() => deleteParco(parco)}
           />)}
        </ul>
      </div>
      <button
        onClick={() => {
          modificaParco({
            "nome":"Nuovo Parco",
            "infoParco":null,
            "location":{"lat":46.067615,"long":11.123598},
            "tags":[],
            "categorie":[]
          });
          router.push("/admin/parchi/crea")
        }} 
        className="fixed bottom-6 right-6 flex justify-center items-center size-14 bg-green-300 hover:bg-green-500 rounded-lg"
      ><MdAdd /></button>
    </div>
  );
}
