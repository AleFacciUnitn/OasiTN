"use client";
import {useState, useEffect} from 'react';
import "../../adminpage.css";

export default function Page(){
  const [data, setData] = useState(null);
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Parco</h2>
      <div className="flex flex-col md:w-1/3">
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
          <label className="block text-sm font-medium">Tags (comma separated)</label>
          <input
            type="text"
            value={data.tags.join(", ")}
            onChange={(e) => handleChange("tags", e.target.value.split(", "))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Info Parco</label>
          <input
            type="text"
            value={data.infoParco || ""}
            onChange={(e) => handleChange("infoParco", e.target.value || null)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-row gap-6">
        <button 
          onClick={() => console.log(data)} 
          className="mt-4 grow bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Save
        </button>
        <button 
          onClick={() => console.log(data)} 
          className="mt-4 grow bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Delete
        </button>
       </div>
      </div>
    </div>
  );
}
