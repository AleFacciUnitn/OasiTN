import React, { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import * as proj from 'ol/proj';
import Overlay from 'ol/Overlay.js';
import newMarker from './Marker';
import ZoomSlider from 'ol/control/ZoomSlider';
import newGeolocation from './geolocation';

export default function MapView({parchi}) {
        const view = new View({
            center: proj.fromLonLat([11.131709, 46.059779]),
            zoom: 14
        })
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: view,
        });
        parchi.forEach(parco => {
          map.addLayer(newMarker(parco.nome, parco.localizzazione.long, parco.localizzazione.lat));
        })

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

        map.on('click', (event) => {
            
            overlay1.setPosition(undefined);

            map.forEachFeatureAtPixel(event.pixel, (feature) => {
                
                    const coordinates = feature.getGeometry().getCoordinates();
                    const name = feature.get('name');
                    //Bisogna usare il nome per recuperare i tag e inserirli nel popup
                    // Mostra il popup
                    popup.innerHTML = `<p>${name}</p>`;
                    overlay1.setPosition(coordinates);
                
                return true;
            });

        })
        map.on('pointermove', (event) => {
          const pixel = map.getEventPixel(event.originalEvent);
          const hit = map.hasFeatureAtPixel(pixel);
          map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });

    return <div id="map" style={{ width: "100%", height: "100vh" }}>
        <div id="suggerimenti">
          <div>Suggerimenti</div>
          <ul className="h-full" style={{color: "black"}}>
          {parchi.slice(0,5).map(parco =>
             <li className="suggestion p-1i h-1/6" key={parco.nome}>{parco.nome}</li>
           )}
          </ul>
        </div>
    </div>;

}
