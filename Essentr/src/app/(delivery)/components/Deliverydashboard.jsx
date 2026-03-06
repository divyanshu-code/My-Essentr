'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import {
  Power,
  Map,
  Package,
  ChevronRight,
  Star,
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import axios from 'axios';
import { getSocket } from '@/Config/socket';
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';

const Deliverydashboard = ({ user }) => {
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("Detecting location...");

  const [assignments, setAssignments] = useState([]);

  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const savedStatus = localStorage.getItem('rider_status');
    if (savedStatus === 'online') {
      setIsOnDuty(true);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('rider_status', isOnDuty ? 'online' : 'offline');
  }, [isOnDuty, isMounted]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await axios.get(`/api/map?lat=${latitude}&lon=${longitude}`);
        const data = res.data;
        const locationName = data.display_name || data.address?.city_district || "Unknown Location";
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

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000
    });
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch('/api/delivery/getassignment', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();

        setAssignments(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (isOnDuty) {
      fetchAssignments();
    }
  }, [isOnDuty]);


  useEffect(() => {
    const socket = getSocket();

    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("new-assignments", (deliveryAssign) => {

      console.log("deliveryboy", deliveryAssign)

      setAssignments((prev) => {

        const isDuplicate = prev.some(item => item._id === deliveryAssign._id);

        if (isDuplicate) {
          return prev;
        }

        return [...prev, deliveryAssign];
      });
    });

    socket.on("vendorOrderReady", ({ childOrderId, status }) => {
      setAssignments((prev) =>
        prev.map((assignment) => {

          const updatedChildOrders = assignment.masterOrderId?.childOrders?.map((child) => {
            if (child._id === childOrderId) {
              return { ...child, status: status };
            }
            return child;
          });

          return {
            ...assignment,
            masterOrderId: {
              ...assignment.masterOrderId,
              childOrders: updatedChildOrders
            }
          };
        })
      );
    });

    return () => {
      socket.off("new-assignments");
      socket.off("vendorOrderReady");
    };
  }, [user?._id]);

  const childVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  if (error) {
    return (
      <div className="text-sm font-medium text-center mt-10">
        <span className="text-red-500">📍 {error}</span>
      </div>
    )
  }

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`/api/delivery/assignments/${id}/acceptassignment`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error("Failed to accept assignment");

      const data = await res.json();

      setAssignments((prev) => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error("Accept error:", error);

      toast.error(error.message, {
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
  }

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen px-24 pt-15 bg-[#FAF9F6]">

        <motion.div variants={childVars} initial="initial" animate="animate" className="flex mt-5 ml-8 items-center gap-1 w-fit bg-white px-4 py-1 rounded-2xl shadow-sm border border-gray-100">
          <FaMapMarkerAlt size={11} className="text-green-600" />
          <span className="text-[9.5px] font-bold text-gray-600 tracking-tight">
            Delivering to <span className="text-black">{address}</span>
          </span>
        </motion.div>

        <div className="px-8 pt-14 pb-4 flex justify-between items-center ">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-md font-bold text-slate-800">{user?.name}</h2>
              <div className="flex items-center gap-1 text-orange-500">
                <Star size={10} fill="currentColor" />
                <span className="text-xs font-bold text-slate-500">4.9 (240+ trips)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <motion.div
            animate={{ backgroundColor: isOnDuty ? '#22C55E' : '#FFFFFF' }}
            className={`p-6 rounded-3xl shadow-lg border-2 ${isOnDuty ? 'border-transparent text-white' : 'border-slate-100 text-slate-800'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${isOnDuty ? 'text-green-100' : 'text-slate-400'}`}>Current Status</p>
                <h3 className="text-xl font-black mt-1">{isOnDuty ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}</h3>
              </div>
              <button
                onClick={() => setIsOnDuty(!isOnDuty)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${isOnDuty ? 'bg-white text-green-600' : 'bg-slate-900 text-white'}`}
              >
                <Power size={25} />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="px-6 mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Available Near You</h3>
            <span className="text-xs font-bold text-orange-500 px-3 py-1 bg-orange-50 rounded-full">
              {assignments.length} Orders
            </span>
          </div>

          <AnimatePresence>
            {!isOnDuty ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
                <Map className="mx-auto text-slate-200 mb-2" size={40} />
                <p className="text-slate-400 text-sm font-medium">Switch Online to see incoming orders</p>
              </motion.div>
            ) : (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4 pb-20">

                {assignments.length > 0 ?
                  assignments.map((order, index) => (
                    <div key={order._id || index} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                            <Package size={16} />
                          </div>
                          <div className='flex flex-col'>
                            <div className='flex items-center gap-2'>
                              <span className="text-xs font-black text-slate-900">Amount: ₹{order?.masterOrderId?.totalAmount}</span>
                              <span className="text-xs font-black text-slate-900"> Customer payable amount: ₹{order?.masterOrderId?.change?.customerGiveamt}</span>
                              <span className="text-xs font-black text-slate-900" > {order?.masterOrderId?.change?.deliveryReturnamt != 0 ? `Return amount: ₹${order?.masterOrderId?.change?.deliveryReturnamt}` : null}</span>
                            </div>
                            <span className="text-xs font-medium text-slate-500">Payment: {order?.masterOrderId?.isPaid ? "Paid" : "Pending"}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">2.5 KM</span>
                      </div>

                      <div className="flex gap-4 mb-6 ml-3">

                        <div className="flex flex-col mt-2 items-center py-1">

                          <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" />

                          <div className="flex-1 w-[2px] bg-gradient-to-b from-slate-200 to-orange-200 my-1" />

                          <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">
                              Pickups:
                            </span>
                            {order.masterOrderId?.childOrders?.map((child, idx) => {

                              const isReady = child.status === 'Out for delivery' || child.status === 'Delivered';

                              return (
                                <div
                                  key={idx}
                                  className={`flex items-start gap-3 w-96 p-2 rounded-lg border transition-all duration-300 ${isReady ? 'bg-green-50 border-green-200' : 'bg-slate-100 border-slate-100'
                                    }`}
                                >
                                  <div className="mt-2 flex-shrink-0">
                                    {isReady ? (
                                      <div className="bg-green-500 rounded-full p-0.5 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    )}
                                  </div>

                                  <div className='flex items-center justify-center'>
                                    <div className='flex flex-col'>
                                      <div className="flex items-end gap-2">
                                        <p className={`text-[10px] font-black leading-none ${isReady ? 'text-green-800' : 'text-slate-800'}`}>
                                          {child.vendor?.businessName || "Store"}
                                        </p>
                                      {isReady && (
                                        <span className="text-[7px] font-bold  text-green-600 uppercase bg-green-200 px-1  rounded-[4px]">
                                          Ready for Pickup
                                        </span>
                                      )}
                                      </div>
                                      <p className={`text-[10px] font-medium mt-1 italic ${isReady ? 'text-green-600/70' : 'text-slate-500'}`}>
                                        {child.vendor?.address || "Address not available"}
                                      </p>
                                    </div>
                                    
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-1">
                            <p className="text-[10px] font-bold text-zinc-600">
                              <span className="uppercase text-orange-600">Drop :</span> {order.masterOrderId?.shippingAddress?.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {order.status === 'broadcasted' &&
                        <div className="flex gap-2">
                          <button onClick={() => handleAccept(order?._id)} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer">
                            Accept <ChevronRight size={18} />
                          </button>
                          <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform border border-red-100 cursor-pointer">
                            Reject
                          </button>
                        </div>
                      }
                    </div>
                  )) : (
                    <p className="text-center text-slate-400 py-10">No orders available right now.</p>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Deliverydashboard;