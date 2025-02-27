import {MdDelete} from "react-icons/md";

export default function Parco({parco, onClick, onClickX}){
  return (
    <div
      className="flex justify-between px-4 py-6 my-1 items-center bg-white rounded-lg"
    >
      <div
        className="grow cursor-pointer"
      onClick={onClick}>
        <h1 style={{fontWeight: "bold"}}>{parco.nome}</h1>
        <p>{parco.infoParco}</p>
      </div>
      <MdDelete
       className="cursor-pointer hover:text-red-600"
       onClick={onClickX}/>
    </div>
  );
}
