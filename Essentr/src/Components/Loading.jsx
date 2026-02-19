'use client'
import React from 'react'
import { motion } from 'framer-motion'

const Loading = () => {

  const pulseScale = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 1, 0.5],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  }

  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
  }

  return (
    <div className="fixed inset-0 z-100 bg-[#FAF9F6] flex flex-col items-center justify-center px-6">
      
      <div className="relative mb-12">
        <motion.div 
          variants={pulseScale}
          animate="animate"
          className="w-24 h-24 bg-green-600 rounded-4xl flex items-center justify-center shadow-2xl shadow-green-200"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-green-500 rounded-4xl"
        />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3 text-center mb-8">
            <motion.h3 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg font-black text-gray-900 uppercase tracking-widest"
            >
              Your best grocery app...
            </motion.h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter italic">Picking the best for you...</p>
        </div>


        {[1, 2, 3].map((i) => (
          <div key={i} className="relative h-20 bg-white rounded-3xl border border-gray-100 overflow-hidden p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-3 bg-gray-100 rounded-full" />
              <div className="w-1/4 h-2 bg-gray-50 rounded-full" />
            </div>

            <motion.div 
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent z-10"
            />
          </div>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-green-100/40 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" 
        />
      </div>
    </div>
  )
}

export default Loading