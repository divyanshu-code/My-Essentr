'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStore, FaPhoneAlt, FaMapMarkerAlt, FaUserEdit, FaArrowRight } from 'react-icons/fa'
import { FaUserCircle } from "react-icons/fa";
import Vendor from './Vendor';
import { toast, Slide } from 'react-toastify';
import { TbLoaderQuarter } from 'react-icons/tb';

const VendorSetup = ({ user }) => {
 
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        secondaryMobile: '',
        address: '',
        status: true
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid = formData.name && formData.businessName  && formData.address.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/vendor-setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: user._id }),
            });

            const result = await response.json();

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

                setFormData({
                    name: '',
                    businessName: '',
                    primaryMobile: '',
                    secondaryMobile: '',
                    address: '',
                });

                setLoading(false);

                setIsSubmitting(true);
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

            setLoading(false);
        }
    };

    if (isSubmitting) {    

        return <Vendor user={user} />
    }

    return (
       
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center py-5 ">

            <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-100 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-white rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.05)] border border-gray-100 p-10 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <FaStore size={25} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Business Profile</h1>
                    <p className="text-gray-500 font-medium  text-sm">Help us set up your Essentr storefront.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5.5">

                    <div className="space-y-01">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                        <div className="relative flex items-center ">
                            <FaUserCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border border-transparent focus:border-amber-400 focus:bg-white rounded-lg outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-01">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store / Business Name</label>
                        <div className="relative">
                            <FaUserEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="e.g. Fresh Mart Organics"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-amber-400 text-sm focus:bg-white rounded-lg outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Mobile</label>
                            <div className="relative">
                                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                                <input
                                    name="primaryMobile"
                                    maxLength={10}
                                    value={user.mobile}
                                    readOnly
                                    placeholder="Primary No."
                                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-transparent focus:border-amber-400 focus:bg-white rounded-lg outline-none transition-all font-bold text-gray-800"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secondary Mobile (Optional)</label>
                            <div className="relative">
                                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                                <input
                                    name="secondaryMobile"
                                    maxLength={10}
                                    value={formData.secondaryMobile}
                                    onChange={handleChange}
                                    placeholder="Backup No."
                                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-transparent focus:border-amber-400 focus:bg-white rounded-lg outline-none transition-all font-bold text-gray-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Address</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-300" />
                            <textarea
                                name="address"
                                rows="2"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Full store address, floor, Landmark..."
                                className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border border-transparent focus:border-amber-400 focus:bg-white rounded-lg outline-none transition-all font-bold text-gray-800 resize-none"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={isFormValid ? { scale: 1.02 } : {}}
                        whileTap={isFormValid ? { scale: 0.98 } : {}}
                        disabled={!isFormValid}
                        className={`
              w-full py-2.5 rounded-lg font-black text-md flex items-center justify-center gap-3 transition-all
              ${isFormValid
                                ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200 cursor-pointer'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
                    >
                        {loading ? (
                            <TbLoaderQuarter className="animate-spin text-xl" />
                        ) : (
                            <div className='flex items-center justify-center  gap-2'>
                                <h1>Launch My Store</h1>
                                <FaArrowRight />
                            </div>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

export default VendorSetup