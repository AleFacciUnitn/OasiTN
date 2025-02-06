"use client";
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import GoBack from "../../GoBack";
import MapView from "../../../Map"
import { MdAdd, MdRemove, MdExpandMore, MdExpandLess, MdClose } from "react-icons/md";

export default function Page(){
  const router = useRouter();
  const [data, setData] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const [tags, setTags] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expand, setExpand] = useState(-1);
  const [action, setAction] = useState(() => {});
  const [clickPos, setClickPos] = useState([0,0]);

  useEffect(() => {
    const parcoStored = sessionStorage.getItem("parco");
    console.log(parcoStored);
    setData(JSON.parse(parcoStored));
    const categorieStored = sessionStorage.getItem("categorie");
    setCategorie(JSON.parse(categorieStored));
    const tagsStored = sessionStorage.getItem("tags");
    setTags(JSON.parse(tagsStored));
  }, []);
 
  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTagChange = (id, field, value) => {
    console.log(data.tags);
    const newTags = data.tags.map((tag,index) => {
      if(id != index) return tag;
      if(field === "nome") {
        return {
          ...tag,
          ["tagId"]: {...tag.tagId, [field]: value}
        };
      }
      if(field === "count") {
        return {
          ...tag,
          [field]: parseInt(value) || 0
        };
      }
    });
    setData((prev) => ({
      ...prev,
      ["tags"]: newTags,
    }));
  };

  const handleLocationChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: parseFloat(value) || 0 },
    }));
  };

  if (data === null || categorie === null || tags === null) return "Loading...";

  const showDialog = () => {
    return isVisible ? "visible" : "hidden";
  }

  const changedSomething = () => {
    const oldData = sessionStorage.getItem("parco");
    return oldData !== JSON.stringify(data);
  }

  const discardChanges = () => {
    const oldData = sessionStorage.getItem("parco");
    setData(JSON.parse(oldData));
  }

  const saveChanges = () => {
    sessionStorage.setItem("parco",null);
    //TODO: implement api save changes
    router.back();
  }
  
  const handleBack = () => {
  if(changedSomething()) {
      setIsVisible(true);
      setAction(() => router.back);
    } else { 
      router.back()
    }
  }

  const toggleIndex = (index) => {
    if(index == expand) setExpand(-1);
    else setExpand(index);
    console.log(expand);
  } 

  return (
    <div className="px-6 h-full flex items-center">
      <div className="flex flex-col w-1/3">
      <div className="flex items-center">
        <GoBack onClick={handleBack} />
        <h2 className="text-xl font-bold">Edit Parco</h2>
      </div>
      <div className="flex flex-col w-full pr-3">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={data.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Latitude</label>
          <input
            type="number"
            value={data.location.lat}
            onChange={(e) => handleLocationChange("lat", e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input
            type="number"
            value={data.location.long}
            onChange={(e) => handleLocationChange("long", e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <div className="flex flex-col gap-3">
            {data.tags.map((tag,index) => {
              return (<><div className="flex gap-6" key={index}>
                <select
                  type="text"
                  value={tag.tagId.nome}
                  onChange={(e) => handleTagChange(index,"nome", e.target.value)}
                  className="px-3 py-2 border w-4/5 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                >{tags.map((tag)=>{
                   console.log(tag);
                   return (<option key={tag._id} value={tag.nome}>{tag.nome}</option>);
                  })}</select>
                <input
                  type="number"
                  value={tag.count}
                  onChange={(e) => handleTagChange(index, "count", e.target.value)}
                  style={{minWidth: "0"}}
                  className="px-3 py-2 w-1/5 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                /></div>
                <div>
                  <div className="flex gap-6 items-center">
                    <label className="block text-sm font-medium">Localizzazioni</label>
                    <div className="cursor-pointer" onClick={() => toggleIndex(index)}>{expand === index ? <MdExpandLess /> : <MdExpandMore />}</div>
                  </div>
                  <div className={expand === index ? "visible" : "hidden"}>
                    {tag.positions.map((p,i) => {return (
                    <div className="flex justify-between items-center" key={"p"+i}>
                      <MdClose/>
                      <div>
                        <label className="block text-sm font-medium">Latitude</label>
                        <input
                          type="number"
                          value={p.lat}
                          onChange={(e) => handleLocationChange("long", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Longitude</label>
                        <input
                          type="number"
                          value={p.long}
                          onChange={(e) => handleLocationChange("long", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                      </div>
                    </div>);})}
                  </div>
                </div></>
              );
            })}
            <div className="flex gap-6">
              <button 
                className="w-full flex items-center justify-center border rounded-md px-3 py-2 bg-white"
                onClick={() => {
                  const dataTags = data.tags;
                  dataTags.push({"tagId":tags[0],"count":0,"positions":[]});
                  handleChange("tags",dataTags);
                }}
              ><MdAdd /></button>
              <button 
                className="w-full flex justify-center items-center border rounded-md px-3 py-2 bg-white disabled:bg-gray-300"
                disabled={data.tags.length === 0 ? true : false}
                onClick={() => {
                  const tags = data.tags;
                  tags.pop();
                  handleChange("tags",tags);
                }}
              ><MdRemove /></button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Info Parco</label>
          <input
            type="text"
            value={data.infoParco}
            onChange={(e) => handleChange("infoParco", e.target.value || null)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-row gap-6">
        <button 
          onClick={() => {
            if(changedSomething()){
              setIsVisible(true);
              setAction(() => saveChanges);
            } else {
              router.back();
            }
            console.log(data);
          }} 
          className="mt-4 w-1/2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Save
        </button>
        <button 
          disabled={changedSomething() ? false : true}
          onClick={() => {
            setIsVisible(true);
            setAction(() => discardChanges);
          }} 
          className="mt-4 w-1/2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:bg-red-300 transition"
        >
          Discard
        </button>
       </div>
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
      <div className="h-full grow">
        <MapView parchi={JSON.parse(sessionStorage.getItem("parchi"))} parco={data} admin={true} setClickPos={setClickPos}/>
      </div>
    </div>
  );
}
