"use client";
import {useEffect} from "react";

export default function Error({error}){
  useEffect(() => console.error(error),[]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
    </main>
  );
}
