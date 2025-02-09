import React, { useEffect, useRef } from 'react';
import {MdClose} from 'react-icons/md';
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

export default function MapView({parchi, parco, onClick, OnClose, admin, handleLocationChange, isClicked, selectedTags}) {
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
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          map.addLayer(newGeolocation(view, map));
        } else if (result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            () => map.addLayer(newGeolocation(view, map)), // If user allows, start tracking
            (error) => console.error(error.message)
          );
        } else {
          console.warn('Location access denied.');
        }
      });
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
        if(!feature.get('name')) return;
        const coordinates = feature.getGeometry().getCoordinates();
        const name = feature.get('name');
        //Bisogna usare il nome per recuperare i tag e inserirli nel popup
        // Mostra il popup
        popup.innerHTML = `<p>${name}</p>`;
        overlay1.setPosition(coordinates);
      }
      
      if(admin){
        map.on('click', (event) => {
          handleLocationChange(proj.transform(event.coordinate,'EPSG:3857','EPSG:4326'));
        });
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
          if(!feature.get('name')) {
            map.getTargetElement().style.cursor = "";
            popup.style.visibility = "hidden";
          }
          displayPopup(feature);
        }
      })
    }
  }, [ref, mapRef]);

  useEffect(() => {
    if(!parchi){
      mapRef.current?.getLayers().forEach(layer => {
        if(!layer || layer.get('name') !== 'marker') return;
        mapRef.current?.removeLayer(layer);
      });
      mapRef.current?.addLayer(
        newMarker(parco.nome, parco.location.long, parco.location.lat)
      );
      mapRef.current?.on('click', (event) => {
        if(admin) return;
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
      return;
    }
    parchi.forEach(parco => {
      mapRef.current?.addLayer(
        newMarker(parco.nome, parco.location.long, parco.location.lat)
      );
      mapRef.current?.on('click', (event) => {
        if(admin) return;
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
    })
  },[mapRef, parchi, parco])

  useEffect(() => {
    if(parco != null) {
      viewRef.current?.animate({
        center: proj.fromLonLat([parco.location.long,parco.location.lat]),
        zoom: 18,
        duration: 2000,
      });
    }
  },[viewRef, parco])

  const containsTag = (parco) => {
    if(selectedTags.length === 0) return true;
    if(parco.tags.length === 0) return false;
    var contains = false;
    parco.tags.forEach((tag) => {
      if(selectedTags.includes(tag.tagId.nome)) contains = true;
    });
    return contains;
  }
  
  return <div className="w-full h-full flex flex-col md:flex-row">
    <div className={"flex  w-[33%] lg:w-1/4 "+(parco === null ? "visible" : "hidden")} id="suggerimenti">
      <div className="p-2">Suggerimenti</div>
      {selectedTags.length !== 0 ? <div className="p-2 w-full flex flex-wrap"> 
        <span>Tags:</span>
        {selectedTags.map((tag) => <span key={tag} className="bg-gray-300 flex items-center rounded-full text-sm p-1">{tag}<MdClose onClick={() => {}} className="cursor-pointer"/></span>)}
      </div> : ""}
      <ul className="h-full" style={{color: "black"}}>
          {!parchi ? "" : parchi.filter((parco) => containsTag(parco)).slice(0,5).map(parco =>
            <li onClick={() => onClick(parco)} className="suggestion p-1 h-1/6" key={parco.nome}>{parco.nome}</li>
          )}
        </ul>
    </div>
    <Parco parco={admin ? null : parco} />
    <div ref={ref} id="map" className="h-full grow">
    </div>
  </div>;
}
