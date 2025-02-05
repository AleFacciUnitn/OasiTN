"use client";
import GestioneParchi from "./GestioneParchi";
import Header from "../Header";
import "../adminpage.css";
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {isAuthenticated} from '../utils.js';

export default function Parchi(){
  const router = useRouter();

  useEffect(() => isAuthenticated(router), []);

  return (
    <GestioneParchi />
  );
} 
