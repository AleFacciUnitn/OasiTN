"use client";
import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import NavItem from "./NavItem";
import MapView from "./Map";
import CercaParchi from "./CercaParchi";
import SegnalazioniForm from "./SegnalazioniForm";
import Loading from "./Loading";
import Error from "./Error";
import "./globals.css";

export default function Home() {
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSegnalazioniVisible, setIsSegnalazioniVisible] = useState(false);
  const [parchi, setParchi] = useState([]);
  const [parco, setParco] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const storedParks = sessionStorage.getItem("parchi")
    if(!storedParks){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
  
      fetch("http://localhost:5000/api/user/init", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          sessionStorage.setItem(
            "parchi",
            JSON.stringify(
              JSON.parse(JSON.stringify(JSON.parse(result).parchi))
            )
          )
          setParchi(JSON.parse(sessionStorage.getItem("parchi")));
        })
        .catch((error) => setError(error));
    } else {
      setParchi(JSON.parse(storedParks));
    }
  }, []);

  const steps = [
    {
      target: '#hotbar',
      content: 'Utilizza il menú per navigare i parchi usando i filtri disponibili.',
    },
    {
      target: '#searchbar',
      content: 'Cerca qui quello che desideri trovare.',
    },
    {
      target: '#help',
      content: 'Puoi utilizzare "segnalazione per segnalare un problema o una inaccuratezza e il pulsante "Help" per riprodurre nuovamente il tutorial.',
    },
    {
      target: '#map',
      content: 'Cliccando sui pin presenti sulla mappa puoi scoprire tutto sul parco selezionato.',
    },
  ];
  const segnalazioniVisibility = () => isSegnalazioniVisible ? "visible" : "hidden"; 

  const handleHelpClick = () => {
    setRun(true);
  };

  if(error != null){
    return <Error error={error}/>; 
  }

  if(parchi.length === 0) {
    return <Loading message="Caricamento mappa..."/>;
  }

  return (
    <div className="flex flex-col relative h-full">
      {isClient && (
        <Joyride
          steps={steps}
          run={run}
          continuous
          showProgress
          showSkipButton
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      )}
      <div className="gap-4 px-2 sticky" id="hotbar">
        <div className="flex-none" id="hotbar-left">
          <div id="logo" style={{ display: "inline-block" }} ></div>
        </div>
        <div className="flex grow justify-evenly h-full" id="hotbar-center">
        <NavItem name="Sport">
          <ul className="topdown-menu w-full absolute">
            <li><span className="filter">Calcio</span></li>
            <li><span className="filter">Basket</span></li>
            <li><span className="filter">Ping-Pong</span></li>
          </ul>
        </NavItem>
        <NavItem name="Giochi" />
        <NavItem name="Relax" />
        <NavItem name="Varie" />
        </div>    
        <div className="flex-none" id="hotbar-right">
          <CercaParchi parchi={parchi} OnClick={setParco}/>
        </div>
      </div>
      <MapView parchi={parchi} parco={parco} onClick={setParco} OnClose={setParco}/>
      {/* <div id="track"/> */}
      <div id="help">
        <div className="flex grow justify-center gap-6" id="help-content">
          <div className="cursor-pointer" onClick={() => setIsSegnalazioniVisible(!isSegnalazioniVisible)}>Segnalazione</div>
          <h2>|</h2>
          <div className="cursor-pointer" onClick={handleHelpClick}>Help</div>
      </div>
      </div>
      <div
        style={{visibility: segnalazioniVisibility()}}
        className="absolute w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
        <SegnalazioniForm parchi={parchi} close={() => setIsSegnalazioniVisible(!isSegnalazioniVisible)}/>
      </div>
    </div>
  );

}
