'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaPlus, FaCamera,
  FaTags, FaShapes, FaArrowLeft
} from 'react-icons/fa'
import Link from 'next/link'
import { IoMdCloudUpload } from "react-icons/io";
import { toast, Slide } from 'react-toastify';
import { TbLoaderQuarter } from 'react-icons/tb';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', unit: '', image: '' , unit1 : ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Fruits and Vegetables", "Dairy & Eggs", "Rice, Atta & Grains",
    "Snacks & Biscuits", "Spices & Masalas", "Beverages & Drinks",
    "Household Essentials", "Instant & Packaged Food", "Baby & Pet Care"
  ];

  const units = ['kg', 'L', 'piece', 'pack', 'g', 'ml'];

  const isFormValid = () => {
    const { name, category, price, unit, image , unit1 } = formData;
    return name && category && price && unit && image && unit1;
  }

  const handleimageChange = (e) => {

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFormData({ ...formData, image: file });

    setPreviewImage(URL.createObjectURL(file));
  }

  const handleSubmit = async () => {

    setLoading(true);

    try {

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("unit1" , formData.unit1)

      const response = await fetch('/api/admin/add-grocery', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error: ${data.message}`);
      }

      if (data.success) {
        toast.success('Product added successfully!', {
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
          name: '', category: '', price: '', unit: '', image: '' , unit1: ''
        });

        setPreviewImage(null);

        setLoading(false);

      }

    } catch (err) {
      console.log("Error submitting the form: ", err);
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

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black/80 text-white  flex items-center justify-center">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl h-140 bg-[#121214] p-8 rounded-lg md:p-5 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <Link href="/">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center  gap-2 cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2"
            >
              <FaArrowLeft size={10} /> Back to Dashboard
            </motion.button>
          </Link>
          <h1 className="text-4xl md:text-4xl font-black tracking-tighter">
            New <span className="italic">Essential .</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          <div className="md:col-span-7 space-y-5">
            <div className="bg-white/5 border border-white/5 p-6 rounded hover:border-emerald-500/30 transition-colors group">
              <label className="text-[10px] font-black  uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                <FaTags /> Identity
              </label>
              <input
                placeholder="What is this item called?"
                className="w-full bg-transparent text-sm font-bold outline-none "
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded transition-colors">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                <FaShapes className="text-violet-500" /> Catalog
              </label>
              <select
                className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                value={formData.category}
              >
                <option value="" className="">Choose Category</option>
                {categories.map(c => <option key={c} value={c} className="text-black text-sm">{c}</option>)}
              </select>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-1 gap-6">
            <div className="bg-white/5 border flex gap-5 justify-between items-center  border-white/5 px-6 py-3.5 rounded transition-colors">

              <div className='flex flex-col'>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">
                  <span>Price </span>
                </label>

                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-emerald-400">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    className="w-28 bg-transparent text-2xl font-black outline-none placeholder:text-zinc-700"
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div className='flex flex-col'>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ">
                  <span>Unit </span>
                </label>
                <input
                  type="number"
                  placeholder="00"
                  value={formData.unit}
                  className="w-27 bg-transparent text-2xl font-black outline-none placeholder:text-zinc-700"
                  onChange={(e)=> setFormData({...formData, unit: e.target.value })}
                />
              </div>

              <div className='flex flex-col mb-1 '>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Unit 2</span>
                <select
                  className="bg-transparent text-md mr-5 cursor-pointer font-bold outline-none placeholder:text-zinc-700"
                  onChange={(e) => setFormData({ ...formData, unit1: e.target.value })}
                  value={formData.unit1}
                >
                  <option >unit</option>
                  {units.map(u => <option key={u} value={u} className="text-black text-md ">{u}</option>)}
                </select>
              </div>

            </div>

            <div className=" border border-white/5 p-6 rounded transition-colors group">
              <label htmlFor='image' className="text-[10px] font-black flex gap-5 text-zinc-500 items-center uppercase tracking-[0.2em]  ">
                <div className='flex gap-2 items-center'>
                  <FaCamera /> Upload Image
                </div>

                <IoMdCloudUpload size={25} className="cursor-pointer text-zinc-500" />
              </label>
              <input
                type='file'
                accept='image/*'
                id='image'
                hidden
                onChange={handleimageChange}
              />
              {previewImage && (
                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  <h4 className='mb-1 mt-2' >Image Preview:</h4>
                  <img src={previewImage} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>
              )}
            </div>
          </div>

          <div className=" flex w-screen items-center justify-center">
            {isFormValid() ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="px-5 py-2 text-white cursor-pointer font-black text-lg rounded border"
              >
                {loading ? (
                  <TbLoaderQuarter size={20} className="animate-spin" />
                ) : (
                  <div className='flex  gap-3 items-center  group'>
                    Confirm Listing
                    <div className="rounded-xl group:hover:rotate-90 transition-transform">
                      <FaPlus size={16} />
                    </div>
                  </div>
                )}
              </motion.button>
            ) : (
              null
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AddProduct