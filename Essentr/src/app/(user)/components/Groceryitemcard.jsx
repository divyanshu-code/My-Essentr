'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaRupeeSign } from 'react-icons/fa'
import { FaMinus } from 'react-icons/fa'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '@/Redux/cartSlice'

const GroceryItemCard = ({ item }) => {

  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.cart.cartItems.find((i) => i._id === item._id)
  );

  const count = cartItem ? cartItem.quantity : 0;

  const handleplus = () => dispatch(addToCart(item));
  const handleminus = () => dispatch(removeFromCart(item));

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  return (

    <motion.div
      variants={containerVars}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.div
        variants={itemVars}
        className="group relative bg-white rounded-xl cursor-pointer p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)] transition-all duration-500"
      >
        <div className="relative  h-52 w-full rounded-xl overflow-hidden shadow-sm">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover"
          />

          <div className="absolute top-2 right-3  opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-8 h-8 bg-white rounded-full cursor-pointer flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors">
              ♥
            </button>
          </div>
        </div>

        <div className="mt-3 px-2 pb-2">
          <div className="flex justify-between items-center mb-1 ">
            <h3 className="text-[16px] font-black text-gray-900 tracking-tight leading-tight group-hover:text-green-600 transition-colors">
              {item.name}
            </h3>
            <div >
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                {item.category}
              </span>
            </div>
          </div>

          <div className='flex items-center '>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              {item.unit || '1 unit'}
            </p>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-4">
              {item.unit1 || '1 unit'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Price</span>
              <div className="flex items-center text-2xl font-black text-gray-900">
                <FaRupeeSign size={16} className="mt-1" />
                <span>{item.price}</span>
              </div>
            </div>

            <motion.div
              layout
              initial={false}
              className="flex items-center gap-2 mt-3"
            >

              <AnimatePresence>
                {count > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={handleminus}
                      className="relative w-8 h-8 bg-gray-900 text-white rounded cursor-pointer flex items-center justify-center group/btn overflow-hidden shadow-xl shadow-gray-200"
                    >
                      <motion.div

                        className="flex flex-col items-center transition-all duration-300"
                      >
                        <FaMinus size={15} className="flex items-center" />
                      </motion.div>

                      <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-10" />
                    </motion.button>

                    <motion.span
                      key={count}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-lg font-black text-gray-900 min-w-5 text-center"
                    >
                      {count}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={handleplus}
                className="relative w-8 h-8 bg-gray-900 text-white rounded cursor-pointer flex items-center justify-center group/btn overflow-hidden shadow-xl shadow-gray-200"
              >
                <motion.div
                  initial={{ y: 0 }}
                  className="flex flex-col items-center "
                >
                  <FaPlus size={15} className="flex items-center" />
                </motion.div>

                <div className="absolute inset-0 bg-green-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-10" />
              </motion.button>

            </motion.div>
          </div>
        </div>

        <div className="absolute -z-10 inset-0 bg-linear-to-b from-transparent to-gray-50/50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

    </motion.div>
  )
}

export default GroceryItemCard