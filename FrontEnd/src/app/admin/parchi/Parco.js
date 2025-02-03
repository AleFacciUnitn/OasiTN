export default function Parco({parco, onClick}){
  return (
    <div
      className="flex justify-between p-2 my-1"
      style={{background: "white", borderRadius: "1rem"}}
      onClick={onClick}
    >
      <span>{parco.nome}</span>
      <span>x</span>
    </div>
  );
}
