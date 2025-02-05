"use client";
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import GestioneSegnalazioni from "./GestioneSegnalazioni";
import {isAuthenticated} from "../utils.js";

export default function Page() {
  const router = useRouter();
  useEffect(() => isAuthenticated(router), []);
  return (<GestioneSegnalazioni />);
}
