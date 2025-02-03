import {useState} from 'react';

export default function CercaParchi({parchi, OnClick}) {
  const [search, setSearch] = useState('');
 
  const searchScript = () => {
    //una volta visto come arrivano i dati posso fare anche la ricerca per tag
    if(search.trim().length === 0) return;
    console.log(search);
    var subset = parchi.filter(parco => parco.nome.toLowerCase().includes(search.toLowerCase()));
    return subset.slice(0,(5 > subset.length ? subset.length : 5)).map(parco => {
            return (
              <li onClick={() => OnClick(parco)} className="suggestion p-1" key={parco.nome}>{parco.nome}</li>
            ); 
          });
  }
 
  return (
    <div className="relative" id="searchbar">
      <input 
        type="text" 
        placeholder="Search..." 
        className='search-bar'
        value={search}
        onChange={e => setSearch(e.target.value)}/>
      <ul className="w-full my-1 absolute" id="searchSuggest">
        {searchScript()}
      </ul>
    </div>
  );
}


