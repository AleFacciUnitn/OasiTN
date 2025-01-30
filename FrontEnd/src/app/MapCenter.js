import * as style from 'ol/style';
import Geolocation from 'ol/Geolocation.js';
import Feature from 'ol/Feature';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import newgeoloc from './geoloc_point';


export default function getcenter() {
    const geolocation2 = new Geolocation({
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: 'EPSG:3857',
    });
    geolocation2.setTracking(true);

    geolocation2.on('change', function () {
        //console.log(geolocation.getPosition());
    });

    geolocation2.on('error', function (error) {
        console.log(error.message);
    });

    return geolocation2.getPosition();
}