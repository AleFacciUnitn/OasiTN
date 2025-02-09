"use client";
import {useState,useEffect} from 'react';
import Loading from '../../Loading';
import {MdEdit,MdOutlineCheck,MdAdd,MdClose, MdRefresh} from 'react-icons/md';

export default function Page(){
  const [categorie, setCategorie] = useState(null);
  const [tags, setTags] = useState(null);
  const [tag, setTag] = useState(null);
  const [clicked, setClicked] = useState(-1);
  const [edit, setEdit] = useState(-1);
  const [lastIndex, setLastIndex] = useState(-1);
  const endpoint = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")+"/admin/Tag";

  useEffect(() => {
    const storedTags = sessionStorage.getItem("tags");
    console.log(storedTags);;
    setTags(JSON.parse(storedTags));
    const storedCategorie = sessionStorage.getItem("categorie");
    setCategorie(JSON.parse(storedCategorie));
  }, []);

  const refresh = () => {
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
        sessionStorage.setItem("tags",JSON.stringify(JSON.parse(result).data));
        setTags(JSON.parse(result).data);
      })
      .catch((error) => console.error(error));
  }

  const create = (action) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "nome": tag.nome,
      "nomeCategoria": getCatNome(tag.categoria),
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
        setTag(null);
        action;
      })
      .catch((error) => console.error(error));
  }

  const update = (index,action) => {
    const tag = tags[index];
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "password": "123456789",
      "nome": tag.nome,
      "nomeCategoria": getCatNome(tag.categoria)
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${endpoint}/${tag._id}`, requestOptions)
      .then((response) => {
        if(!response.ok) throw `Error ${response.status}`;
        action;
      })
      .catch((error) => console.error(error));
  }

  const handleDelete = (index) => {
    const tag = tags[index]
    const myHeaders = new Headers();
    myHeaders.append("password", "123456789");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${endpoint}/${tag._id}`, requestOptions)
      .then((response) => {
        if(!response.ok) throw `Error ${response.status}`
        const newTags = [...tags];
        newTags.splice(index,1);
        setTags(newTags)
      })
      .catch((error) => console.error(error));
  }

  const handleSave = (index,action) => {
    if(tags[index].nome === "Nuovo tag") return;
    if(tag !== null && JSON.stringify(tags[index]) === JSON.stringify(tag)) create(action);
    else update(index,action);
    console.log("refreshing");
    refresh();
  }

  const toggleVar = (control,index,action) => {
    if(control) return handleSave(index,action(-1));
    return action(index);
  }
  
  const handleChange = (i, prop, value) => {
    if(tag !== null){
      var newTag = {...tag};
      newTag = {
        ...newTag,
        [prop]: value 
      };
      setTag(newTag);
    }
    const newTags = tags.map((t,index) => {
      if(i !== index) return t;
      return {
        ...t,
        [prop]: value
      };
    });
    setTags(newTags);
  }

  const getCatNome = (id) => {
    const cat = categorie.filter((c)=>c._id === id)[0];
    return cat.nome;
  }

  if(categorie === null || tags === null) return <Loading message="Caricando i tag..."/>

  return (
    <div className="flex flex-col w-full items-center gap-6">
      <div className="flex justify-between items-center w-1/3">
        <h1 className="font-semibold text-xl">Tags</h1><MdRefresh onClick={refresh}/>
      </div> 
      <ul className="flex flex-col gap-6 justify-center items-center w-full">
        {tags.map((c,index) => <li className="relative bg-white p-4 w-1/3 flex items-center justify-between rounded-xl" key={index}>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex">
              {edit === index ? <input className="w-2/3" onChange={(e) => handleChange(index,"nome",e.target.value)} value={c.nome}/> : c.nome}
              <div className="cursor-pointer" onClick={() => toggleVar(index===edit,index,(i) => setEdit(i))}>
                {edit === index ? <MdOutlineCheck/> : <MdEdit/>}
              </div>
            </div>
            <div className="flex gap-6">
              {clicked !== index ? <span>{getCatNome(c.categoria)}</span> : <select onChange={(e) => handleChange(index,"categoria",e.target.value)} value={c.categoria}>
                {categorie.map((cat, index) => {return( <option value={cat._id} key={"c"+index}>{cat.nome}</option>)})}
              </select>}
              <div className="cursor-pointer" onClick={() => toggleVar(index===clicked,index,(i) => setClicked(i))}>
                {clicked === index ? <MdOutlineCheck/> : <MdEdit/>}
              </div>
            </div>
          </div>
          <div className="absolute flex items-center justify-center -top-1 -right-1 bg-red-300 hover:bg-red-500 cursor-pointer text-center rounded-full"
            onClick={() => handleDelete(index)}>
            <MdClose className="size-3"/>
          </div>
        </li>)}
        <div className="bg-white p-4 w-1/3 flex items-center justify-center rounded-xl hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if(categorie[categorie.length-1].nome === "Nuova Categoria") return;
            const tag = {nome: "Nuovo Tag",categoria: categorie[0]._id};
            setTag(tag);
            const newTags = [...tags];
            newTags.push(tag);
            setTags(newTags);
            setEdit(newTags.length-1);
          }}><MdAdd/></div>
      </ul>
    </div>
  );
}
