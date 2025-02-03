"use client";
import "./adminpage.css";
import React, { useState, useEffect, useRef } from 'react';
import {useRouter} from 'next/navigation';
import Dashboard from "./Dashboard";
import GestioneSegnalazioni from "./GestioneSegnalazioni";
import Header from "./Header";

export default function Home() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if(storedToken){
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
        <Header router={router}/>
        <div id="content">
          <Dashboard />
        </div>
    </div>
  );
}
