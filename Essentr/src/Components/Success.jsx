'use client'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa'
import confetti from 'canvas-confetti'
import { useRouter } from 'next/navigation'

const SuccessModal = ({ orderId }) => {
    const router = useRouter()

    useEffect(() => {

        const scalar = 3;
        const unicorn = confetti.shapeFromText({ text: '🎉', scalar });
        const pizza = confetti.shapeFromText({ text: '🍕', scalar });
        const box = confetti.shapeFromText({ text: '📦', scalar });
        const heart = confetti.shapeFromText({ text: '💚', scalar });

        const fireConfetti = () => {
            confetti({
                shapes: [unicorn, pizza, box, heart],
                particleCount: 50,
                spread: 80,
                origin: { y: 1 },
                gravity: 0.6,
                ticks: 300,
                scalar: 3,
                zIndex: 10000,
            });
        };

        fireConfetti();
        setTimeout(fireConfetti, 1000);

    }, [router]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}

            className="fixed inset-0 z-9999 bg-[#0A0A0B] flex items-center justify-center p-6"
        >
            <div className="max-w-md w-full text-center">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 blur-[120px] -z-10" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-24 h-24 bg-emerald-500 rounded-4xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 15, -15, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <FaCheckCircle className="text-black text-5xl" />
                    </motion.div>
                </motion.div>

                <h2 className="text-4xl font-black tracking-tighter mb-2">
                    Order <span className="text-emerald-500 italic">Placed!</span>
                </h2>

                <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[9px] mb-10">
                    Order ID: <span className="text-emerald-400">{orderId || 'TXN-7721'}</span>
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-zinc-900/50 border border-white/5 p-8 rounded-xl mb-10 backdrop-blur-sm"
                >
                    <p className="text-zinc-400 font-medium leading-relaxed">
                        Your groceries are being hand-picked with care. You'll receive a tracking link via SMS shortly.
                    </p>
                </motion.div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/')}
                    className="w-full py-3 bg-white cursor-pointer text-black font-black rounded-xl flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-500 transition-all group"
                >
                    <FaShoppingBag size={18} className="group-hover:rotate-20 transition-transform" />
                    Back to Shopping
                </motion.button>

                <p className="mt-5 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                    Thank you for choosing <span className="text-zinc-300">Essentr</span>
                </p>
            </div>
        </motion.div>
    )
}

export default SuccessModal