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
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

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
                    logitude: data?.shippingAddress?.longitude
                })

                setdeliverylocation({
                    latitude: data?.assignedDeliverypartner?.location?.coordinates[1],
                    logitude: data?.assignedDeliverypartner?.location?.coordinates[0]
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

    return (
        <div className="h-screen bg-slate-50 pb-20">

            <div className="h-[50vh] w-full bg-slate-200 relative overflow-hidden">

                {/* <MapContainer center={[riderLocation.lat, riderLocation.lng]} zoom={15}>...</MapContainer> */}
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}

                            className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-2xl z-10 relative"
                        >
                            <Bike size={20} />
                        </motion.div>
                        <div className="w-20 h-20 bg-orange-400/30 rounded-full absolute -top-5 -left-5 animate-ping z-0" />
                    </div>
                </div>

                <div className="absolute inset-0 mt-15 flex items-center justify-center">
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Simulated GPS Map View</p>
                </div>

                <div className="absolute top-10 left-6 right-6 flex justify-between items-center z-10">
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

                    <div className="flex justify-between items-start mb-10 border-b border-slate-100 pb-6">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Order ID: #</p>
                            <h1 className="text-2xl font-black text-slate-800">Tracking Status</h1>
                        </div>
                        <button className="text-slate-400">
                            <HelpCircle size={20} />
                        </button>
                    </div>

                    <div className="flex items-start justify-between relative mb-12">

                        <div className="absolute top-4.5 left-6 right-6 h-1 bg-slate-100 z-0 rounded-full overflow-hidden">
                            {/* <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-orange-500 rounded-full"
                /> */}
                        </div>

                        {/* {statuses.map((status, index) => {
              const Icon = status.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={status.key} className="flex flex-col items-center gap-3 relative z-10 flex-1 text-center">
                  <motion.div 
                    animate={{ 
                        backgroundColor: isCompleted ? '#F97316' : '#F1F5F9', // orange-500 : slate-100
                        scale: isCurrent ? 1.1 : 1
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                        isCompleted ? 'border-orange-100 text-white' : 'border-white text-slate-400'
                    }`}
                  >
                    {isCompleted && !isCurrent ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                  </motion.div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {status.name}
                  </p>
                </div>
              );
            })} */}
                    </div>

                    {/* Rider Details (Only show when 'Out for Delivery') */}
                    <AnimatePresence>
                        {/* {currentStatusIndex >= 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4 mb-10 shadow-inner"
              >
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                  R
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Your Delivery Partner</p>
                  <h4 className="text-lg font-bold text-slate-800">Rahul Sharma</h4>
                  <div className="flex gap-1 text-orange-500 mt-0.5">
                    {[1, 2, 3, 4, 5].map(s => <CheckCircle2 size={12} key={s}/>)}
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <button className="p-4 bg-slate-100 rounded-2xl text-slate-600 active:scale-95"><MessageSquare size={18}/></button>
                    <button className="p-4 bg-green-100 text-green-600 rounded-2xl shadow-sm active:scale-95"><Phone size={18}/></button>
                </div>
              </motion.div>
            )} */}
                    </AnimatePresence>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 items-start">
                        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Delivery Address</h4>
                            <p className="text-sm text-slate-500 mt-1">
                                hhhhhhhhhhhh
                            </p>
                            <p className="text-sm text-slate-500">hhhhhhhhhh</p>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}

export default page