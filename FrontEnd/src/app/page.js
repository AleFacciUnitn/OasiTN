"use client";
import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import NavItem from "./NavItem";
import MapView from "./Map";
import "./globals.css";

export default function Home() {
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
  const handleHelpClick = () => {
    setRun(true);
  };
  return (
    <div>
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
      <div id="hotbar">
        <div id="logo" style={{ display: "inline-block" }} ></div>
        <NavItem name="Sport">
          <ul className="topdown-menu">
            <li><span className="filter">Calcio</span></li>
            <li><span className="filter">Basket</span></li>
            <li><span className="filter">Ping-Pong</span></li>
          </ul>
        </NavItem>
        <NavItem name="Giochi" />
        <NavItem name="Relax" />
        <NavItem name="Varie" />
        <div id="searchbar"><input type="text" placeholder="Search..." className='search-bar'/>
        </div>
      </div>
      <MapView/>
      {/* <div id="track"/> */}
      <div id="help">
        <div id="help-content" onClick={handleHelpClick}>
          <h1><a href="#">Segnalazione</a></h1>
          <h2>|</h2>
          <h3><a href="#">Help</a></h3>
      </div>
      </div>
    </div>
  );

}
