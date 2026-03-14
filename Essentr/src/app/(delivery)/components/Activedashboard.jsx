'use client'
import React, { useState , useEffect } from 'react';
import { motion as m } from 'framer-motion';
import {
    Phone,
    MessageSquare,
    MapPin,
    ChevronUp,
    PackageCheck,
    ExternalLink
} from 'lucide-react';
import Livemapping from '@/Components/Livemapping';
import { getSocket } from '@/Config/socket';
import { useSelector } from 'react-redux';

const Activedashboard = ({ activeOrder, location }) => {
    const [step, setStep] = useState('pickup');
    const [isExpanded, setIsExpanded] = useState(false);

    const sheetVariants = {
        collapsed: { y: 0 },
        expanded: { y: -250 }
    };

    const [deliverylocation, setdeliverylocation] = useState(null);

    const data = useSelector((state) => state.user.userData);
    
    useEffect(() => {

    if (!navigator.geolocation || !data?._id) return;

    const socket = getSocket();

    const watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const { latitude, longitude , accuracy} = pos.coords;

            if (accuracy > 100) return;

            console.log("Delivery Location:", { latitude, longitude });
            
            setdeliverylocation({ latitude, longitude });

            socket.emit("updateLocation", {
                userId: data?._id,
                latitude,
                longitude,
            });
        },
        (err) => console.error("WatchPosition Error:", err),
        {
            enableHighAccuracy: true,
            maximumAge: 3000,
            timeout: 20000
        }
    );

    return () => navigator.geolocation.clearWatch(watchId);
}, [data?._id]);

    return (
        <div className="fixed inset-0 bg-slate-200 overflow-hidden flex flex-col">

            <Livemapping deliverylocation={deliverylocation} location={location} />

            <m.div
                variants={sheetVariants}
                animate={isExpanded ? "expanded" : "collapsed"}
                transition={{ type: "spring", damping: 20 }}
                className="bg-white rounded-t-[3rem] h-80 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20"
            >
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-4 flex justify-center cursor-pointer"
                >
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                <div className="px-8 pb-10">

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className='text-xs font-black text-slate-400'>Order: #{activeOrder?.currentOrderId?._id.toString()?.slice(-6)}</h2>
                            <h2 className="text-xl font-black text-slate-800">
                                {step === 'pickup' ? 'Pickup from Vendor' : 'Deliver to Customer'}
                            </h2>
                            <p className="text-slate-500 text-xs flex items-center gap-1">
                                <MapPin size={12} /> {activeOrder?.currentOrderId?.vendor?.address}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-4 bg-slate-100 rounded-2xl text-slate-600"><MessageSquare size={20} /></button>
                            <button className="p-4 bg-green-100 text-green-600 rounded-2xl shadow-sm"><Phone size={20} /></button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <PackageCheck className="text-orange-500" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400">ORDER ITEMS</p>
                                    <p className="text-xs font-bold text-slate-700">Milk, Eggs, Bread + 2 more</p>
                                </div>
                            </div>
                            <button className="text-slate-400"><ExternalLink size={16} /></button>
                        </div>

                        <div className="relative group">
                            <m.div
                                drag="x"
                                dragConstraints={{ left: 0, right: 250 }}
                                onDragEnd={(e, info) => {
                                    if (info.point.x > 200) {
                                        if (step === 'pickup') setStep('delivery');
                                        else onComplete();
                                    }
                                }}
                                className="w-20 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white cursor-grab active:cursor-grabbing z-10 relative shadow-xl"
                            >
                                <ChevronUp size={24} className="rotate-90" />
                            </m.div>
                            <div className="absolute inset-0 bg-slate-100 rounded-2xl flex items-center justify-center">
                                <p className="text-xs font-black text-slate-400 tracking-widest uppercase">
                                    {step === 'pickup' ? 'Slide to Confirm Pickup' : 'Slide to Complete'}
                                </p>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-slate-300 font-medium">
                            Verify items with vendor before sliding
                        </p>
                    </div>
                </div>
            </m.div>
        </div>
    )
}

export default Activedashboard