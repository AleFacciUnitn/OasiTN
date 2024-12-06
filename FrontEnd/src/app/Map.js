import React, { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import * as proj from 'ol/proj';
import parks from '../../assets/parks.json'
import newMarker from './Marker';
import ZoomSlider from 'ol/control/ZoomSlider';
import newGeolocation from './geolocation';

export default function MapView() {
    
    useEffect(() => {
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

        const zoomSlider = new ZoomSlider();
        console.log("ciao");
        map.addLayer(newGeolocation(view,map));
        map.addControl(zoomSlider);
        parks.forEach(park =>{
            map.addLayer(newMarker(park.name, park.longitude, park.latitude));
        })

    }, []);
    
    return <div id="map" style={{ width: "100%", height: "100vh" }}>
        <div id="suggerimenti">Suggerimenti</div>
    </div>;

}