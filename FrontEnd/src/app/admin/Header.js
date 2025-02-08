"use client";
import {useRouter} from 'next/navigation';

export default function Header(){
  const router = useRouter();

  return (
    <div className="flex sticky w-full h-16 justify-between px-6" id="sidebar">
       <div 
         className="options" 
         id="admin" 
         onClick={() => router.push("/admin")}>Admin</div>
       <div 
         className="options" 
         onClick={() => router.push("/admin/parchi")}>Gestione Parchi</div>
       <div 
         className="options" 
         onClick={() => router.push("/admin/segnalazioni")}>Gestione Segnalazioni</div>
       <div 
         className="options" 
         onClick={() => router.push("/admin/tags")}>Gestione Tags</div>
       <div 
         className="options" 
         onClick={() => router.push("/admin/categorie")}>Gestione Categorie</div>
    </div>  
  );
}
