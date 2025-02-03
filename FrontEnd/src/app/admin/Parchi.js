export default function Parchi({parchi}) {
  console.log(parchi);
  const listParchi = parchi.map(parco => {
    <li key={parco.nome}>{parco.nome}</li>
  })
 
  return (
    <ul>{listParchi}</ul>
  );
}
