'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaBox, FaCheckCircle, FaClock, FaTruck,
    FaSearch, FaFilter, FaArrowLeft
} from 'react-icons/fa'
import Link from 'next/link'
import { toast, Slide } from 'react-toastify';
import { getSocket } from '@/Config/socket'
import { useSelector } from 'react-redux'

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const userdata = useSelector((state) => state.user.userData);

    const statusColors = {
        Pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        "Out for delivery": 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        Delivered: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        Cancelled: 'text-red-500 bg-red-500/10 border-red-500/20',
    };

    const handleStatusChange = async (orderId, newStatus) => {

        try {
            const response = await fetch(`/api/admin/update-status/${orderId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderid: orderId, status: newStatus })
            })

            const data = await response.json()

            if (data.success) {

                toast.success("Order status updated successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                });

                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));

            } else {

                toast.error(data.error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                });
            }

        } catch (err) {
            console.log(err.message);

            toast.error(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
            });

        }
    };

    const filteredOrders = Array.isArray(orders) ? orders.filter(order =>
        order?._id?.toString()?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    useEffect(() => {

        const getvendororders = async () => {

            try {

                const response = await fetch('/api/admin/vendor-orders', {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" },
                })

                const allorder = await response.json()

                setOrders(allorder)

            } catch (error) {
                console.log(error);

            }
        }

        getvendororders();
    }, [])

    useEffect(() => {

        const socket = getSocket()

        const currentVendorId = userdata?._id;

        if (currentVendorId) {
            socket.emit("joinVendorRoom", currentVendorId);
        }

        socket?.on("newOrder", (data) => {

            setOrders((prev) => [data, ...prev]);
        })

        return () => {
            socket.off("newOrder");
        }
    }, [])


    return (
        <div className="h-182 w-full bg-[#0A0A0B] text-white flex flex-col overflow-hidden font-sans">

            <div className="shrink-0 px-6 md:px-12 pt-17">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <Link href="/">
                                <motion.button
                                    whileHover={{ x: -5 }}
                                    className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-12 hover:text-emerald-500 transition-colors cursor-pointer">
                                    <FaArrowLeft size={10} /> Back to Dashboard
                                </motion.button>
                            </Link>
                            <h1 className="text-4xl font-black tracking-tighter">
                                Manage <span className="text-emerald-500 italic">Orders.</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 mt-18">
                            <div className="relative">
                                <FaSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                <input
                                    type="text"
                                    placeholder="Search Order ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-zinc-900 border border-white/5 rounded-md py-2 pl-12 pr-6 text-sm focus:outline-none focus:border-emerald-500/50 transition-all w-64"
                                />
                            </div>
                            <button className="py-2.5 px-2.5 bg-zinc-900 border border-white/5 rounded-lg hover:bg-zinc-800 transition-colors">
                                <FaFilter className="text-emerald-500" />
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Orders', value: orders?.length || 0, icon: FaBox, color: 'text-blue-500' },
                            { label: 'Pending', value: orders?.filter(o => o.status === 'Pending').length || 0, icon: FaClock, color: 'text-amber-500' },
                            { label: 'Processing', value: orders?.filter(o => o.status === 'Out for delivery').length || 0, icon: FaTruck, color: 'text-purple-500' },
                            { label: 'Completed', value: orders?.filter(o => o.status === 'Delivered').length || 0, icon: FaCheckCircle, color: 'text-emerald-500' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-zinc-900/50 border border-white/5 p-6 rounded-lg relative overflow-hidden group"
                            >
                                <stat.icon className={`absolute -right-3 -bottom-5 text-7xl opacity-5 group-hover:scale-110 transition-transform duration-500 ${stat.color}`} />
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black">{stat.value}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-10 ">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-zinc-900/30 border border-white/5 rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-[#0F0F10]">
                                    <tr className="text-zinc-500 text-[10px] font-black border-b border-white/8 uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Order Info</th>
                                        <th className="px-5 py-5">Customer</th>
                                        <th className="px-1 py-5">Total Amount</th>
                                        <th className="px-15 py-5">Status</th>
                                        <th className="px-1 py-5">Payment status</th>
                                        <th className="px-19 py-5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <AnimatePresence mode='popLayout'>
                                        {filteredOrders.map((order) => (
                                            <motion.tr
                                                key={order._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                className="group hover:bg-white/2 transition-colors"
                                            >
                                                <td className="px-8 py-5 flex flex-col">
                                                    <div className="font-black text-white"># {order?._id?.toString()?.slice(-6)}</div>
                                                    <div className="text-zinc-500 text-[10px] font-bold  uppercase">{new Date(order.createdAt).toLocaleString()}</div>
                                                    <div className="text-zinc-400 text-[10px] font-bold mt-5 uppercase ">{order.shippingAddress?.mobile}</div>
                                                    <div className="text-zinc-400 text-[10px] font-bold  uppercase">{order.shippingAddress?.address}</div>
                                                    <div className="text-zinc-400 text-[10px] font-bold  uppercase">{order.paymentMethod}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-sm">{order.shippingAddress.name}</div>
                                                    <div className="text-zinc-500 text-xs">{order.items.length} Items</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-emerald-400 font-black">₹{order.totalamount}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black  tracking-widest border ${statusColors[order.status]}`}>
                                                        {order.status}
                                                    </span>
                                                </td>

                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.isPaid ? `text-emerald-500 bg-emerald-500/10 border-emerald-500/20` : `text-red-500 bg-red-500/10 border-red-500/20`}`}>
                                                        {order.isPaid ? "Paid" : "Unpaid"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        className="bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest px-1 py-2 text-center rounded-md  border border-white/10 focus:outline-none focus:border-emerald-500 cursor-pointer"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Out for delivery">Out for delivery</option>
                                                    </select>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ManageOrders