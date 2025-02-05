import { MdArrowBack } from "react-icons/md";

export default function GoBack({onClick}){
  return (
    <div 
      className="p-4">
      <MdArrowBack
        className="cursor-pointer"
        onClick={onClick}/>
    </div>
  );
}
