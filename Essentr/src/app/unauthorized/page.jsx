'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaLock, FaArrowLeft, FaUserShield } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const Unauthorized = () => {
    const router = useRouter();
  return (
    
     <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 overflow-hidden relative">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-red-100 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center relative z-10"
      >

        <div className="relative mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center relative z-10"
          >
            <FaLock size={48} className="text-red-500" />
          </motion.div>
          
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 w-32 h-32 border-4 border-red-200 rounded-[2.5rem] z-0"
          />
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -top-7 -right-4 w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-xl"
          >
            <FaUserShield size={20} />
          </motion.div>
        </div>


        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
          Wait a <span className="text-red-600">Minute!</span>
        </h1>
        <p className="text-lg text-gray-500 font-medium mb-10 leading-tight">
          It looks like you're trying to enter a restricted zone. You don't have right to access it. 
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black flex items-center justify-center gap-3 shadow-sm hover:border-gray-900 transition-all cursor-pointer"
          >
            <FaArrowLeft />
            Go Back
          </motion.button>
        </div>

      </motion.div>
    </div>
  )
}

export default Unauthorized