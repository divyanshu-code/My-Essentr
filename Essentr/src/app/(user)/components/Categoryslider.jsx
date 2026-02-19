'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'

const categories = [
  { id: 1, name: "Fresh Fruits and Vegetables", img: "https://i.pinimg.com/736x/8e/48/2a/8e482a2d2058f2b56e62fce32306b3f9.jpg" },
  { id: 2, name: "Rice, Atta & Grains", img: "https://i.pinimg.com/736x/56/f4/14/56f41420edfd4554fa00310232595526.jpg" },
  { id: 3, name: "Dairy & Eggs", img: "https://i.pinimg.com/736x/77/a7/57/77a757f1a1c223baa97f6775e69a6246.jpg" },
  { id: 4, name: "Beverages & Drinks", img: "https://i.pinimg.com/1200x/da/59/2d/da592d0cd12a1ec22ab883923a538eb0.jpg" },
  { id: 5, name: "Snacks & Biscuits", img: "https://i.pinimg.com/736x/e2/c6/d1/e2c6d1b2ca71cf66593c5689b0424b4c.jpg" },
  { id: 6, name: "Spices & Masalas", img: "https://i.pinimg.com/1200x/a0/07/20/a00720e97ee8e4e60286ba529d52f67a.jpg" },
  { id: 7, name: "Household Essentials", img: "https://i.pinimg.com/736x/07/37/32/0737325bd005402e4d0de2f233593dfe.jpg" },
  { id: 8, name: "Instant & Packaged Food", img: "https://i.pinimg.com/736x/0c/1f/06/0c1f0675904154a132f86a926f638c38.jpg" },
  { id: 9, name: "Baby & Pet Care", img: "https://i.pinimg.com/1200x/93/96/64/9396649ca6fa3c985da096da7bf1cf43.jpg" },
];


const CategorySlider = () => {
  return (
    <section className="py-30 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-black text-xs uppercase tracking-[0.4em]"
          >
            Explore Departments
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none"
          >
          Shop by <span className="text-gray-400 italic font-light">Category</span>
          </motion.h2>
        </div>
        
        <motion.button 
          whileHover={{ gap: "20px" }}
          className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-black font-bold group"
        >
          Explore All Categories <FaArrowRight className="text-emerald-500 group-hover:translate-x-1 transition-all" />
        </motion.button>
      </div>
 
      <div className="relative">
        <div className="scrollbar-hide flex overflow-x-auto gap-8 px-8 pb-12 overflow-scroll snap-x">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="shrink-0 snap-start"
            >
              <div className="relative w-45 h-60 group cursor-pointer">

                <div className="absolute inset-0 bg-zinc-900 rounded-4xl overflow-hidden transform group-hover:rotate-0 -rotate-3 transition-all duration-500 border border-white/5 group-hover:border-white">
                  <img 
                    src={cat.img} 
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                  />
                  
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                <div className="absolute bottom-5 left-8 right-8 z-10">
        
                  <h3 className="text-2xl font-black text-white leading-tight tracking-tighter">
                    {cat.name.split(' ')[0]} <br />
                    <span className="text-zinc-400 group-hover:text-white transition-colors">{cat.name.split(' ')[1]}{cat.name.split(' ')[2] ? ' ' + cat.name.split(' ')[2] : ''}{cat.name.split(' ')[3] ? ' ' + cat.name.split(' ')[3] : ''}</span>

                  </h3>
                  
                  <div className="mt-4 w-12 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </div>

                <span className="absolute -top-2 -right-4 text-6xl font-black text-black/50 italic pointer-events-none group-hover:text-emerald-500/50 transition-colors">
                  0{index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySlider