'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    HelpCircle,
    ChevronRight,
    User2Icon,
    PhoneCall,
    MessageSquare,
    X
} from 'lucide-react';
import Link from 'next/link';
import Livemapping from '@/Components/Livemapping';
import { getSocket } from '@/Config/socket';
import Chatassistant from '@/Components/Chatassistant';

const page = ({ params }) => {

    const { orderid } = useParams();
    const [eta, setEta] = useState(12);

    const [userlocation, setuserlocation] = useState()
    const [deliverylocation, setdeliverylocation] = useState()
    const [order, setorder] = useState()

    const [extend, setextend] = useState(false)

    const userdata = useSelector((state) => state.user.userData);

    useEffect(() => {

        const getorder = async () => {
            try {

                const res = await fetch(`/api/auth/get-track-order/${orderid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();

                console.log("order", data);

                setorder(data);
                setuserlocation({
                    latitude: data?.shippingAddress?.latitude,
                    longitude: data?.shippingAddress?.longitude
                })

                setdeliverylocation({
                    latitude: data?.assignedDeliverypartner?.location?.coordinates[1],
                    longitude: data?.assignedDeliverypartner?.location?.coordinates[0]
                })

            } catch (err) {
                console.log(err);
            }
        }

        getorder();
    }, [userdata?._id])

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
    };

    const [riderLocation, setRiderLocation] = useState({ lat: 28.5355, lng: 77.3910 });

    const color = (status) => {
        if (status === "Pending") return "text-blue-500";
        if (status === "Out for delivery") return "text-orange-500";
        if (status === "Delivered") return "text-green-500";
        return "text-red-500";
    }

    useEffect(() => {

        const socket = getSocket();

        if (order?._id) {
            socket.emit("joinOrderRoom", order._id);
        }

        socket?.on("update-delivery-location", (data) => {

            console.log("update", data);

            if (data.userId === order?.assignedDeliverypartner?._id) {
                setdeliverylocation({
                    latitude: data.location.coordinates?.[1],
                    longitude: data.location.coordinates?.[0]
                });
            }

        })

        return () => {
            socket.off("update-delivery-location");
        }

    }, [order])


    return (
        <div className="h-screen bg-slate-50 pb-20">
            <div className="h-[50vh] w-full bg-slate-200 relative overflow-hidden">

                {/* <Livemapping deliverylocation={deliverylocation} location={userlocation} /> */}

                <div className="absolute top-5 left-12 right-6 flex justify-between items-center z-999">
                    <Link href={"/user/cart/myorder"} className="bg-white p-3 rounded-full shadow-lg border cursor-pointer border-slate-100 text-slate-500">
                        <ChevronRight size={20} className="rotate-180" />
                    </Link>
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-slate-700">ETA: {eta} mins</span>
                    </div>
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-full px-5"
            >
                <div className="py-8 px-4">

                    <div className="flex justify-between items-start mb-5 border-b border-slate-200 pb-2">
                        <div className='leading-tight'>
                            <p className="text-xs text-slate-400 font-medium">Order ID: #{order?._id?.toString()?.slice(-6)}</p>
                            <h1 className="text-lg font-black text-slate-800">Tracking Status: <span className={`text-xs uppercase ${color(order?.status)}`}>{order?.status}</span></h1>
                            <span className={`text-xs uppercase font-bold ${(order?.isPaid) ? 'text-green-500' : 'text-red-500'}`}>{order?.isPaid ? 'Paid' : 'Unpaid'}</span>
                        </div>

                        <div className='flex items-center justify-center gap-5'>

                            <button onClick={() => setextend(!extend)} className="p-4 cursor-pointer  text-slate-400"><MessageSquare size={20} /></button>
                            <button className="text-slate-400">
                                <HelpCircle size={20} />
                            </button>

                        </div>

                    </div>

                    <div className="flex flex-col items-start  relative mb-8">

                        <h1 className='text-xs font-bold'>Assign To : <span className='ml-2 text-xs font-semibold'>{order?.assignedDeliverypartner?.name || "Not Assigned"}</span></h1>
                        <h1 className='text-xs font-bold'>Contact : <span className='ml-4.5 text-xs font-semibold'>{order?.assignedDeliverypartner?.mobile || "N/A"}</span></h1>

                    </div>

                    <div className="bg-white px-5 py-4 rounded-xl shadow-md border border-slate-100 flex gap-4 items-start">
                        <div>
                            <h1 className="font-bold text-sm text-slate-800 ml-5">Delivery Address</h1>
                            <div className='flex items-center gap-2 mt-1 text-left'>
                                <User2Icon size={15} className="text-slate-400" />
                                <p className="text-xs text-slate-500">{order?.shippingAddress?.name}</p>
                            </div>
                            <div className='flex items-center gap-2 mt-1 text-left'>
                                <PhoneCall size={13} className="text-slate-400" />
                                <p className="text-xs text-slate-500">{order?.shippingAddress?.mobile}</p>
                            </div>
                            <div className='flex items-center gap-2 mt-1 '>
                                <MapPin size={14} className="text-slate-400" />
                                <p className="text-xs text-slate-500 "> {order?.shippingAddress?.address || "N/A"} </p>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>

            <AnimatePresence>
                {extend && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50  flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4"
                    >
                        <div className="absolute inset-0" onClick={() => setextend(false)} />

                        <motion.div
                            initial={{ y: 100, scale: 0.9, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 100, scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-lg mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden  flex flex-col h-[80vh] sm:h-150"
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
                                <Chatassistant orderId={orderid} deliverboyId={userdata?._id} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default page