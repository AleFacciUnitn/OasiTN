export default function Header({router}){
  return (
    <div className="flex sticky w-full h-16 justify-between px-6" id="sidebar">
       <div className="options" id="admin" onClick={() => setSelectedOption(null)}>Admin</div>
       <div className="options" onClick={() => router.push("/admin/parchi")}>Gestione Parchi</div>
       <div className="options" onClick={() => setSelectedOption('segnalazioni')}>Gestione Segnalazioni</div>
    </div>  
  );
}
