import * as proj from 'ol/proj';
import * as style from 'ol/style';
import * as source from 'ol/source';
import * as layer from 'ol/layer';
import * as geom from 'ol/geom';
import Feature from 'ol/Feature';
import gps from '../../assets/gps.png';


export default function newMarker(parkName ,long, lat) {
  const marker = new Feature({
    geometry: new geom.Point(proj.fromLonLat([long, lat])),
    name: parkName
  });

  const markerStyle = new style.Style({
    image: new style.Icon({
      anchor: [0.5, 1],
      src: gps.src,
      scale: 0.065  
    })
  });
  
  marker.setStyle(markerStyle);
  const vectorSource = new source.Vector({
    features: [marker]
  });

  const markerLayer = new layer.Vector({
    source: vectorSource
  });

  markerLayer.set("name","marker");

  return markerLayer;
}
