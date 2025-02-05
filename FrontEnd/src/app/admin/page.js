"use client";
import React, { useState, useEffect, useRef } from 'react';
import {useRouter} from 'next/navigation';
import Dashboard from "./Dashboard";
import {isAuthenticated} from "./utils.js";

export default function Home() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    isAuthenticated(router); 
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
        <div id="content">
          <Dashboard router={router}/>
        </div>
    </div>
  );
}
