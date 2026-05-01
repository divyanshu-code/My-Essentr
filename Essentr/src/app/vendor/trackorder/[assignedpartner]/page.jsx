'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bike,
    Store,
    Phone,
    MessageSquare,
    Clock,
    MapPin,
    ChevronLeft,
    CheckCircle,
    AlertCircle,
    Package
} from 'lucide-react';
import Livemapping from '@/Components/Livemapping';
import { useParams } from 'next/navigation';

const VendorTracker = ({ activeOrder, riderLocation }) => {

    const { assignedpartner } = useParams()
    const [orderStatus, setOrderStatus] = useState('preparing');
    const [eta, setEta] = useState(5);

    const cardVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="relative h-screen w-full bg-slate-100 overflow-hidden flex flex-col">

            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent">
                <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg text-slate-800">
                    <ChevronLeft size={24} />
                </button>
                <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-lg border border-white/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Order ID</p>
                    <p className="text-sm font-black text-slate-800">#{assignedpartner?.slice(-6)}</p>
                </div>
            </div>

            <div className="flex-1 relative">
                <Livemapping
                    deliverylocation={riderLocation}
                    location={activeOrder?.vendorLocation}
                    type="vendor_view"
                />

                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white">
                        <div className="bg-orange-500 p-2 rounded-lg">
                            <Bike size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold opacity-70 leading-none">Rider Arriving</p>
                            <p className="text-xs font-bold">{eta} mins away</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] relative z-30 p-8"
            >
                <div className="max-w-2xl mx-auto">
                    {/* Rider Info Card */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                {activeOrder?.riderName?.charAt(0) || 'R'}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">{activeOrder?.riderName || 'Rahul Sharma'}</h3>
                                <div className="flex items-center gap-2 text-green-500">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold uppercase">On the way to shop</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors">
                                <MessageSquare size={20} />
                            </button>
                            <button className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
                                <Phone size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Handover Progress / Items */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Package size={14} className="text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Order Items</p>
                            </div>
                            <p className="text-sm font-bold text-slate-700">12 Items • ₹1,450</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={14} className="text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Prep Time</p>
                            </div>
                            <p className="text-sm font-bold text-slate-700">Ready in 2 mins</p>
                        </div>
                    </div>

                    {/* VENDOR ACTION BUTTON */}
                    <button
                        className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${orderStatus === 'preparing'
                                ? 'bg-orange-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}
                        onClick={() => setOrderStatus('ready')}
                    >
                        {orderStatus === 'preparing' ? (
                            <>Mark as Ready for Pickup <CheckCircle size={24} /></>
                        ) : (
                            <>Handover Confirmed <CheckCircle size={24} /></>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest">
                        Please keep the package at the designated pickup counter
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default VendorTracker;