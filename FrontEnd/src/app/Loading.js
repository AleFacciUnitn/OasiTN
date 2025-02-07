export default function Loading({message}){
  return(
    <div className="flex text-white flex-col justify-center items-center h-screen w-screen fixed top-0 left-0 bg-black z-50">
      <h1 className="font-semibold text-xl">{message}</h1>
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
