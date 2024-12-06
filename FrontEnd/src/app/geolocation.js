import * as style from 'ol/style';
import Geolocation from 'ol/Geolocation.js';
import Feature from 'ol/Feature';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import newgeoloc from './geoloc_point';
import geoloc from '../../assets/geoloc.png';


export default function newGeolocation(view, map) {
    console.log("inizio");
    const geolocation = new Geolocation({
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: view.getProjection(),
    });

    geolocation.setTracking(true);

    geolocation.on('change', function () {
        console.log(geolocation.getPosition());
    });

    geolocation.on('error', function (error) {
        console.log(error.message);
    });

    const accuracyFeature = new Feature();
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
            })
        }),
    );

    const vectorSource = new source.Vector({
        features: [accuracyFeature, positionFeature]
      });

      const geoLayer = new layer.Vector({
        source: vectorSource
      });


      return geoLayer;

}