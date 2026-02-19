'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedBold } from "react-icons/pi";
import { Slide } from 'react-toastify';
import { toast } from 'react-toastify';
import { TbLoaderQuarter } from "react-icons/tb";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Signup = ({ previousstep }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [formState, setFormState] = useState('neutral')          // neutral, warning, excited
  const [input, setinput] = useState({})
  const [loading, setloading] = useState(false)

   const router = useRouter();;

  const mascotRef = useRef(null)
  const [showpassword, setshowpassword] = useState(false)

  // Track Mouse for Eye & Head movement

  const handlechange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setinput(values => ({ ...values, [name]: value }))
  }

  useEffect(() => {
    const handleMove = (e) => {
      if (!mascotRef.current) return
      const rect = mascotRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = (e.clientX - centerX) / 30
      const y = (e.clientY - centerY) / 30
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const handlePasswordFocus = () => {
    const hasEmail = input.email && input.email.length > 3;
    const hasName = input.name && input.name.length > 1;

    if (isLogin) {
      if (!hasEmail) setFormState('warning');
    } else {
      if (!hasEmail || !hasName) setFormState('warning');
    }
  }

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {

      if (!isLogin) {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),               // Convert the data (e.g., 'input' from your state/form) into a JSON string
        });

        const result = await response.json();         // Parse the JSON response body

        if (!response.ok) {

          throw new Error(result.message || "Something went wrong");
        }

        if (result.success) {
          toast.success('Account created successfully!', {
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

          setinput({});                          // Clear the form inputs after successful submission
        }

        router.push('/');                       // Redirect to home page after successful signup

        setloading(false);

      } else {

        const result = await signIn('credentials', {
          redirect: false,
          email: input.email,
          password: input.password,
        });

        if (result?.error) {

          throw new Error(result.error);
        } else {

          toast.success('Login successfully!', {
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

          setinput({});                          
          setloading(false);
        }
         
        router.push('/');                       // Redirect to home page after successful login
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);

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

      setloading(false);

    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">

      {/* LEFT SIDE - Animations */}
      <div className="hidden lg:flex w-1/2 flex-col  relative bg-[#E2E8D5]">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 1.00 }}
        >
          <IoIosArrowBack className='cursor-pointer text-green-600 mt-2 ml-2' size={30} onClick={() => previousstep(0)} />
        </motion.div>

        <div className="relative z-10 px-12 mt-2">
          <h1 className="text-4xl font-extrabold text-green-600 tracking-tighter italic">Essentr</h1>
          <h1 className='text-xl font-bold  text-green-600 italic'>From Store to Door.</h1>
        </div>

        <AnimatePresence>
          {formState === 'warning' && isLogin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="absolute top-48 left-40 bg-white p-3 rounded-xl  border border-pink-100 z-20 text-sm font-bold text-pink-600"
            >
              Wait! I need your email first! 😊
              <div className="absolute -bottom-2 left-1/2 translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-pink-100" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {formState === 'warning' && !isLogin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="absolute top-48 left-28 bg-white p-3 rounded-xl  border border-pink-100 z-20 text-sm font-bold text-pink-600"
            >
              Wait! I need your name and email first! 😊
              <div className="absolute -bottom-2 left-1/2 translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-pink-100" />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={mascotRef} className="relative flex  items-end justify-center mt-30 gap-4">

          {/* GREEN MONSTER */}
          <motion.div
            animate={formState === 'excited' ? { y: [0, -20, 0] } : { y: mousePos.y * 0.2 }}
            transition={
              {
                repeat: Infinity,
                duration: 1
              }
            }
            className="relative w-40 h-40 bg-green-400 rounded-full  flex items-center justify-center"
          >
            {/* Hair */}
            <div className="absolute -top-10 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-4 h-12 bg-green-400 rounded-full transform -rotate-12 origin-bottom" />
              ))}
            </div>
            {/* Eye */}
            <div className="w-12 h-12 bg-white rounded-full relative overflow-hidden border border-gray-200">
              <motion.div
                animate={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
                className="w-6 h-6 bg-black rounded-full absolute top-3 left-3"
              />
            </div>
            {/* Mouth */}
            <motion.div
              animate={{
                height: formState === 'warning' ? 2 : 8,
                width: 20,
                borderRadius: formState === 'warning' ? '2px' : '0 0 10px 10px'
              }}
              className="absolute bottom-10 bg-black"
            />
            {/* Tooth */}
            <div className="absolute bottom-11 left-14 w-2 h-3 bg-white rounded-sm" />

            {/* Hands */}
            <div className="absolute -bottom-4 left-0 w-12 h-8 bg-green-400 rounded-full" />
            <div className="absolute -bottom-4 right-0 w-12 h-8 bg-green-400 rounded-full" />
          </motion.div>

          {/* BLUE MONSTER */}
          <motion.div
            animate={formState === 'excited' ? { y: [0, -30, 0] } : { y: mousePos.y * 0.3 }}
            transition={
              {
                repeat: Infinity,
                duration: 1
              }
            }
            className="relative w-40 h-56 bg-blue-400 rounded-t-[5rem] rounded-b-3xl  flex items-center justify-center"
          >
            {/* Hair */}
            <div className="absolute -top-10 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-4 h-12 bg-blue-400 rounded-full transform -rotate-12 origin-bottom" />
              ))}
            </div>
            {/* Eye */}
            <div className="w-12 h-12 bg-white rounded-full relative overflow-hidden border border-gray-200 mb-8">
              <motion.div
                animate={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
                className="w-6 h-6 bg-black rounded-full absolute top-3 left-3"
              />
            </div>
            {/* Mouth */}
            <motion.div
              animate={{
                height: formState === 'warning' ? 2 : 8,
                width: 20,
                borderRadius: formState === 'warning' ? '2px' : '0 0 10px 10px'
              }}
              className="absolute bottom-20 bg-black"
            />
            {/* Tooth */}
            <div className="absolute bottom-21 right-14 w-2 h-4 bg-white rounded-sm" />
            {/* Hands */}
            <div className="absolute -bottom-4 left-2 w-14 h-10 bg-blue-400 rounded-full" />
            <div className="absolute -bottom-4 right-2 w-14 h-10 bg-blue-400 rounded-full" />
          </motion.div>

        </div>
        <div className="relative z-10 ml-8 mt-30 max-w-sm italic">
          <motion.p
            key={isLogin ? "txt1" : "txt2"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl  text-green-900 leading-tight"
          >
            {isLogin
              ? "Good things come to those who wait for the right lifestyle."
              : "Start your journey toward a more intentional lifestyle."}
          </motion.p>
          <div className="h-1 w-12 bg-green-600 mt-6 rounded-full" />
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="w-full max-w-md"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
              {isLogin ? "Welcome Back!" : "Start Fresh."}
            </h2>
            <p className="text-gray-500 mt-1 font-medium">Please enter your details to continue.</p>
          </motion.div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <motion.div variants={fadeInUp} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <input type="text"
                  className="w-full mt-2 px-5 py-2 rounded-lg border border-gray-200 bg-gray-50  focus:border-green-600 outline-none transition-all"
                  placeholder="Enter your name"
                  name='name'
                  value={input.name || ''}
                  onChange={handlechange}
                />
              </motion.div>
            )}

            <motion.div
              variants={fadeInUp}
            >
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                name="email"
                value={input.email || ''}
                onChange={handlechange}
                onBlur={() => setFormState('neutral')}
                className="w-full mt-2 px-5  py-2 rounded-lg  border bg-gray-50 border-gray-200 focus:border-green-600 outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </motion.div>
            <motion.div
              variants={fadeInUp}
            >
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>

              <div className='relative flex items-center justify-between'>
                <input
                  type={showpassword ? "text" : "password"}
                  onFocus={handlePasswordFocus}
                  name="password"
                  value={input.password || ''}
                  onChange={handlechange}
                  onBlur={() => setFormState('neutral')}
                  className="w-full mt-2 px-5  py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-600 outline-none transition-all"
                  placeholder="••••••••"
                />

                {showpassword ? <PiEyeClosedBold size={18} onClick={() => setshowpassword(!showpassword)} className='absolute right-3.5 top-5 text-gray-400 cursor-pointer transition-all duration-300' /> : <FaEye size={18} onClick={() => setshowpassword(!showpassword)} className='absolute right-3.5 top-5 text-gray-400 cursor-pointer transition-all duration-300' />}
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setFormState('excited')}
              onMouseLeave={() => setFormState('neutral')}
              variants={fadeInUp}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className={`w-full py-3 bg-gray-900 text-white rounded-lg font-bold shadow-xl shadow-gray-200 transition-all ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-black"
                }`}
            >
              {loading ? (
                <TbLoaderQuarter className="m-auto animate-spin" size={20} />
              ) : (
                isLogin ? "Sign In" : "Register"
              )}
            </motion.button>
          </form>

          <motion.div variants={fadeInUp} className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500 tracking-widest">Or</span></div>
          </motion.div>

          <motion.div variants={fadeInUp} className="">
            <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl cursor-pointer transition-all font-medium text-sm text-gray-700" onClick={()=> signIn("google" , { callbackUrl: "/" })}>
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </motion.div>

          <motion.p variants={fadeInUp} className="mt-10 text-center text-sm font-semibold text-gray-500 cursor-pointer">
            {isLogin ? "New to Essentr ?" : "Already have an account?"} {' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-700 font-bold hover:underline cursor-pointer"
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup