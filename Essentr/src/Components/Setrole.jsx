'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShoppingBag, FaStore } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { toast, Slide } from 'react-toastify';
import { useSession } from 'next-auth/react';

const roleData = [
  {
    id: 'vendor',
    title: 'Store Owner',
    description: 'List your products, manage inventory, and grow your business.',
    icon: <FaStore size={25} />,
    themeColor: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-500',
    shadowColor: 'shadow-amber-100',
  },
  {
    id: 'customer',
    title: 'Customer',
    description: 'Discover essentials, order easily, and get door-step delivery.',
    icon: <FaShoppingBag size={25} />,
    themeColor: 'green',               // Tailwind color name root
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-500',
    shadowColor: 'shadow-green-100',
  },
  {
    id: 'delivery',
    title: 'Delivery Partner',
    description: 'Accept orders, navigate efficiently, and earn on your schedule.',
    icon: <MdDeliveryDining size={30} />,
    themeColor: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-500',
    shadowColor: 'shadow-blue-100',
  },
];
const Setrole = () => {

  const [selectedRole, setSelectedRole] = useState(null);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { update } = useSession();

  const validateMobile = (value) => {
    setMobile(value);
    const phoneRegex = /^[6-9]\d{9}$/;                            // Basic Indian context: starts with 6-9, 10 digits total
    if (value.length > 0 && !phoneRegex.test(value)) {
      setError('Please enter a valid 10-digit mobile number');
    } else {
      setError('');
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!mobile || error) {
      setError('Please enter a valid mobile number before continuing.');
      return;
    }

    try {
      const response = await fetch('/api/auth/setrole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole, mobile }),               // Convert the data (e.g., 'input' from your state/form) into a JSON string
      });

      await update({role : selectedRole});

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update role");
      }
      
      if (result.success) {
        router.push('/');                          // Redirect to home page after setting role
      } else {
        console.error("Failed to set role:", result.message);
      }

    } catch (err) {
      console.error("Error setting role:", err);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 20 }
    }
  };
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mb-12"
      >
        <h1 className="text-4xl md:text-2xl font-black text-gray-900 tracking-tight mt-10">
          Who are you in <span className="bg-linear-to-r from-green-600 to-green-400  bg-clip-text text-transparent italic">Essentr</span> ?
        </h1>
        <p className="text-lg text-gray-500 font-medium font-mono leading-tight mb-6">
          Select your role to personalize your experience.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-5xl "
      >
        {roleData.map((role) => {
          const isSelected = selectedRole === role.id;
          const isOtherSelected = selectedRole !== null && !isSelected;

          return (
            <motion.div
              key={role.id}
              variants={cardVariants}
              whileTap={!isOtherSelected ? { scale: 0.98 } : {}}
              onClick={() => setSelectedRole(role.id)}
              className={`
                relative overflow-hidden rounded-xl p-8 cursor-pointer transition-all duration-500 ease-out
                bg-white border
                ${isSelected ? `${role.borderColor} ${role.shadowColor} shadow-lg scale-[1.02] ` : 'border-transparent shadow-xl shadow-gray-100'}
                ${isOtherSelected ? 'opacity-50 blur-[2px] grayscale-30 scale-95' : 'opacity-100'}
              `}
            >

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className={`absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl ${role.bgColor.replace('100', '300')}`}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10">

                <div className={`w-12 h-12 rounded-xl ${role.bgColor} ${role.textColor} flex items-center justify-center mb-5 shadow-sm`}>
                  {role.icon}
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-500 font-medium leading-5">{role.description}</p>
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`absolute top-6 right-6 w-10 h-10 rounded-full ${role.bgColor} ${role.textColor} flex items-center justify-center border ${role.borderColor}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="w-full max-w-sm mt-12 overflow-hidden">
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: 20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative group">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mobile Number</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r pr-3 border-gray-200">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => validateMobile(e.target.value.replace(/\D/g, ''))}
                    className={`
                        w-full pl-16  py-3 rounded-lg bg-white border outline-none transition-all font-bold text-md tracking-widest
                        ${error ? 'border-red-400  ring-red-500/10' : 'border-gray-100 focus:border-green-600  ring-green-600/5'}
                      `}
                    placeholder="**********"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-24 mt-10 flex items-start justify-center">
        <AnimatePresence mode="wait">
          {selectedRole && (
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              onClick={handleContinue}
              whileTap={{ scale: 0.95 }}
              className={`
                px-5 py-2 cursor-pointer rounded-xl text-sm font-semibold leading-relaxed text-white shadow-md transition-colors
                ${selectedRole === 'customer' ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : ''}
                ${selectedRole === 'vendor' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : ''}
                ${selectedRole === 'delivery' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' : ''}
                `}
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Setrole