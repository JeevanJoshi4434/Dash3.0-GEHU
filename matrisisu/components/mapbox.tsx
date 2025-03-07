import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamVldmFuam9zaGkiLCJhIjoiY2x2djh0YnViMXN2cjJpcDFwaTg4Z3czYyJ9.zEDRwvJFAwXfIbV4hnmQIQ';

export interface Location {
    latitude: number;
    longitude: number;
    name?: string;
    role?: string;
    phone?: number;
    slot?: number;
}

interface User {
    location: {
        latitude: number;
        longitude: number;
    };
    name: string;
}

interface MapBoxProps {
    locations?: Location[];
    user?: User | null;
    zoom?: number;
    className?: string;
}

const MapBox: React.FC<MapBoxProps> = ({ locations = [], user = null, zoom = 12, className = '' }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return; // Wait for ref to attach
        console.log(locations, user);
        if (!map.current && user) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current as HTMLDivElement, // Waits until ref is ready
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [user.location.longitude, user.location.latitude],
                zoom: zoom,
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            if (user) {
                new mapboxgl.Marker({ color: 'blue' })
                    .setLngLat([user.location.longitude, user.location.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<h3>My Location</h3><p>${user.name}</p>`))
                    .addTo(map.current);
            }

            locations.forEach((location) => {
                if(location?.role === "doctor"){
                    new mapboxgl.Marker({ color: 'red' })
                    .setLngLat([location.longitude, location.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<p>${location.name}</p>`))
                    .addTo(map.current);
                
                }else if(location.role === "hospital"){
                    new mapboxgl.Marker({ color: 'green' })
                    .setLngLat([location.longitude, location.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<p>${location.name}</p>`))
                    .addTo(map.current);
                    
                }else{
                   new mapboxgl.Marker({ color: 'yellow' })
                    .setLngLat([location.longitude, location.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<p>${location.name}</p>`))
                    .addTo(map.current);
                }
            });
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null; // Reset map instance
            }
        };
    }, [user, locations]); // Add user and locations dependencies


    return (
        <div>
            <div ref={mapContainer} className={`w-full border border-gray-100 shadow-md h-[400px] rounded-md ${className}`} />
            <p className='text-sm font-semibold mt-5'>Nearest Doctors, Hospitals nad Asha</p>
        </div>
    );
};

export default MapBox;
