'use client'
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion as m } from 'framer-motion';
import {
    Phone,
    MessageSquare,
    MapPin,
    ChevronUp,
    PackageCheck,
    ExternalLink,
    X,
    User2,
} from 'lucide-react';
import Livemapping from '@/Components/Livemapping';
import { getSocket } from '@/Config/socket';
import { useSelector } from 'react-redux';
import Chatassistant from '@/Components/Chatassistant';;
import { IoBusiness } from 'react-icons/io5';

const Activedashboard = ({ activeOrder, location }) => {

    const [step, setStep] = useState('pickup');
    const [extend, setextend] = useState(false);

    console.log(activeOrder)

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
                const { latitude, longitude, accuracy } = pos.coords;

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
        <>

            <div className="relative h-screen w-full overflow-hidden bg-slate-200">

                <div className={`flex flex-col h-full transition-all duration-500 ${extend ? 'scale-100 ' : 'scale-100 blur-0'}`}>

                    <Livemapping deliverylocation={deliverylocation} location={location} />

                    <m.div
                        variants={sheetVariants}

                        transition={{ type: "spring", damping: 20 }}
                        className="bg-white rounded h-80 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20"
                    >

                        <div className="px-8 pb-10 mt-10">

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className='text-xs font-black text-slate-400'>Order: #{activeOrder?.currentOrderId?._id.toString()?.slice(-6)}</h2>
                                    <h2 className="text-xl font-black text-slate-800">
                                        {step === 'pickup' ? 'Pickup from Vendor' : 'Deliver to Customer'}
                                    </h2>
                                    <div className="text-slate-500 text-xs flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <User2 size={12} /> {activeOrder?.currentOrderId?.vendor?.name}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Phone size={11} /> {activeOrder?.currentOrderId?.vendor?.userId?.mobile}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <IoBusiness size={12}/> {activeOrder?.currentOrderId?.vendor?.businessName}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <MapPin size={11} /> {activeOrder?.currentOrderId?.vendor?.address}
                                        </div>

                                    </div>
                                </div>
                                <div className="flex gap-2 ">
                                    <button onClick={() => setextend(!extend)} className="p-4 cursor-pointer bg-slate-100 rounded-2xl text-slate-600"><MessageSquare size={20} /></button>
                                    <a href={`tel:${activeOrder?.currentOrderId?.vendor?.userId?.mobile}`} className="p-4 cursor-pointer bg-green-100 text-green-600 rounded-2xl shadow-sm"><Phone size={20} /></a>
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

                <AnimatePresence>
                    {extend && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50  flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4"
                        >
                            <div className="absolute inset-0" onClick={() => setextend(false)} />

                            <m.div
                                initial={{ y: 100, scale: 0.9, opacity: 0 }}
                                animate={{ y: 0, scale: 1, opacity: 1 }}
                                exit={{ y: 100, scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative w-full max-w-lg mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh] sm:h-150"
                            >
                                <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div>
                                        <h3 className="font-black text-slate-800 text-lg">Chat Assistant</h3>
                                        <p className="text-xs text-green-500 font-bold">Online • Support</p>
                                    </div>
                                    <button
                                        onClick={() => setextend(false)}
                                        className="p-3 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-full text-slate-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-hidden bg-slate-50">
                                    <Chatassistant orderId={activeOrder?.currentOrderId?._id} deliverboyId={data?._id} />
                                </div>
                            </m.div>
                        </m.div>
                    )}
                </AnimatePresence>

            </div>

        </>
    )
}

export default Activedashboard