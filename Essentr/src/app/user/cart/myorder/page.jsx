'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaBox, FaArrowLeft } from 'react-icons/fa'
import { TbLoader3 } from "react-icons/tb";
import { MdLocationOn } from "react-icons/md";
import Link from 'next/link'
import Image from 'next/image';
import { getSocket } from '@/Config/socket';
import { PhoneCall, UserCheck } from 'lucide-react';

const MyOrders = () => {

    const [orderdata, setorderdata] = useState([])
    const [loading, setloading] = useState(true)
    const [expanded, setexpanded] = useState(null)

    const containerVars = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    }

    const itemVars = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    useEffect(() => {

        const getmyorders = async () => {

            try {

                const response = await fetch('/api/auth/myorder', {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" },
                })

                const order = await response.json()

                console.log(order);

                setorderdata(order)
                setloading(false)

            } catch (err) {
                console.log(err);

            }
        }

        getmyorders();
    }, [])

    useEffect(() => {

        const socket = getSocket()

        socket.on("order_status_updated", (data) => {

            setorderdata((prevOrders) =>
                prevOrders.map((order) =>
                    order._id.toString() === data.orderId.toString()
                        ? { ...order, status: data.status }             // Sirf match hone wala order update hoga
                        : order
                )
            );
        })

        return () => {
            socket.off("order_status_updated")
        }

    }, [])

    if (loading) {
        return (
            <div className='flex  justify-center mt-80'>
                <TbLoader3 size={70} className='animate-spin text-gray-500' />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white px-6">
            <div className="max-w-4xl mx-auto">

                <header className="sticky top-0 z-50 pt-15 pb-4 bg-[#0A0A0B]/80 backdrop-blur-xl  border-b border-white/8 ">
                    <Link href={"/"}>
                        <motion.button
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-widest mb-13"
                        >
                            <FaArrowLeft size={10} /> Back
                        </motion.button>

                    </Link>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-4xl font-black tracking-tighter"
                    >
                        Your <span className="text-emerald-500 italic">Orders.</span>
                    </motion.h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs ml-1 mt-2">
                        your premium orders
                    </p>
                </header>

                <main className='py-10'>
                    {orderdata.length > 0 ? (
                        <motion.div
                            variants={containerVars}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {orderdata.map((order) => (
                                <motion.div
                                    key={order._id}
                                    variants={itemVars}
                                    whileHover={{ y: -5 }}
                                    className="group relative cursor-pointer bg-zinc-900/50 border overflow-x-auto  border-white/5 rounded-xl py-5 px-8 overflow-hidden transition-all hover:border-emerald-500/30 hover:bg-zinc-900"
                                >

                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-all" />

                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <p className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">Order ID</p>
                                            <h3 className="text-xl font-black text-white"># {order?._id?.toString()?.slice(-6)}</h3>
                                            <p className="text-zinc-500 text-xs font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>

                                        <div className="text-right">
                                            <div className='flex items-center  gap-5'>
                                                <div className={` text-[10px] font-black uppercase ${order.isPaid ? ' text-emerald-500' : ' text-red-500'
                                                    }`}>{order.isPaid ? "Paid" : "Unpaid"}
                                                </div>
                                                <div>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className='mt-10 mb-2 flex items-center justify-between'>
                                        <div className='flex gap-1 w-180'>
                                            <MdLocationOn className='mt-0.5' size={15} />
                                            <p className="text-zinc-400 text-xs leading-tight font-medium">{order?.shippingAddress?.address}</p>
                                        </div>

                                        <div className="text-zinc-400 text-sm mr-1 font-medium uppercase" >
                                            {order.paymentMethod === 'razorpay' ? 'Online' : 'cod'}
                                        </div>
                                    </div>

                                    {order.assignedDeliverypartner &&
                                        <div className='flex items-center gap-5'>
                                            <div className='border py-2  px-4 border-zinc-400/20 rounded-lg  w-126'>
                                                <div className='flex items-center gap-50 '>
                                                    <div>
                                                        <div className='flex items-center gap-2 '>
                                                            <UserCheck size={15} />
                                                            <p className='text-white text-[12px] font-bold'>{order.assignedDeliverypartner.name}</p>
                                                        </div>
                                                        <div className='flex items-center gap-2 mt-1 '>
                                                            <PhoneCall size={14} />
                                                            <p className='text-white text-[12px] font-bold '>{order.assignedDeliverypartner.mobile}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-3'>
                                                        <a href={`tel:${order.assignedDeliverypartner.mobile}`} className='text-green-500 bg-green-500/5 text-[12px] px-3 py-1 rounded-md border border-green-500/20 font-black tracking-widest'>Call</a>
                                                    <button className='text-green-500 bg-green-500/5 text-[12px] px-3 py-1 rounded-md border border-green-500/20 font-black tracking-widest' >
                                                        Track order
                                                    </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className=" pt-3 mt-5 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center justify-between gap-3">
                                            {expanded != order._id && (

                                                <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center border border-white/5">
                                                    <FaBox className="text-zinc-500 text-sm" />
                                                </div>
                                            )}
                                            <div className="text-zinc-400 text-sm font-medium">
                                                <button
                                                    onClick={() => setexpanded(expanded === order._id ? null : order._id)}
                                                    className='w-full cursor-pointer flex justify-between items-center gap-5 text-sm font-medium text-zinc-500'>

                                                    <span>
                                                        {expanded === order._id ? "hide items" : `view ${order.items.length} items`}
                                                    </span>
                                                </button>

                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{
                                                        height: expanded === order._id ? "auto" : 0,
                                                        opacity: expanded === order._id ? 1 : 0
                                                    }}

                                                    transition={{ duration: 0.3 }}
                                                    className='overflow-hidden'
                                                >
                                                    <div className='mt-3 space-y-3'>
                                                        {order.items.map((item, index) => (

                                                            <div
                                                                key={index}
                                                                className='flex justify-between items-center w-200 bg-gray-50 rounded-lg px-3 py-2'>

                                                                <div className='flex items-center gap-5'>
                                                                    <Image
                                                                        src={item.image}
                                                                        alt='error'
                                                                        width={48}
                                                                        height={48}
                                                                        className='rounded-lg object-cover '
                                                                    />
                                                                    <div>
                                                                        <p className='text-xs font-medium text-zinc-700'>{item.name}</p>
                                                                        <p className='text-xs text-zinc-700'> {item.quantity} x {item.unit}{item.unit1}</p>
                                                                    </div>
                                                                </div>

                                                                <p className='text-xs font-bold text-zinc-700'>₹ {Number(item.price)}</p>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='border-t pt-3 text-right border-white/5 flex justify-end items-center gap-3 mt-3'>
                                        <p className="text-xl text-right font-black text-white ">Total: </p>
                                        <p className="text-xl text-right font-black text-emerald-400 ">₹{order.totalamount}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <EmptyState />
                    )}
                </main>
            </div>
        </div>
    )
}

const StatusBadge = ({ status }) => {

    const color = (status) => {

        switch (status) {

            case "Pending":
                return " text-amber-500"
            case "Out for delivery":
                return " text-blue-500"
            case "Delivered":
                return " text-emerald-500"
            case "Cancelled":
                return " text-red-500"
            default:
                break;
        }
    }

    return (
        <div className={` text-[10px] font-black uppercase  ${color(status)}`}>
            {status}
        </div>
    )
}

const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
    >
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
            <FaBox size={30} />
        </div>
        <h3 className="text-2xl font-black mb-2">No orders yet.</h3>
        <p className="text-zinc-500 mb-8">Your pantry is looking a bit empty!</p>
        <Link href="/" className="px-7 py-3 bg-white text-black font-black rounded-full hover:bg-emerald-500 transition-all">
            Start Shopping
        </Link>
    </motion.div>
)

export default MyOrders