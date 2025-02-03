export default function Parco({parco}){
  console.log(parco);
  return (
    <aside 
      className="h-1/2 md:h-full md:w-64 lg:w-96 duration-1000 ease-in" 
      style={{
        background:"white",
        color: "black", 
        width: "350px"
      }}>
      <div className="flex h-1/4" style={{background: "limegreen"}}>
        <h1 className="self-end bold text-2x1">{parco.nome}</h1>
      </div>
      <div className="grow">
        <div>
          <p>{parco.descrizione}</p>
        </div>
        <div>
          <h2>Categorie</h2>
          <ul>
          {parco.categorie.map(cat =>
            <li key={cat}>{cat}</li>
          )}
          </ul>
        </div>
        <div>
          <h2>Tags</h2>
          <ul>
          {parco.tags.map(tag =>
            <li key={tag.nome}>{tag.nome}{tag.count}</li>
          )}
          </ul>
        </div>
      </div>
    </aside>);
}
