'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { FaWallet, FaCoins, FaCreditCard, FaCheckCircle, FaArrowLeft, FaShoppingBag } from 'react-icons/fa'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet'
import axios from 'axios'
import { TbLoaderQuarter } from 'react-icons/tb';
import { IoMdLocate } from "react-icons/io";
import SuccessModal from '@/Components/Success'
import { Slide } from 'react-toastify';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'

const Draggblemarker = ({ position, setPosition, Leaflet }) => {

  const map = useMap()

  useEffect(() => {
    map.setView(position, 15, { animate: true })

  }, [position, map])

  if (!Leaflet) return null;

  return (

    <Leaflet.Marker
      position={[position.lat, position.lng]}
      icon={Leaflet.markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const mark = e.target
          const { lat, lng } = mark.getLatLng()
          setPosition({ lat, lng })
        }
      }}>

    </Leaflet.Marker>
  )
}

const CheckoutPage = () => {

  const total = useSelector((state) => state.cart.Total);
  const items = useSelector((state) => state.cart.cartItems);
  const data = useSelector((state) => state.user.userData);

  const isEmpty = items.length === 0;

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    state: '',
  });

  const [position, setPosition] = useState(null);
  const [Leaflet, setLeaflet] = useState(null);
  const [error, setError] = useState(null);
  const [search, setsearch] = useState("")
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const [step, setStep] = useState(1);
  const [changeOption, setChangeOption] = useState('hasChange');                                // 'hasChange' or 'needChange'
  const [roundUpTo, setRoundUpTo] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const nextRoundFigure = Math.ceil(total / 100) * 100;                                        // e.g., 455 -> 500
  const changeToReturn = (roundUpTo == 0 ? 0 : roundUpTo - total);

  useEffect(() => {

    const loadLeaflet = async () => {
      const L = await import('leaflet');
      const ReactLeaflet = await import('react-leaflet');

      const markerIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/9131/9131546.png',
        iconSize: [30, 35],
        iconAnchor: [15, 35],
      });

      setLeaflet({ ...ReactLeaflet, L, markerIcon });
    };

    loadLeaflet();

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition({ lat: latitude, lng: longitude });
    };

    const handleError = (err) => {

      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("User denied the request for Geolocation.");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case err.TIMEOUT:
          setError("The request to get user location timed out.");
          break;
        default:
          setError("An unknown error occurred.");
          break;
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });

  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpay = async () => {
    setLoading(true);

    if (!formData.name || !formData.mobile) {
      alert("Please fill in your Name and Mobile Number first.");
      setStep(1);
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    try {

      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

          amount: total,
          userId: data?._id,
          items: items.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
            unit: item.unit
          })),
          shippingAddress: {
            name: formData.name,
            mobile: formData.mobile,
            pincode: formData.pincode,
            state: formData.state,
            address: formData.address,
            latitude: parseFloat(position.lat),
            longitude: parseFloat(position.lng)
          },
          totalamount: total,
          paymentMethod: "razorpay"

        }),
      });

      const order = await response.json();

      if (!response.ok) throw new Error(order.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Essentr.",
        description: "From store to Door",
        order_id: order.id,

        handler: async function (response) {
          const verification = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await verification.json();

          if (result.success) {
            setPaymentId(response.razorpay_payment_id);
            setIsSuccess(true);

          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("User cancelled the payment modal.");

            toast.error("Payment cancelled", {
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
        },

        prefill: {
          name: formData.name,
          contact: formData.mobile,
        },
        theme: {
          color: "#10b981",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false)

    } catch (err) {

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

      console.log(err.message);
      setLoading(false);

    }
  }

  const handlesubmit = async (e) => {

    if (isEmpty) return;

    setLoading(true);
    e.preventDefault();

    const groupedItems = items.reduce((acc, item) => {
      const vId = item.vendor._id || item.vendor;
      if (!acc[vId]) acc[vId] = [];
      acc[vId].push({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        unit: item.unit,
        unit1: item.unit1,
        vendor: vId
      });
      return acc;
    }, {});

    try {

      const response = await fetch('/api/auth/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          userId: data?._id,
          items: groupedItems,
          shippingAddress: {
            name: formData.name,
            mobile: formData.mobile,
            pincode: formData.pincode,
            state: formData.state,
            address: formData.address,
            latitude: parseFloat(position.lat),
            longitude: parseFloat(position.lng)
          },
          totalamount: total,
          paymentMethod,
          changeOption: changeOption,
          change: {
            customerGiveamt: roundUpTo || total,
            deliveryReturnamt: changeToReturn || 0
          },
          isPaid: false,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPaymentId(result.masterOrderId);
        setIsSuccess(true);

        setLoading(false);

      } else {
        console.error("Order failed on server:", result.message);
        toast.error(result.message, {
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

    } catch (err) {
      console.log(err);

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

      setLoading(false)
    }
  }

  const handlesearch = async (e) => {

    if (!search) return;

    e.preventDefault()
    setLoading(true);

    try {

      const res = await fetch(`/api/map?q=${encodeURIComponent(search)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const location = data[0];

        const newPos = {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon)
        };

        setPosition(newPos);

        setFormData(prev => ({
          ...prev,
          address: location.display_name
        }));

        setLoading(false);
      } else {
        alert("Location not found. Try being more specific ");
        setLoading(false);
      }

    } catch (error) {
      console.error("Geosearch error:", error);
      setLoading(false);
    }
  }


  const currentposition = (e) => {

    e.preventDefault();

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    try {

      const handleSuccess = (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
      };

      navigator.geolocation.getCurrentPosition(handleSuccess)
    } catch (err) {
      console.log(err);

    }
  }

  const fetchaddress = async (lat, lng) => {

    try {

      const res = await axios.get(`/api/map?lat=${lat}&lon=${lng}`);

      if (res.data && res.data.display_name) {
        const fullAddress = res.data.display_name;

        setFormData(prev => ({
          ...prev,
          address: fullAddress,
          state: res.data.address.city || res.data.address.state || '',
          pincode: res.data.address.postcode || ''
        }))
      }

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {

    if (position?.lat && position?.lng) {
      fetchaddress(position.lat, position.lng);
    }

  }, [position])

  useEffect(() => {

    if (isEmpty || !data?._id) {
      router.push("/")
    }

  }, [isEmpty, data, router]);

  const isformvalid = formData.name && formData.mobile && formData.address && formData.pincode && formData.state;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-15 pb-20 px-6">

      <div className="text-xs font-medium text-center">
        {error ? (
          <span className="text-red-500">📍 {error}</span>
        ) : null}
      </div>

      {!isEmpty && (
        <div className="max-w-4xl mx-auto">

          {step === 1 &&

            <Link href={"/user/cart"}>
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-widest mb-16"
              >
                <FaArrowLeft size={10} /> Back to cart
              </motion.button>

            </Link>
          }
          {step === 2 &&
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setStep(1)}
              className="flex items-center gap-2 cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-widest mb-16"
            >
              <FaArrowLeft size={10} /> Back
            </motion.button>

          }
          {step === 3 &&

            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-widest mb-16"
            >
              <FaArrowLeft size={10} /> Back
            </motion.button>

          }

          <div className="flex justify-between mb-9 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10" />
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= s ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                {step > s ? <FaCheckCircle /> : s}
              </div>
            ))}
          </div>


          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-black tracking-tighter">Delivery <span className="text-emerald-500 italic">address</span></h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <form className="space-y-4">

                    <input
                      type="text"
                      placeholder="Name"
                      name='name'
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border text-sm border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-all" />
                    <input type="text"
                      placeholder="Mobile No."
                      name='mobile'
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border text-sm border-white/10 p-4 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-all" />

                    <input type="text"
                      placeholder="Street no. / Flat / house no."
                      name='address'
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border text-sm border-white/10 px-4 py-3 rounded-lg focus:border-emerald-500 outline-none transition-all" />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Pincode"
                        required
                        name='pincode'
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full bg-zinc-900 border text-sm border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-all" />
                      <input
                        type="text"
                        placeholder="State"
                        required
                        name='state'
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-zinc-900 text-sm border border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-all" />
                    </div>

                    <div className='flex gap-3 mt-10'>
                      <input type="text"
                        placeholder='search city or area...'
                        value={search}
                        required
                        onChange={(e) => setsearch(e.target.value)}
                        className='flex-1 border bg-zinc-900 border-white/10 rounded-lg text-sm  focus:border-emerald-500 p-3 outline-none transition-all' />
                      <button
                        onClick={handlesearch}
                        className='bg-green-600 text-white cursor-pointer px-6 rounded-lg font-medium hover:bg-green-700 transition-all'>

                        {loading ? (
                          <TbLoaderQuarter className='animate-spin text-2xl' />
                        ) : (
                          <p> Search </p>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="h-80  rounded-lg border border-white/10 relative overflow-hidden shadow-inner group">
                    {(Leaflet && position) ? (
                      <>
                        <Leaflet.MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={true} className='h-full w-full'>

                          <Leaflet.TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />

                          <Draggblemarker
                            position={position}
                            setPosition={setPosition}
                            Leaflet={Leaflet}
                          />

                        </Leaflet.MapContainer>
                        <button
                          onClick={currentposition}
                          className='absolute bottom-3 right-3 z-1000 cursor-pointer bg-green-600 p-2 rounded-full shadow-lg hover:bg-green-500 transition-colors '
                        >
                          <IoMdLocate size={24} className="text-white" />

                        </button>

                      </>

                    ) : (
                      <div className="flex items-center justify-center h-full">
                        Detecting your location...
                      </div>
                    )}
                  </div>
                </div>

                {isformvalid ? (
                  <button onClick={() => setStep(2)} className="w-full py-3 cursor-pointer bg-white text-black font-black rounded-lg hover:bg-emerald-500 transition-colors mt-2">
                    Continue to Payment Preferences
                  </button>
                ) : (
                  <button className="w-full py-3 bg-white cursor-not-allowed text-black font-black rounded-lg transition-colors mt-2 ">
                    Continue to Payment Preferences
                  </button>
                )
                }
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter">Select your<span className="text-emerald-500 italic"> Preferences.</span></h2>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Total Amount Payable: ₹{total}</p>
                </div>

                <div className="space-y-4">

                  <button
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`w-full px-6 py-4 rounded-lg border-2 cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'razorpay' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-zinc-900'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center"><FaCreditCard /></div>
                      <div className="text-left">
                        <h4 className="font-black">Online Payment</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">Razorpay • UPI • Cards</p>
                      </div>
                    </div>
                    {paymentMethod === 'razorpay' && <FaCheckCircle className="text-emerald-500" />}
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full  px-6 py-4 rounded-lg cursor-pointer border-2 flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-zinc-900'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center"><FaWallet /></div>
                      <div className="text-left">
                        <h4 className="font-black">Cash on Delivery</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">Pay at the doorstep</p>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <FaCheckCircle className="text-emerald-500" />}
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (paymentMethod === 'razorpay') {
                      handleRazorpay();
                    } else {
                      setStep(3);
                    }
                  }}
                  className="w-full py-3 cursor-pointer bg-emerald-500 text-black font-black text-xl rounded-lg shadow-2xl shadow-emerald-500/20"
                >
                  {paymentMethod === "cod" ? `Final step`
                    : loading ?
                      <div className='flex items-center justify-center'>
                        <TbLoaderQuarter className='animate-spin text-2xl ' />
                      </div>
                      : (
                        `Place order`
                      )
                  }

                </button>
              </motion.div>
            )}

            {step === 3 && (

              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-black tracking-tighter">Smooth <span className="text-emerald-500 italic">Deliveries.</span></h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Help our partner carry the right change for you.</p>

                <div className="grid md:grid-cols-2 gap-6">

                  <div
                    onClick={() => setChangeOption('hasChange')}
                    className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${changeOption === 'hasChange' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-zinc-900/50 hover:border-white/20'}`}
                  >
                    <FaCheckCircle className={`mb-4 ${changeOption === 'hasChange' ? 'text-emerald-500' : 'text-zinc-800'}`} size={30} />
                    <h3 className="text-xl font-black">I have exact change</h3>
                    <p className="text-zinc-500 text-sm mt-1 font-medium leading-relaxed">I'll pay the exact amount of ₹{total} at the door.</p>
                  </div>

                  <div
                    onClick={() => { setChangeOption('needChange'); setRoundUpTo(nextRoundFigure); }}
                    className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${changeOption === 'needChange' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-zinc-900/50 hover:border-white/20'}`}
                  >
                    <FaCoins className={`mb-4 ${changeOption === 'needChange' ? 'text-emerald-500' : 'text-zinc-800'}`} size={30} />
                    <h3 className="text-xl font-black">I need change</h3>
                    <p className="text-zinc-500 text-sm mt-1 font-medium leading-relaxed">I don't have exact change. I will pay with a larger note.</p>
                  </div>
                </div>

                {changeOption === 'needChange' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 p-8 rounded-xl border border-emerald-500/30">
                    <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Select the note you will pay with:</p>
                    <div className="flex gap-4 mb-6">
                      {[...new Set([nextRoundFigure, nextRoundFigure + 100, 500, 2000])].filter(val => val >= total).map(val => (
                        <button
                          key={val}
                          onClick={() => setRoundUpTo(val)}
                          className={`px-6 py-3 rounded-lg cursor-pointer font-black transition-all ${roundUpTo === val ? 'bg-emerald-500 text-black' : 'bg-black text-zinc-500 border border-white/5'}`}
                        >
                          ₹{val}
                        </button>
                      ))}
                    </div>
                    <div className="bg-black/50 px-6 py-3 rounded-lg w-102 flex  justify-between items-center">
                      <span className="text-zinc-500 font-bold text-xs uppercase">Partner will carry change:</span>
                      <span className="text-2xl font-black text-emerald-400">₹{changeToReturn}</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <button onClick={handlesubmit} className="flex-2 py-3 bg-emerald-500 cursor-pointer text-black font-black rounded-lg">
                    {loading ? (
                      <div className='flex items-center justify-center'>
                        <TbLoaderQuarter className='animate-spin text-2xl ' />
                      </div>
                    ) : (
                      changeOption === 'needChange' ? `Place order with return ${changeToReturn}` : `Place order`
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {isEmpty && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center  my-60 mx-50 ">
          <FaShoppingBag className="mx-auto text-zinc-800 mb-4" size={50} />
          <h2 className="text-2xl font-bold text-zinc-500">Your bag is empty</h2>

        </motion.div>
      )}

      <AnimatePresence >
        {isSuccess && <SuccessModal orderId={paymentId} />}
      </AnimatePresence>
    </div >
  )
}

export default CheckoutPage