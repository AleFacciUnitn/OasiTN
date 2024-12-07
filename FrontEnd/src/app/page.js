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
      content: 'This is the hotbar where you can navigate through different sections.',
    },
    {
      target: '#logo',
      content: 'This is the logo of the application.',
    },
    {
      target: '#searchbar',
      content: 'Use this search bar to find content quickly.',
    },
    {
      target: '#help',
      content: 'Click here to get help or report an issue.',
    },
    {
      target: '#map',
      content: 'This is the map view where you can see the locations.',
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
