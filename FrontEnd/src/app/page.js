"use client";
import React, { useEffect } from 'react';
import NavItem from "./NavItem";
import MapView from "./Map";

export default function Home() {
  
  return (
    <div>
      <div id="hotbar">
        <div id="logo" style={{ display: "inline-block" }} ></div>
        <NavItem name="Sport" />
        <NavItem name="Giochi" />
        <NavItem name="Relax" />
        <NavItem name="Varie" />
        <div id="searchbar"><input type="text" placeholder="Search..." className='search-bar'/>
        </div>
      </div>
      <MapView/>
      <div id="track"/>
    </div>
  );

}
