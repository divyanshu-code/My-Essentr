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
    ChevronDown,
} from 'lucide-react';
import Livemapping from '@/Components/Livemapping';
import { getSocket } from '@/Config/socket';
import { useSelector } from 'react-redux';
import Chatassistant from '@/Components/Chatassistant';;
import { IoBusiness } from 'react-icons/io5';

const Activedashboard = ({ activeOrder, location }) => {

    const [step, setStep] = useState('pickup');
    const [extend, setextend] = useState(false);
    const [showorder, setshoworder] = useState(false);

    console.log("Active Order:", activeOrder);

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
            <div className="relative h-screen w-full  bg-slate-200">

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
                                            <IoBusiness size={12} /> {activeOrder?.currentOrderId?.vendor?.businessName}
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
                                <div className="w-full rounded-2xl  border-slate-200 bg-slate-100 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                                            <PackageCheck className="text-orange-600" size={20} />
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    Order Items
                                                </p>
                                                <button
                                                    onClick={() => setshoworder(!showorder)}
                                                    className="rounded-full p-1 transition-colors hover:bg-slate-200 text-slate-400 cursor-pointer"
                                                >
                                                    {showorder ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>

                                            <p className="text-sm font-bold text-slate-800">
                                                {activeOrder?.currentOrderId?.items?.length || 0} Items •
                                                <span className="ml-1 text-orange-600">
                                                    ₹{activeOrder?.currentOrderId?.totalamount?.toFixed(2) || '0.00'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {showorder && (
                                        <div className="mt-4 w-full border-t border-slate-200 pt-2">
                                            <div className="max-h-60 overflow-y-auto pr-1">
                                                {activeOrder?.currentOrderId?.items?.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex w-full items-center justify-between border-b border-slate-100 py-2 last:border-0"
                                                    >
                                                        <p className="text-xs font-semibold text-slate-600">
                                                            {item.name} <span className="ml-1 text-slate-400">x{item.quantity}</span>
                                                        </p>
                                                        <p className="text-xs font-bold text-slate-700">
                                                            ₹{item.price?.toFixed(2) || '0.00'}
                                                        </p>

                                                    </div>
                                                ))}
                                                    <div className=' w-full text-xs font-semibold text-slate-600 border-b border-slate-200 '>
                                                         <p>Delivery Fees:  <span className='text-xs font-bold right-0 text-slate-700'>₹50</span></p>
                                                    </div>
                                            </div>
                                        </div>
                                    )}
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

                                <p className="text-center text-[12px] text-slate-400 font-medium">
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