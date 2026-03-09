import React from 'react'
import { motion as m } from 'framer-motion';
import { 
  Navigation, 
} from 'lucide-react';

const Livemapping = () => {
    return (
        <div className="flex-1 relative bg-blue-50">

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-2xl animate-bounce" />
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full absolute -top-5 -left-5 animate-ping" />
                </div>
                <p className="absolute bottom-40 text-slate-400 font-bold tracking-widest uppercase text-xs">Simulated GPS Map View</p>
            </div>

            {/* <m.div
                initial={{ y: -50 }} animate={{ y: 20 }}
                className="absolute top-0 left-6 right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-slate-100"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Navigation size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Next Turn</p>
                        <p className="text-sm font-bold text-slate-800">200m • Right to Market St.</p>
                    </div>
                </div>
                <button className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-2 rounded-lg">
                    RE-CENTER
                </button>
            </m.div> */}
        </div>

    )
}

export default Livemapping