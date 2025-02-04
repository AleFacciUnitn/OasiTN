import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Parco from "./Parco";
import CercaParchi from "../../CercaParchi";
import Error from "../../Error";

export default function GestioneParchi(){
  const router = useRouter();
  var sortFunction = (a,b) => a.nome.localeCompare(b.nome);
  const [sortType, setSortType] = useState("az");
  const [parchi, setParchi] = useState([]);

  useEffect(() => {
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
    const newArray = parchi.filter((item) => item != parco);
    setParchi(newArray);
  }

  return (
    <div className="px-10">
      <div className="flex justify-between py-4 items-center">
        <div className="flex w-1/4 justify-between">
          <div>Gestione parchi</div>
          <div
           className="cursor-pointer"
           onClick={toggleSortType}>{sortType === "az" ? "az" : "za"}</div>
        </div>
        <CercaParchi className="py-4" parchi={parchi} OnClick={modificaParco}/>
      </div>
      <div>
        <ul className="flex flex-col gap-3">
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
            "descrizione":"Nessuna descrizione",
            "localizzazione":{"lat":0.0,"long":0.0},
            "tags":[],
            "categorie":[]
          });
          router.push("/admin/parchi/crea")
        }} 
        className="fixed bottom-6 right-6 size-14 bg-green-300 hover:bg-green-500 rounded-lg"
      >+</button>
    </div>
  );
}
