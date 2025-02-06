export default function Parco({parco}){
  console.log(parco);
  return (
    <aside 
      className={"h-1/2 text-black bg-white md:h-full w-full md:w-64 lg:w-96 "+(parco === null ? "hidden" : "visible")}
      >
      <div className="flex h-1/4" style={{background: "limegreen"}}>
        <h1 className="self-end font-semibold text-2xl">{parco?.nome || ""}</h1>
      </div>
      <div className="grow">
        <div>
          <p>{parco?.infoParco || ""}</p>
        </div>
        <div>
          <h2 className="font-semibold text-md">Tags</h2>
          <ul>
          {parco?.tags.map(tag =>
            <li className="flex justify-between w-1/2" key={tag.tagId.nome}><span>{tag.tagId.nome}</span><span>{tag.count}</span></li>
          )}
          </ul>
        </div>
      </div>
    </aside>);
}
