'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaShippingFast, FaShieldAlt, FaStar } from 'react-icons/fa'
import Navbar from '@/Components/Navbar'
import Categoryslider from './Categoryslider'
import GroceryItemCard from './Groceryitemcard'
import { getSocket } from '@/Config/socket'

const User = ({ user, grocery }) => {

  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  }

  const childVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  const categories = [
    { label: '🥦 Vegetables', color: 'bg-green-100 text-green-700' },
    { label: '🍎 Fruits', color: 'bg-red-100 text-red-700' },
    { label: '🐮 Dairy', color: 'bg-blue-100 text-blue-700' },
    { label: '🛍️ Grocery', color: 'bg-amber-100 text-amber-700' },
  ]

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  }

  const [error, setError] = useState(null);
  const [address, setAddress] = useState("Detecting location...");

  useEffect(() => {

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = async (pos) => {

      const { latitude, longitude } = pos.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        const locationName = data.display_name || data.address.city_district || "Unknown Location";
        setAddress(locationName);
      } catch (err) {
        setAddress("Location found");
      }
    };

    const handleError = (err) => {

      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("User denied the request for Geolocation.");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case err.TIMEOUT:
          setError("The request to get user location timed out.");
          break;
        default:
          setError("An unknown error occurred.");
          break;
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
  }, [])

  useEffect(() => {
    const socket = getSocket();
  }, [])


  if (error) {
    return (
      <div className="text-sm font-medium text-center mt-10">
        <span className="text-red-500">📍 {error}</span>
      </div>
    )
  }

  return (
    <>
      <Navbar user={user} />
      <section className="relative w-full min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-green-200/30 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center z-10">

          <motion.div
            variants={containerVars}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-9"
          >
            <div className='flex items-center gap-3'>
              <motion.div variants={childVars} className="flex items-center gap-1 w-fit bg-white px-4 py-1 rounded-2xl shadow-sm border border-gray-100">
                <FaMapMarkerAlt size={11} className="text-green-600" />
                <span className="text-[9.5px] font-bold text-gray-600 tracking-tight">Delivering to <span className="text-black">{address}</span></span>
              </motion.div>

              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1 bg-white rounded-2xl shadow-sm border border-gray-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Open for 24/7 Delivery</span>
              </motion.div>
            </div>

            <motion.div variants={childVars}>
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                Eat Fresh, <br />
                <span className="text-green-600 italic">Live Better.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 font-medium max-w-md leading-tight ">
                Order groceries and daily essentials. <span className='text-green-600 font-bold italic'>Fresh food, </span> <span className='text-orange-500 font-bold italic'> Fast delivery, </span> <span className='text-red-500 font-bold italic'> no fuss.</span> Delivered from local stores to your door in <span className="text-gray-900 font-bold">18 minutes.</span>
              </p>
            </motion.div>

            <motion.div variants={childVars} className="flex flex-wrap gap-3">
              {categories.map((cat, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  className={`${cat.color} px-5 py-2.5 cursor-pointer rounded-xl font-bold text-sm transition-shadow hover:shadow-md`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-8 pt-6 border-t border-gray-100">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-12 h-12 rounded-full border-4 border-[#FAF9F6]" alt="user" />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-[#FAF9F6] bg-green-600 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter text-center leading-none">
                  12k+ <br /> Users
                </div>
              </div>
              <div>
                <div className="flex gap-1 text-amber-400 ">
                  {[...Array(5)].map((_, i) => <FaStar key={i} size={14} />)}
                </div>
                <p className="text-sm font-bold text-gray-800">Top-rated delivery in your city</p>
              </div>
            </motion.div>

            <motion.div variants={childVars} className="flex items-center gap-10 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <FaShippingFast className="text-gray-400" size={20} />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Free Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-gray-400" size={20} />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Pay</span>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative flex items-center justify-center mt-15">

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full  max-w-md aspect-4/5 bg-linear-to-b from-green-50 to-white rounded-[4rem] p-4 shadow-2xl overflow-hidden border border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover rounded-[3.5rem]"
                alt="Fresh Vegetables"
              />

              <div className="absolute bottom-6 left-6 right-6 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-green-700 tracking-widest">Most Popular</span>
                  <div className="flex text-black gap-0.5">
                    {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Weekly Fresh Basket</h4>
                <p className="text-sm text-gray-600">Starting from ₹499</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 30, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute -top-10 -right-5 w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl"
            >
              🍉
            </motion.div>

            <motion.div
              animate={{ y: [0, -40, 0], rotate: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              className="absolute bottom-10 -left-10 w-28 h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4 border border-gray-50"
            >
              <div className="text-center">
                <p className="text-2xl font-black text-green-600">98%</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase ">Freshness Guarantee</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -z-10 w-[120%] h-[120%] border border-dashed border-gray-300 rounded-full"
            />
          </div>
        </div>
      </section >

      <Categoryslider />

      <h1 className="text-4xl md:text-4xl font-black text-black tracking-tighter leading-tight mx-39">Popular <span className="text-gray-400 italic font-light">Items</span> </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12 max-w-7xl mx-auto">

        {grocery.map((item) => (

          <GroceryItemCard key={item._id} item={item} />

        ))}
      </div>
    </>
  )
}

export default User