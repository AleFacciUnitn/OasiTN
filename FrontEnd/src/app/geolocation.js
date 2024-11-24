import * as style from 'ol/style';
import Geolocation from 'ol/Geolocation.js';
import Feature from 'ol/Feature';
import * as layer from 'ol/layer';
import * as source from 'ol/source';


export default function newGeolocation(view, map) {
    const geolocation = new Geolocation({
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: view.getProjection(),
    });

    function el(id) {
        return document.getElementById(id);
    }

    el('track').addEventListener('change', function () {
        geolocation.setTracking(this.checked);
    });

    geolocation.on('change', function () {
        el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
        el('altitude').innerText = geolocation.getAltitude() + ' [m]';
        el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
        el('heading').innerText = geolocation.getHeading() + ' [rad]';
        el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
    });

    geolocation.on('error', function (error) {
        const info = document.getElementById('info');
        info.innerHTML = error.message;
        info.style.display = '';
    });

    const accuracyFeature = new Feature();
    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    const positionFeature = new Feature();
    positionFeature.setStyle(
        new style.Style({
            image: new style.Circle({
                radius: 6,
                fill: new style.Fill({
                    color: '#3399CC',
                }),
                stroke: new style.Stroke({
                    color: '#fff',
                    width: 2,
                }),
            }),
        }),
    );

    const vectorSource = new source.Vector({
        features: [accuracyFeature, positionFeature]
      });

    const positionlayer = new layer.Vector({
        source: vectorSource
    });

    return positionlayer;

}