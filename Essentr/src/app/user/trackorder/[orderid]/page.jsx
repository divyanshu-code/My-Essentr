'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Bike,
    Store,
    CheckCircle2,
    Package,
    Truck,
    HelpCircle,
    Phone,
    MessageSquare,
    ChevronRight,
    User,
    User2,
    User2Icon,
    PhoneCall
} from 'lucide-react';
import Link from 'next/link';
import Livemapping from '@/Components/Livemapping';
import { getSocket } from '@/Config/socket';

const page = ({ params }) => {

    const { orderid } = useParams();
    const [eta, setEta] = useState(12);

    const [userlocation, setuserlocation] = useState()
    const [deliverylocation, setdeliverylocation] = useState()
    const [order, setorder] = useState()

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

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const [riderLocation, setRiderLocation] = useState({ lat: 28.5355, lng: 77.3910 });

    // Mocking the order status progression
    //   const statuses = [
    //     { name: 'Order Placed', icon: Package, key: 'Pending' },
    //     { name: 'Preparing', icon: Store, key: 'Processing' },
    //     { name: 'Out for Delivery', icon: Truck, key: 'Out for delivery' },
    //     { name: 'Delivered', icon: CheckCircle2, key: 'Delivered' }
    //   ];

    //   // Determine current status index for the progress bar
    //   const currentStatusIndex = statuses.findIndex("Preparing" === order?.status) !== -1 ? 1 : 0

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
                        <button className="text-slate-400">
                            <HelpCircle size={20} />
                        </button>
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
        </div>
    )
}

export default page