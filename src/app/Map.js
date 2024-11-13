import React, { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import * as proj from 'ol/proj';
import * as style from 'ol/style';
import * as source from 'ol/source';
import * as layer from 'ol/layer';
import * as geom from 'ol/geom';
import * as control from 'ol/control';
import * as defaults from 'ol/control';
import Feature from 'ol/Feature';
import gps from  '../../assets/gps.png';
import parks from '../../assets/parks.json'

import newMarker from './Marker';
import ZoomSlider from 'ol/control/ZoomSlider';

export default function MapView() {
    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                center: proj.fromLonLat([11.131709, 46.059779]),
                zoom: 14
            }),

        });
        const zoomSlider = new ZoomSlider();
        map.addLayer(newMarker("balls",11.131709, 46.054779));
        map.addControl(zoomSlider);
        parks.forEach(park =>{
            map.addLayer(newMarker(park.name, park.longitude, park.latitude));
        })

    }, []);
    return <div id="map" style={{ width: "100%", height: "100vh" }}>
        <div id="suggerimenti">Suggerimenti</div>
    </div>;
}