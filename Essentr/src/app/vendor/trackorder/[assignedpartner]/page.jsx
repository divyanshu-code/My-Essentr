'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bike,
    Phone,
    MessageSquare,
    Clock,
    ChevronLeft,
    CheckCircle,
    Package,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Livemapping from '@/Components/Livemapping';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { getSocket } from '@/Config/socket';

const VendorTracker = () => {

    const { assignedpartner } = useParams()

    const [orderStatus, setOrderStatus] = useState('preparing');
    const [order, setorder] = useState();
    const [deliverypartnerlocation, setdeliverypartnerlocation] = useState({ lattitude: 0, longitude: 0 });
    const [expanded, setexpanded] = useState(false)

    const [eta, setEta] = useState(5);

    const cardVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const userdata = useSelector((state) => state.user.userData);

    const vendorlocation = {
        latitude: userdata?.location?.coordinates[1],
        longitude: userdata?.location?.coordinates[0]
    };

    useEffect(() => {

        const getorder = async () => {
            try {

                const res = await fetch(`/api/auth/get-track-order/${assignedpartner}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();

                console.log("order", data);

                setorder(data);

                setdeliverypartnerlocation({
                    latitude: data?.assignedDeliverypartner?.location?.coordinates[1],
                    longitude: data?.assignedDeliverypartner?.location?.coordinates[0]
                })

            } catch (err) {
                console.log(err);
            }
        }

        getorder();
    }, [userdata?._id])

    useEffect(() => {

        const socket = getSocket();

        if (order?._id) {
            socket.emit("joinOrderRoom", order._id);
        }

        socket?.on("update-delivery-location", (data) => {

            if (data.userId === order?.assignedDeliverypartner?._id) {
                setdeliverypartnerlocation({
                    latitude: data.location.coordinates?.[1],
                    longitude: data.location.coordinates?.[0]
                });
            }

        })

        return () => {
            socket.off("update-delivery-location");
        }

    }, [order])

    const changeorderstatus = async () => {

        try {

            const res = await fetch('/api/admin/changestatus', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ parentorder: order.parentOrder })
            })

            const data = await res.json();
            setOrderStatus(data?.order?.orderstatus);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {

        if (!order?.parentOrder) return;

        const getdata = async () => {

            try {

                const res = await fetch('/api/admin/getstatus', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ parentorder: order.parentOrder })
                })

                const data = await res.json();

                setOrderStatus(data?.order?.orderstatus);

            } catch (err) {
                console.log(err);
            }
        }

        getdata();

    }, [order])

    return (
        <div className="relative h-screen w-full bg-slate-100  flex flex-col">

            <div className="absolute z-1000 p-6 flex justify-between items-center w-full">
                <Link href="/vendor/manage-orders" className="p-3 bg-white rounded-2xl shadow-lg text-slate-800">
                    <ChevronLeft size={24} />
                </Link>
                <div className="bg-white backdrop-blur-md px-5 py-2 rounded-xl shadow-lg border border-white/50">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Order ID</p>
                    <p className="text-sm font-black text-slate-800">#{assignedpartner?.slice(-6)}</p>
                </div>
            </div>

            <div className="flex-1 relative">
                <Livemapping
                    deliverylocation={deliverypartnerlocation}
                    location={vendorlocation}
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
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                {order?.assignedDeliverypartner?.name?.charAt(0) || 'R'}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">{order?.assignedDeliverypartner?.name}</h3>
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
                            <a href={`tel:${order?.assignedDeliverypartner?.mobile}`} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
                                <Phone size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-100 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Package size={14} className="text-slate-400" />
                                <div className='flex items-center justify-between w-full' onClick={() => setexpanded(!expanded)}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Order Items</p>
                                  { expanded ? <ChevronUp size={16} className="text-slate-500 cursor-pointer" /> : <ChevronDown size={16} className="text-slate-500 cursor-pointer" /> }
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-700">{order?.items?.length || 0} Items • ₹{order?.totalamount?.toFixed(2) || '0.00'}</p>

                            {expanded && (
                                <div className="mt-1 max-h-40 overflow-y-auto">
                                    {order?.items?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-2 border-b border-slate-200">
                                            <p className="text-xs font-bold text-slate-500">{item.name} x {item.quantity}</p>
                                            <p className="text-xs font-bold text-slate-500">₹{(item.price?.toFixed(2))* (item.quantity) || '0.00'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="bg-slate-100 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={14} className="text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Prep Time</p>
                            </div>
                            <p className="text-sm font-bold text-slate-700">Ready in 5 mins</p>
                        </div>
                    </div>

                    <button
                        className={`w-full py-3 rounded-xl font-black lg:text-lg text-sm flex cursor-pointer items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${orderStatus === 'preparing'
                            ? 'bg-orange-500 text-white'
                            : 'bg-green-500 text-white'
                            }`}
                        onClick={() => {
                            changeorderstatus();
                        }}
                    >
                        {orderStatus === 'preparing' ? (
                            <>Mark as Ready for Pickup <CheckCircle size={24} /></>
                        ) : (
                            <>Handover Confirmed <CheckCircle size={24} /></>
                        )}
                    </button>

                    <p className="text-center text-[8px]  text-slate-400 font-bold mt-2 uppercase tracking-widest">
                        Please keep the package at the designated pickup counter
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default VendorTracker;