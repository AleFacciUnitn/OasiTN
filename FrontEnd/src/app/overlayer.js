import Overlay from 'ol/Overlay';

export default function newoverlay() {
    const popup = document.createElement('div');
    popup.className = 'ol-popup';
    popup.style.position = 'absolute';
    popup.style.background = 'white';
    popup.style.padding = '10px';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '5px';
    popup.style.minWidth = '100px';
    popup.style.textAlign = 'center';

    const overlay = new Overlay({
        element: popup,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    });

    return overlay;
}