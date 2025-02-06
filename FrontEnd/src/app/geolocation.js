import * as style from 'ol/style';
import Geolocation from 'ol/Geolocation.js';
import Feature from 'ol/Feature';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import * as geom from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import geoloc from '../../assets/geoloc.png';


export default function newGeolocation(view, map) {
    const geolocation = new Geolocation({
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: view.getProjection(),
    });

    geolocation.on('error', function (error) {
        console.log(error.message);
    });

    const accuracyFeature = new Feature();
    accuracyFeature.setStyle(
      new style.Style({
        fill: new style.Fill([0,255,0,0.5])
      })
    );
    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });


    const positionFeature = new Feature();
    positionFeature.setStyle(
        new style.Style({
            image: new style.Icon({
                anchor: [0.5, 0.5],
                src: geoloc.src,
                scale: 0.1
            }),
            fill: new style.Fill([0,255,0,0.5])
        }),
    );

   const  vectorSource = new source.Vector({
        features: [accuracyFeature, positionFeature]
      });

    navigator.geolocation.watchPosition(
      (position)=>{
        const coordinates = fromLonLat([position.coords.longitude, position.coords.latitude]);
        const accuracy = position.coords.accuracy;

        if (coordinates) {
          positionFeature.setGeometry(
            new geom.Point(coordinates)
          );
          accuracyFeature.setGeometry(
            new geom.Circle(coordinates,accuracy)
          );
          accuracyFeature.setStyle(
            new style.Style({stroke: new style.Stroke({color: [30,90,125,0.3],}),fill: new style.Fill({color: [30,110,125,0.1],})})
          );
           
          console.log("updating source");
          vectorSource.features = [accuracyFeature,positionFeature]
          vectorSource.changed();
        }
      },
      (error)=>{},
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

      const geoLayer = new layer.Vector({
        source: vectorSource
      });


      return geoLayer;
}
