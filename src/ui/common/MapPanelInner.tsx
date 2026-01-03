'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Site } from '@/services/types';
import L from 'leaflet';

// Fix Leaflet generic marker icon missing
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
    items?: any[];
    onSelect?: (id: string) => void;
}

export default function MapPanelInner({ items = [], onSelect }: MapViewProps) {
    // Center on Glazebrook (London-ish placeholder)
    const center: [number, number] = [51.505, -0.09];

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {items.map((item) => {
                if ((item as Site).coordinates) {
                    const site = item as Site;
                    return (
                        <Marker
                            key={site.id}
                            position={site.coordinates}
                            eventHandlers={{
                                click: () => onSelect && onSelect(site.id)
                            }}
                        >
                            <Popup>
                                <b>{site.name}</b><br />
                                {site.status}
                            </Popup>
                        </Marker>
                    )
                }
                return null;
            })}
        </MapContainer>
    );
}
