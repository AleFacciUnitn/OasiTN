"use client";
import {useState,useEffect} from 'react';
import Loading from '../../Loading';
import {MdEdit,MdOutlineCheck,MdAdd,MdClose, MdRefresh} from 'react-icons/md';

export default function Page(){
  const [categorie, setCategorie] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [edit, setEdit] = useState(-1);
  const [lastIndex, setLastIndex] = useState(-1);
  const endpoint = (process.env.REACT_APP_API_URL || "http://localhost:5000/api")+"/admin/Categoria"

  useEffect(() => {
    const storedCategorie = sessionStorage.getItem("categorie");
    setCategorie(JSON.parse(storedCategorie));
  }, []);

  const updateCategorie = () => {
    const myHeaders = new Headers();
    myHeaders.append("password", "123456789");

    const requestOptions = {
     method: "GET",
     headers: myHeaders,
     redirect: "follow"
    };
     
    fetch(endpoint, requestOptions)
      .then((response) => {
        if(!response.ok) throw `Error ${response.status}`;
        return response.text();
      })
      .then((result) => {
        sessionStorage.setItem("categorie",JSON.stringify(JSON.parse(result).data));
        setCategorie(JSON.parse(result).data);
      })
      .catch((error) => console.error(error));
  }

  const createCategoria = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "nome": categoria.nome,
      "descrizione": "",
      "password": "123456789"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(endpoint, requestOptions)
      .then((response) => {
        if(!response.ok) throw `Errore ${response.status}`;
        setCategoria(null);
        setEdit(-1);
      })
      .catch((error) => console.error(error));
  }

  const updateCategoria = () => {
    const categoria = categorie[edit];
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "password": "123456789",
      "nome": categoria.nome,
      "descrizione": ""
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${endpoint}/${categoria._id}`, requestOptions)
      .then((response) => {
        if(!response.ok) throw `Error ${response.status}`;
        setEdit(-1);
      })
      .catch((error) => console.error(error));
  }

  const handleDelete = (index) => {
    const categoria = categorie[index]
    const myHeaders = new Headers();
    myHeaders.append("password", "123456789");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${endpoint}/${categoria._id}`, requestOptions)
      .then((response) => {
        if(!response.ok) throw `Error ${response.status}`
        const newCategorie = [...categorie];
        newCategorie.splice(index,1);
        setCategorie(newCategorie)
      })
      .catch((error) => console.error(error));
  }

  const handleSave = () => {
    if(categorie[edit].nome === "Nuova Categoria") return;
    if(categoria !== null) createCategoria();
    else updateCategoria();
    updateCategorie();
  }

  const toggleIndex = (index) => {
    if(index === edit) return handleSave();
    return setEdit(index);
  }
  
  const handleChange = (i, value) => {
    if(categoria !== null){
      const newCategoria = {"nome": value};
      setCategoria(newCategoria);
    }
    const newCategorie = categorie.map((c,index) => {
      if(i !== index) return c;
      return {
        ...c,
        ["nome"]: value
      };
    });
    setCategorie(newCategorie);
  }

  if(categorie === null) return <Loading message="Caricando le categorie..."/>

  return (
    <div className="flex flex-col w-full items-center gap-6">
      <div className="flex justify-between items-center w-1/3">
        <h1 className="font-semibold text-xl">Categorie</h1><MdRefresh onClick={updateCategorie}/>
      </div> 
      <ul className="flex flex-col gap-6 justify-center items-center w-full">
        {categorie.map((c,index) => <li className="relative bg-white p-4 w-1/3 flex items-center justify-between rounded-xl" key={index}>
          {edit === index ? <input onChange={(e) => handleChange(index,e.target.value)} value={c.nome}/> : c.nome}
          <div className="cursor-pointer" onClick={() => toggleIndex(index)}>
            {edit === index ? <MdOutlineCheck/> : <MdEdit/>}
          </div>
          <div className="absolute flex items-center justify-center -top-1 -right-1 bg-red-300 hover:bg-red-500 cursor-pointer text-center rounded-full"
            onClick={() => handleDelete(index)}>
            <MdClose className="size-3"/>
          </div>
        </li>)}
        <div className="bg-white p-4 w-1/3 flex items-center justify-center rounded-xl hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if(categorie[categorie.length-1].nome === "Nuova Categoria") return;
            const categoria = {nome: "Nuova Categoria"};
            setCategoria(categoria);
            const newCategorie = [...categorie];
            newCategorie.push(categoria);
            setCategorie(newCategorie);
            setEdit(newCategorie.length-1);
          }}><MdAdd/></div>
      </ul>
    </div>
  );
}
