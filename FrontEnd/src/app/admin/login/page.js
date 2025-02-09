"use client";
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Page(){
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");

  function generateToken(length = 64) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        token += characters[array[i] % characters.length];
    }
    
    return token;
  }

  useEffect(() => {
    if(!isAuthenticated) return;
    sessionStorage.setItem("token",generateToken())
    router.push("/admin");
  }, [isAuthenticated]);

  const handleLogin = () => {
    const data = {
      "password": password
    };

    const jsonData = JSON.stringify(data);

    const headers = new Headers();
    headers.append('Content-Type','application/json');

    fetch(`${process.env.API_URL}/admin/Login`,{
      method: 'POST',
      headers: headers,
      body: jsonData
    })
    .then(response => {
      if(!response.ok) {
        setIsValid(false);
        switch(response.status){
          case 400:
            setMessage("Formato non valido");
            break;
          case 403:
            setMessage("Password errata");
            break;
          case 500:
            setMessage("Errore nel server");
            break;
        }
        return;
      }
      setIsValid(true);
      setMessage("");
      setIsAuthenticated(true);
    })
  }  

  return (
    <div className="flex justify-center items-center h-full">
      <div className="rounded-md bg-white" style={{ width: "24rem", padding: "1.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", textAlign: "center" }}>Enter Your Password</h2>
        <div className="relative" style={{ marginTop: "1rem" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: "100%", padding: "0.5rem", paddingRight: "2rem", border: `1px solid ${isValid ? "#d1d5db" : "red"}`, borderRadius: "0.25rem" }}
          />
          <div
            className="absolute cursor-pointer"
            style={{right: "0.5rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none"}}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </div>
        </div>
        <span className="text-red-500">{message}</span>
        <button 
           disabled={password.length === 0 ? true : false}
           className="disabled:bg-blue-300 bg-blue-500"
           style={{ width: "100%", padding: "0.5rem", marginTop: "1rem", color: "white", border: "none", borderRadius: "0.25rem" }}
          onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
