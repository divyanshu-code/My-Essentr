'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaMinus, FaArrowRight, FaShoppingBag, FaArrowLeft } from 'react-icons/fa'
import { HiOutlineReceiptTax } from 'react-icons/hi'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '@/Redux/cartSlice'

const CartPage = () => {

    const cartData = useSelector((state) => state.cart.cartItems);

    const isEmpty = cartData.length === 0;

    const dispatch = useDispatch();

    const subtotal = useSelector((state) => state.cart.subTotal)
    const deliveryFee = useSelector((state) => state.cart.deliveryFee);
    const total = useSelector((state) => state.cart.Total);

    return (
        <div className="lg:h-182  w-full overflow-hidden bg-[#0A0A0B] flex flex-col text-white pt-10 pb-30  px-6 md:px-12">

            <header className="w-full  border-b border-white/5 pt-12 pb-6 px-6 md:px-12 shrink-0">
                <div className="max-w-7xl mx-auto w-full">
                    <Link href="/">
                        <motion.button
                            whileHover={{ x: -5 }}
                            className="flex items-center  gap-2 cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            <FaArrowLeft size={10} /> Back to Dashboard
                        </motion.button>
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black tracking-tighter"
                    >
                        Your <span className="text-emerald-500 italic">Bag.</span>
                    </motion.h1>
                    <p className="text-zinc-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        {cartData.length} Unique items ready for checkout
                    </p>
                </div>
            </header>

            <main className="flex-1 min-h-0 overflow-hidden px-6 md:px-12">
                <div className="max-w-7xl mx-auto h-full grid lg:grid-cols-12 gap-12 py-8">
                    <div className="lg:col-span-8 h-full overflow-y-auto pr-4 space-y-4 ">
                        <AnimatePresence mode='popLayout'>
                            {cartData.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 group hover:border-emerald-500/30 transition-colors"
                                >

                                    <div className="w-20 h-20 rounded-md overflow-hidden bg-black shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-500" alt={item.name} />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-black tracking-tight">{item.name}</h3>
                                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{item.unit}{item.unit1} • ₹{item.price} per unit</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-black/40 p-2 rounded-lg border border-white/5">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => dispatch(removeFromCart(item))}
                                            className="relative cursor-pointer w-10 h-9 bg-zinc-800 text-white rounded flex items-center justify-center group/btn overflow-hidden transition-colors"
                                        >
                                            <FaMinus size={14} />
                                            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-10" />
                                        </motion.button>

                                        <span className="text-lg font-black w-6 text-center">{item.quantity}</span>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => dispatch(addToCart(item))}
                                            className="relative w-10 h-9 cursor-pointer bg-zinc-800 text-white rounded flex items-center justify-center group/btn overflow-hidden transition-colors"
                                        >
                                            <FaPlus size={14} />
                                            <div className="absolute inset-0  bg-emerald-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-10" />
                                        </motion.button>
                                    </div>

                                    <div className="text-right min-w-25">
                                        <p className="text-2xl font-black text-emerald-400">₹{item.price * item.quantity}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {cartData.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-white/10">
                                <FaShoppingBag className="mx-auto text-zinc-800 mb-4" size={50} />
                                <h2 className="text-2xl font-bold text-zinc-500">Your bag is empty</h2>
                                <Link href={"/"} className="inline-block mt-6 px-6 py-3 leading-tight bg-emerald-500 cursor-pointer text-black font-black rounded-full  transition-transform">Start Shopping</Link>
                            </motion.div>
                        )}
                    </div>

                    <div className="lg:col-span-4 h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-900 border border-white/10 py-6 px-8 rounded-xl shadow-2xl h-fit relative overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px]" />

                            <h2 className="text-2xl font-black mb-5 flex items-center gap-3">
                                <HiOutlineReceiptTax className="text-emerald-500" /> Order Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-zinc-400 font-bold text-sm uppercase tracking-tighter">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400 font-bold text-sm uppercase tracking-tighter">
                                    <span>Delivery Fee</span>
                                    <span className={deliveryFee === 0 ? "text-emerald-500" : "text-white"}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="h-px bg-white/5 my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 font-black text-xs uppercase tracking-widest">Total Amount</span>
                                    <span className="text-4xl font-black text-white tracking-tight">₹{total}</span>
                                </div>
                            </div>

                            <motion.div
                                whileHover={!isEmpty ? { scale: 1.02 } : {}}
                                whileTap={!isEmpty ? { scale: 0.98 } : {}}
                                className={`w-full py-3 font-black text-xl rounded-lg flex items-center justify-center group transition-all duration-300 
                                ${isEmpty
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                        : "bg-emerald-500 text-black cursor-pointer shadow-xl shadow-emerald-500/20"
                                    }`}
                            >
                                {isEmpty ? (
                                    <div className="flex items-center gap-2">
                                        Proceed to Checkout
                                        <FaArrowRight size={16} className="opacity-30" />
                                    </div>
                                ) : (
                                    <Link href={"/user/cart/checkout"} className="flex items-center gap-2 w-full justify-center">
                                        Proceed to Checkout
                                        <FaArrowRight size={16} className="inline-block group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </motion.div>
                            <p className="text-[10px] text-zinc-600 text-center mt-5 font-bold uppercase tracking-widest">
                                Secure Encrypted Checkout
                            </p>
                        </motion.div>

                        {subtotal < 150 && subtotal > 0 && (
                            <div className="mt-6 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                                <p className="text-xs font-bold text-emerald-500 mb-3 uppercase tracking-tighter">
                                    Add ₹{150 - subtotal} more for FREE Delivery
                                </p>
                                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(subtotal / 150) * 100}%` }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CartPage