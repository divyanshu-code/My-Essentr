import { ArrowRight } from 'lucide-react'
import React from 'react'

const Chatassistant = ({ orderId, deliverboyId }) => {
  return (
    <div className='px-8 py-5 '>
      
      <div className='fixed   bottom-14 w-110 flex items-center justify-center  gap-5'>
        <input type="text" className='border w-full rounded-lg text-sm p-2 border-gray-400 focus:outline-none ' placeholder="Type a message..." />
        <button className='rounded-full cursor-pointer bg-neutral-200 hover:bg-neutral-300  p-2.5'> <ArrowRight size={19} /> </button>

      </div>
    </div>


  )
}

export default Chatassistant