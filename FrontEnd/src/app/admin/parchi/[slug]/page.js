"use client";
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import "../../adminpage.css";

export default function Page(){
  const router = useRouter();
  const noDescrizione = "Nessuna descrizione"
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [action, setAction] = useState(() => {});

  useEffect(() => {
    const parcoStored = sessionStorage.getItem("parco");
    setData(JSON.parse(parcoStored));
  }, []);
  
  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLocationChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: parseFloat(value) || 0 },
    }));
  };

  if (data === null) return "Loading...";

  const showDialog = () => {
    return isVisible ? "visible" : "hidden";
  }

  const changedSomething = () => {
    const oldData = sessionStorage.getItem("parco");
    return JSON.parse(oldData) !== data;
  }

  const discardChanges = () => {
    const oldData = sessionStorage.getItem("parco");
    setData(JSON.parse(oldData));
  }


  return (
    <div className="p-6 flex flex-col justify-center">
      <div 
        className="cursor-pointer pb-4"
        onClick={() => {
          if(changedSomething()) {
            setIsVisible(true);
            setAction(() => router.back);
          } else { 
            router.back()
          }
        }}>
        <span>{"< "}</span>
        Go Back
      </div>
      <h2 className="text-xl font-bold mb-4">Edit Parco</h2>
      <div className="flex flex-col md:w-1/2">
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
            value={data.localizzazione.lat}
            onChange={(e) => handleLocationChange("lat", e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input
            type="number"
            value={data.localizzazione.long}
            onChange={(e) => handleLocationChange("long", e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <div className="flex flex-col gap-3">
            {data.tags.map((tag,index) => {
              return (<div className="flex gap-6" key={index}>
                <input
                  type="text"
                  value={tag.nome}
                  onChange={(e) => handleChange("tags", e.target.value.split(", "))}
                  className="px-3 py-2 border w-4/5 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                  type="number"
                  value={tag.count}
                  onChange={(e) => handleChange("tags", e.target.value.split(", "))}
                  style={{minWidth: "0"}}
                  className="px-3 py-2 w-1/5 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>);
            })}
            <div className="flex gap-6">
              <button 
                className="w-full border rounded-md px-3 py-2 bg-white"
                onClick={() => {
                  const tags = data.tags;
                  tags.push({nome: "",count: 0});
                  handleChange("tags",tags);
                }}
              >+</button>
              <button 
                className="w-full border rounded-md px-3 py-2 bg-white"
                onClick={() => {
                  const tags = data.tags;
                  tags.pop();
                  handleChange("tags",tags);
                }}
              >-</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-medium">Categorie</label>
          {data.categorie ? data.categorie.map((cat, index) => {
            return (<input
                  type="text"
                  value={cat}
                  key={index}
                  onChange={(e) => handleChange("tags", e.target.value.split(", "))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />);
          }) : "Nessuna Categoria"}
            <div className="flex gap-6">
              <button 
                className="w-full border rounded-md px-3 py-2 bg-white"
                onClick={() => {
                  const categorie = data.categorie;
                  categorie.push("");
                  handleChange("categorie",categorie);
                }}
              >+</button>
              <button 
                className="w-full border rounded-md px-3 py-2 bg-white"
                onClick={() => {
                  const categorie = data.categorie;
                  categorie.pop();
                  handleChange("categorie",categorie);
                }}
              >-</button>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Info Parco</label>
          <input
            type="text"
            value={data.descrizione === noDescrizione ? "" : data.descrizione}
            onChange={(e) => handleChange("infoParco", e.target.value || null)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-row gap-6">
        <button 
          onClick={() => console.log(data)} 
          className="mt-4 w-1/2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Save
        </button>
        <button 
          onClick={() => {
            setIsVisible(true);
            setAction(() => discardChanges);
          }} 
          className="mt-4 w-1/2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
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
  );
}
