"use client";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import piazza_centa from '../../assets/piazza_centa/piazza centa progettoIng.jpg';

const data = [
  { time: "08:00", crowd: 10 },
  { time: "09:00", crowd: 30 },
  { time: "10:00", crowd: 60 },
  { time: "11:00", crowd: 80 },
  { time: "12:00", crowd: 100 },
  { time: "13:00", crowd: 90 },
  { time: "14:00", crowd: 70 },
  { time: "15:00", crowd: 50 },
  { time: "16:00", crowd: 30 },
  { time: "17:00", crowd: 20 },
];

export default function Parco({parco}){
  console.log(parco);
  return (
    <aside 
      className={"h-1/2 text-black bg-white md:h-full gap-3 flex flex-col w-full md:w-1/2 lg:w-1/3 overflow-auto p-2 "+(parco === null ? "hidden" : "visible")}
      >
      <h1 className="self-start font-semibold text-3xl z-10">{parco?.nome || ""}</h1>
      <div className="px-6">
        <img src={piazza_centa.src} style={{borderRadius: ".75rem"}} className="w-full h-full"/>
      </div>
      <div className="grow text-md flex flex-col justify-between">
        <div>
          <p className="py-4">{parco?.infoParco || ""}</p>
          <h2 className="font-semibold text-xl">Tags</h2>
          <ul>
          {parco?.tags.map(tag =>
            <li className="w-1/2 flex justify-between" key={tag.tagId.nome}><span>{tag.tagId.nome}</span><span>{tag.count}</span></li>
          )}
          </ul>
        </div>
	  <div className="w-full h-64 flex items-center justify-center bg-white rounded-lg shadow-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20}>
          {/* Asse orizzontale senza linea visibile */}
          <XAxis dataKey="time" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />

          {/* Tooltip per mostrare dettagli al passaggio del mouse */}
          <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />

          {/* Barre trasparenti, arrotondate, in stile Google Maps */}
          <Bar dataKey="crowd" fill="rgba(66, 133, 244, 0.6)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
      </div>
    </aside>);
}
