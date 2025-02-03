import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import * as proj from 'ol/proj';
import Overlay from 'ol/Overlay.js';
import newMarker from './Marker';
import Parco from "./Parco";
import ZoomSlider from 'ol/control/ZoomSlider';
import newGeolocation from './geolocation';

export default function MapView({parchi, parco, onClick, OnClose}) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const viewRef = useRef(null);
  useEffect(() => {
    if(ref.current && !mapRef.current){
      viewRef.current = new View({
        center: proj.fromLonLat([11.131709, 46.059779]),
        zoom: 14
      })
      const view = viewRef.current;
      mapRef.current = new Map({
        target: ref.current,
        layers: [
          new TileLayer({
            preload: 5,
            source: new XYZ({
              url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
          })
        ],
        view: view,
      });

      const map = mapRef.current;

      const zoomSlider = new ZoomSlider();
      map.addLayer(newGeolocation(view, map));
      map.addControl(zoomSlider);

      const popup = document.createElement('div');
      popup.className = 'ol-popup';
      popup.style.position = 'absolute';
      popup.style.background = 'white';
      popup.style.color = 'black';
      popup.style.padding = '10px';
      popup.style.border = '1px solid #ccc';
      popup.style.borderRadius = '5px';
      popup.style.minWidth = '100px';
      popup.style.textAlign = 'center';

      const overlay1 = new Overlay({
        element: popup,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      })

      map.addOverlay(overlay1);
  
      const displayPopup = (feature) => {
        const coordinates = feature.getGeometry().getCoordinates();
        const name = feature.get('name');
        //Bisogna usare il nome per recuperare i tag e inserirli nel popup
        // Mostra il popup
        popup.innerHTML = `<p>${name}</p>`;
        overlay1.setPosition(coordinates);
      }

      map.on('pointermove', (event) => {
        const pixel = map.getEventPixel(event.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        popup.style.visibility = hit ? "visible" : "hidden";
        if (hit) {
          const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
            return feature;
          });
          displayPopup(feature);
        }
      })
    }
  }, [ref, mapRef]);

  useEffect(() => parchi.forEach(parco => {
    mapRef.current?.addLayer(
      newMarker(parco.nome, parco.localizzazione.long, parco.localizzazione.lat)
    );
    mapRef.current?.on('click', (event) => {
      if(!mapRef.current?.hasFeatureAtPixel(event.pixel)) {
        onClick(null);
        return;
      }
      mapRef.current?.forEachFeatureAtPixel(event.pixel, (feature) => {
        parchi.forEach(parco => {
          if (parco.nome == feature.get("name")) {
            onClick(parco);
          }
        })
      })
    });
  }),[mapRef, parchi])

  useEffect(() => {
    if(parco != null) {
      viewRef.current?.animate({
        center: proj.fromLonLat([parco.localizzazione.long,parco.localizzazione.lat]),
        zoom: 18,
        duration: 2000,
      });
    }
  },[viewRef, parco])
  
  return <div className="w-full h-full flex flex-col md:flex-row">
    { parco === null ? <div id="suggerimenti">
      <div className="p-2">Suggerimenti</div>
      <ul className="h-full" style={{color: "black"}}>
          {parchi.slice(0,5).map(parco =>
            <li onClick={() => onClick(parco)} className="suggestion p-1 h-1/6" key={parco.nome}>{parco.nome}</li>
          )}
        </ul>
      </div> : <Parco parco={parco} />}
    <div ref={ref} id="map" className="h-full grow">
    </div>
  </div>;

}
