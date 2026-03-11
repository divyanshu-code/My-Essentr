'use client'
import React, { useState , useEffect } from 'react'
import { motion as m } from 'framer-motion';
import {
    Navigation,
} from 'lucide-react';

const Livemapping = ({ deliverylocation, location }) => {

    const [Leaflet, setLeaflet] = useState(null);
    const [position, setPosition] = useState(null); // Missing state
    const [error, setError] = useState(null);      // Missing state

    useEffect(() => {
        const loadLeaflet = async () => {
 
            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');
            const ReactLeaflet = await import('react-leaflet');

            const deliveryIcon = L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/128/6200/6200018.png",
                iconSize: [45, 45]
            });

            const userIcon = L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/128/3203/3203071.png",
                iconSize: [45, 45]
            });

            setLeaflet({ ...ReactLeaflet, L, deliveryIcon, userIcon });
        };

        loadLeaflet();

        if (!navigator.geolocation) {
            setError("Geolocation is not supported");
            return;
        }

        const handleSuccess = (pos) => {
            const { latitude, longitude } = pos.coords;
            setPosition({ lat: latitude, lng: longitude });
        };

        const handleError = (err) => {
            setError(err.message);
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, { 
            enableHighAccuracy: true, 
            timeout: 10000 
        });

    }, []);

    const center = deliverylocation ? [deliverylocation.latitude, deliverylocation.longitude] : [location.latitude, location.longitude]

    return (
        <div className="flex-1 relative bg-blue-50 h-[400px] w-full">

            <div className="absolute inset-0 flex items-center justify-center">
                {(Leaflet && location) ? (
                    <>
                        <Leaflet.MapContainer center={center} zoom={13} scrollWheelZoom={true} className='h-full w-full'>

                            <Leaflet.TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                        </Leaflet.MapContainer>

                        {/* <button
                            onClick={currentposition}
                            className='absolute bottom-3 right-3 z-1000 cursor-pointer bg-green-600 p-2 rounded-full shadow-lg hover:bg-green-500 transition-colors '
                        >
                            <IoMdLocate size={24} className="text-white" />

                        </button> */}

                    </>

                ) : (
                    <>
                        <div className="relative mb-5">
                            <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-2xl " />
                            <div className="w-20 h-20 bg-blue-500/20 rounded-full absolute -top-5 -left-5 animate-ping" />
                        </div>
                        <p className="absolute bottom-40 text-slate-400 font-bold tracking-widest uppercase text-xs">Simulated GPS Map View</p>
                    </>
                )}
            </div>

            {/* <m.div
                initial={{ y: -50 }} animate={{ y: 20 }}
                className="absolute top-0 left-6 right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-slate-100"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Navigation size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Next Turn</p>
                        <p className="text-sm font-bold text-slate-800">200m • Right to Market St.</p>
                    </div>
                </div>
                <button className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-2 rounded-lg">
                    RE-CENTER
                </button>
            </m.div> */}
        </div>

    )
}

export default Livemapping