"use client";
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import GoBack from "../../GoBack";
import MapView from "../../../Map";
import Loading from "../../../Loading";
import { MdAdd, MdRemove, MdExpandMore, MdExpandLess, MdClose, MdEdit } from "react-icons/md";

export default function Page(){
  const router = useRouter();
  const [data, setData] = useState(null);
  const [parco, setParco] = useState(null);
  const [tags, setTags] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expand, setExpand] = useState(-1);
  const [isClicked, setIsClicked] = useState(false);
  const [action, setAction] = useState(() => {});
  const endpoint = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")+"/admin/Parco";

  useEffect(() => {
    const parcoStored = sessionStorage.getItem("parco");
    setData(JSON.parse(parcoStored));
    const tagsStored = sessionStorage.getItem("tags");
    setTags(JSON.parse(tagsStored));
  }, []);
 
  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
        if(!data.success) throw `Error ${result}`;
        sessionStorage.setItem("parchi", JSON.stringify(data.data));
        router.back();
      })
      .catch((error) => console.error(error));
  }

  const handleTagChange = (id, value) => {
    const newTags = data.tags.map((tag,index) => {
      if(id != index) return tag;
      return {
        ...tag,
        tagId: tags.filter((t)=>t.nome===value)[0]
      };
    });
    setData((prev) => ({
      ...prev,
      ["tags"]: newTags,
    }));
  };

  useEffect(()=>{
    if(data === null) return;
    const parcoTmp = structuredClone(data);
    setParco(parcoTmp);
  }, [data]);

  const handleClickActionLocation = (coord) => {
    handleLocationChange("lat",coord[1]);
    handleLocationChange("long",coord[0]);
  }

  const handleLocationChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: parseFloat(value) || 0 },
    }));
  };

  if (data === null || parco === null || tags === null) return <Loading message="Recuperando i dati del parco..."/>;


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

  const update = (raw) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${endpoint}/${parco._id}`, requestOptions)
      .then((response) => {
        //if(!response.ok) throw `Error ${response}`;
	return response;
      }).then((res) => {
	console.error(res)
	console.log(res.text);
      })
      .catch((error) => console.error(error));
  }

  const create = (raw) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(endpoint, requestOptions)
      .then((response) => {
        if(!response.ok) throw `Error ${response.status}`;
      })
      .catch((error) => console.error(error));
  }

  const saveChanges = () => {
    console.log(parco);
    parco.password = "123456789";
    const raw = JSON.stringify(parco);
    if(parco._id) update(raw);
    else create(raw);
    refresh();
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
  } 

  return (
    <div className="pl-6 h-full flex items-center">
      <div className="flex flex-col w-1/3">
      <div className="flex items-center">
        <GoBack onClick={handleBack} />
        <h2 className="text-xl font-bold">Edit Parco</h2>
      </div>
      <div className="flex flex-col w-full gap-6 pr-3">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={data.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium">Latitude</label>
          <input
            type="number"
            disabled={!isClicked}
            value={data.location.lat}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input
            type="number"
            disabled={!isClicked}
            value={data.location.long}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <MdEdit className="cursor-pointer self-center size-8" onClick={() => setIsClicked(!isClicked)}/>
        </div>
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <div className="flex flex-col gap-3">
            {data.tags.map((tag,index) => {
              return (
                <div key={index}><div className="flex gap-6">
                  <select
                    value={tag.tagId.nome}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="px-3 py-2 border w-4/5 rounded-md bg-white focus:outline-none focus:ring focus:ring-blue-300"
                  >{tags.map((t)=>{
                    return (<option key={t._id} value={t.nome}>{t.nome}</option>);
                    })}
                  </select>
                  <div className="flex w-1/5 items-center">
                    <MdRemove className="cursor-pointer" onClick={() => {
                      const newTags = data.tags.map((t,i) => {
                        if(i !== index) return t;
                        console.log(t);
                        t.count--;
                        t.positions.pop();
                        return t
                      });
                      handleChange("tags",newTags); 
                    }}/>
                    <div
                      className="px-3 py-2 border bg-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      >{tag.count}</div>
                    <MdAdd  className="cursor-pointer" onClick={() => {
                      const newTags = data.tags.map((t,i) => {
                        if(i !== index) return t;
                        console.log(t);
                        t.count++;
                        t.positions.push({"lat":0,"long":0});
                        return t
                      });
                      handleChange("tags",newTags); 
                    }}/>
                  </div>
                </div>
              </div>
              );
            })}
            <div className="flex gap-6">
              <button 
                className="w-full flex items-center justify-center border rounded-md px-3 py-2 bg-white"
                onClick={() => {
                  const dataTags = [...data.tags];
                  dataTags.push({"tagId":tags[0],"count":1,"positions":[{"lat":0,"long":0}]});
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
          <textarea
            type="text"
            value={data.infoParco || ""}
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
              //router.back();
              saveChanges();
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
      </div>
      <div className="h-full grow">
        <MapView parco={data} admin={true} handleLocationChange={handleClickActionLocation} isClicked={isClicked}/>
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
