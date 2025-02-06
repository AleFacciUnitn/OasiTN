"use client";
import {useState} from 'react';
import { MdClose } from "react-icons/md";

export default function RequestForm({close, parchi}) {
  const [formData, setFormData] = useState({
    parcoId: "",
    oggetto: "",
    descrizione: "",
    priorita: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(formData),
      redirect: "follow"
    };

    fetch("http://localhost:5000/api/user/Segnalazioni", requestOptions)
      .then((response) => {
        if(!response.ok) throw response
        close(); 
      })
      .catch((error) => console.error(error));
  };

  const wrapString = (nome) => {
    if(nome.length > 40) return nome.slice(0,40)+"...";
    return nome;
  }

  return (
    <div className="w-1/2 bg-white p-6 rounded-2xl shadow-lg text-gray-700">
      <div className="flex justify-between items-center mb-4">  
        <h2 className="text-xl font-semibold">Invia una segnalazione</h2>
        <MdClose className="cursor-pointer" onClick={close} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Priorità</label>
          <select
            name="parcoId"
            value={formData.parcoId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {parchi.map((parco) => <option key={parco.id} value={parco.id}>{wrapString(parco.nome)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Oggetto</label>
          <input
            type="text"
            name="oggetto"
            value={formData.oggetto}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descrizione</label>
          <textarea
            name="descrizione"
            value={formData.descrizione}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priorità</label>
          <select
            name="priorita"
            value={formData.priorita}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={1}>1 - Bassa</option>
            <option value={2}>2 - Media</option>
            <option value={3}>3 - Alta</option>
            <option value={4}>4 - Critica</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Invia segnalazione
        </button>
      </form>
    </div>
  );
}
