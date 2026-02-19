'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';
import image from '../../public/image.png'
import { ShoppingCart } from 'lucide-react';

const Landing = ({ nextstep }) => {

  const slogan = "Your needs, our responsibility.";

  const words = slogan.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.10, delayChildren: 0.5 * i },
    }),
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  const wordVariants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 50,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
  };

  const overlayVariants = {
    initial: { opacity: 2 },
    exit: {
      y: "-100vh",
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    }
  };
  return (
    <>
      <motion.div
        variants={overlayVariants}
        initial="initial"
        exit="exit"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      >

        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src={image}
            alt="Essentr Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 3 }}
              className="flex gap-1 items-center justify-center">
              <ShoppingCart size={32} strokeWidth={2.75} className=" text-green-600" />
              <h1 className='text-4xl bg-linear-to-r from-green-600 to-green-400  bg-clip-text text-transparent font-extrabold'>Essentr.</h1>
            </motion.div>
          
          <motion.h1
            className="mb-6 text-4xl md:text-3xl  font-light tracking-wide text-center px-4 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2 md:mr-4"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1, 1.08, 1] }}
            transition={
              {
                opacity: { delay: 2.5, duration: 0.6 },
                scale: {
                  delay: 3.1,               // Starts pulsing right after it fades in
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }
              }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border cursor-pointer border-[#131312] rounded-full text-center text-xs tracking-widest uppercase transition-colors duration-300 focus:outline-none hover:bg-green-600 hover:text-white hover:border-green-600 font-semibold  "
            onClick={() => nextstep(1)}
          >
            Get Started

          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

export default Landing