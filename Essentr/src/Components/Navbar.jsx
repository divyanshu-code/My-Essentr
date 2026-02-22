'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch, FaBell, FaBoxOpen,
  FaHeart, FaSignOutAlt,
  FaShoppingCart
} from 'react-icons/fa'
import { CgProfile } from "react-icons/cg";
import { IoSettingsSharp } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Slide } from 'react-toastify';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Navbar = ({ user }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  const showNotifications = user && ['vendor', 'delivery'].includes(user.role);

  const cartdata = useSelector((state) => state.cart.cartItems);

  const totalQuantity = cartdata.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut({ callbackUrl: "/register" });

    toast.error('Logout successfully!', {
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
  };

  const dropdownItems = [
    {
      label: user.role === 'customer' ?  <Link href={"/user/cart/myorder"}> My Orders </Link>  : 'Profile',
      icon: user.role === 'customer' ? <FaBoxOpen size={16} /> : <CgProfile size={20} />
    },
    {
      label: user.role === 'customer' ? 'Wishlist' : 'History',
      icon: user.role === 'customer' ? <FaHeart size={16} /> : <FaHistory size={16} />
    },
    {
      label: 'Setting',
      icon: <IoSettingsSharp />
    },
    {
      label: <button onClick={handleLogout} className='cursor-pointer'> Logout </button>,
      icon: <FaSignOutAlt size={16} onClick={handleLogout} />
    },
  ];

  const navItems = {
    customer: [],
    vendor: [ <Link href={"/vendor/manage-orders"}>Manage orders</Link>, 'Products', 'Sales'],
    delivery: ['Feed', 'Earnings', 'Help'],
  };

  const currentItems = navItems[user.role] || navItems.customer;

  return (
    <>
      <nav className="fixed top-0 w-full z-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-2xl border border-white/40 shadow-sm px-8 py-1 rounded">

          <div className="flex items-center gap-1 min-w-37.5 cursor-pointer">
            <Link href={"/"} className='flex items-center justify-center gap-1'>
              <ShoppingCart size={25} strokeWidth={2.75} className=" text-green-600" />
              <span className="text-2xl font-black bg-linear-to-r from-green-600 to-green-400  bg-clip-text text-transparent tracking-tight ">Essentr.</span>
            </Link >

            <div className='h-10 w-px ml-3 bg-gray-300 hidden md:block'></div>
            <h1 className='text-lg font-bold ml-3 text-center text-gray-900 tracking-tight '>From Store to Door.  </h1> <br />
            <span className='font-bold'> </span>
          </div>

          {user.role == 'customer' &&
            <motion.div
              animate={{ width: isSearchFocused ? '40%' : '30%' }}
              className="hidden md:flex items-center relative"
            >
              <FaSearch className={`absolute left-4 transition-colors ${isSearchFocused ? 'text-green-600' : 'text-gray-400'}`} />
              <input
                type="text"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search essentials..."
                className="w-full bg-gray-200/50 border border-transparent focus:border-green-200 focus:bg-white py-1.5 pl-12 pr-4 rounded outline-none transition-all text-sm font-medium"
              />
            </motion.div>
          }

          <div className="hidden md:flex items-center p-1.5 gap-5 relative">
            {currentItems.map((item) => (
              <button
                key={item}
                className="relative px-6 py-2 text-sm font-semibold  tracking-tight leading-tight cursor-pointer transition-colors duration-300 z-10 "
              >
                <motion.div
                  layoutId="activePill"
                  className="absolute  "
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
                <span className="relative z-20">{item}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 min-w-37.5 justify-end">
            
            {showNotifications && (
              <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer text-gray-500 hover:text-green-600 transition-colors">
                <FaBell size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  2
                </span>
              </motion.div>
            )}

            {user.role === 'customer' && (
              <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer text-gray-400 hover:text-green-600 transition-colors">

                <Link href={'/user/cart'}>
                  <FaShoppingCart size={20} />
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-green-600 text-center text-white text-[9.5px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                    {totalQuantity}
                  </span>
                </Link>
              </motion.div>
            )}

            <div className="h-10 p-0 w-px  bg-gray-300  hidden md:block" />

            <div className="relative" ref={dropdownRef}>
              <motion.div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileTap={{ scale: 0.98 }}
                className={`flex text-xl font-light items-center gap-3 p-1 pr-3 rounded cursor-pointer transition-all  `}
              >
                Account
              </motion.div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-2"
                  >
                    <div className=" px-4 py-2 leading-tight border-b border-gray-300 mb-2">
                      <div className='flex items-center justify-between'>
                        <p className="text-[12px] font-bold text-gray-500 uppercase ">My Account</p>
                        <p className="text-[12px] font-bold text-green-500 uppercase ">{user.role}</p>
                      </div>

                      <p className="text-xs font-light text-gray-800 ">{user.email}</p>
                      <div>
                      </div>
                    </div>

                    {dropdownItems.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 2 }}
                        className="flex items-center gap-2.5 px-4 py-2 rounded cursor-pointer transition-colors text-gray-600"
                      >
                        <span className="text-lg opacity-80 font-light ">{item.icon}</span>
                        <span className="text-sm  font-light text-gray-800">{item.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav >
    </>
  )
}

export default Navbar