'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaBoxOpen, FaUsers, FaChartLine } from 'react-icons/fa6'
import { FaShieldAlt } from "react-icons/fa";
import Navbar from '@/Components/Navbar';
import { FaMapMarkerAlt } from 'react-icons/fa'
import Link from 'next/link';
import { getSocket } from '@/Config/socket';
import { useEffect } from 'react';

const Vendor = ({ user, vendor }) => {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  const stats = [
    { label: 'Total Revenue', value: '₹0', icon: <FaChartLine />, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Active Users', value: '0', icon: <FaUsers />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending Orders', value: '0', icon: <FaBoxOpen />, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <>
      <Navbar user={user} />
      <section className="relative min-h-[85vh] flex items-center bg-[#f8f9fc] pt-20 pb-12 px-8 overflow-hidden">

        <div className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center z-10">

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <div className='flex items-center gap-3'>
              <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1 bg-green-600 text-white rounded shadow-lg shadow-green-200">
                <FaShieldAlt size={10} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Root Administrator Access</span>
              </motion.div>
              <motion.div variants={item} className="flex items-center gap-2 w-fit bg-white px-4 py-1 rounded-xl shadow-lg border border-gray-100">
                <FaMapMarkerAlt size={10} className="text-green-600" />
                <span className="text-[9.5px] font-bold text-gray-600 tracking-tight">Location :   <span className="text-black font-bold">{vendor?.address}</span></span>
              </motion.div>

            </div>

            <motion.div variants={item}>
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-tight tracking-tighter">
                Manage your <br />
                <span className="text-green-600 italic underline decoration-green-200">Ecosystem.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-lg mt-10 leading-tight">
                Welcome back,  <span className='text-black font-bold leading-relaxed'>{vendor?.name}</span>. Monitor real-time growth, manage inventory, and control system health all from your centralized command center.
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 py-4 bg-green-600  cursor-pointer text-white rounded-xl font-black text-md flex items-center gap-4 shadow-xl shadow-green-100 group"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-90 transition-transform">
                  <FaPlus />
                </div>
                <Link href="/vendor/add-grocery" className="text-white">Add New Grocery</Link>
              </motion.button>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 relative">
            <div className="absolute inset-0 bg-green-400/10 blur-[100px] rounded-full -z-10" />

            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.0 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col gap-4"
              >
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                </div>
                <div className="flex items-center gap-2 text-green-500 font-bold text-xs bg-green-50 w-fit px-2 py-1 rounded-lg">
                  ↑ 12.5% <span className="text-slate-400 font-medium">this month</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Vendor