import { getSocket } from '@/Config/socket'
import { AnimatePresence , motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const Chatassistant = ({ orderId, deliverboyId }) => {

  const [message, setmessage] = useState("")

  const [fetchMessages, setfetchMessages] = useState([])
  const bottomRef = useRef(null)


  useEffect(() => {

    const socket = getSocket();

    socket.emit("joinChatRoom", orderId);
  }, [orderId])

  useEffect(() => {

    const getallmessages = async () => {

      try {

        const result = await fetch('/api/chat/getallmessages', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ roomId: orderId })
        })

        const response = await result.json();

        setfetchMessages(response.messages ?? []);

      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    }

    getallmessages();

  }, [orderId])

  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (data) => {
      if (data.roomId === orderId) {
        setfetchMessages((prev) => [...prev, data]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fetchMessages])

  const handleSendMessage = () => {
    if (message.trim()) {

      const socket = getSocket();

      socket.emit("sendMessage", {
        roomId: orderId,
        senderId: deliverboyId,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setmessage("");
    }

  };

  const handlemessage = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  useEffect(()=>{
    
  })

  return (
    <div className='px-8 py-5 flex flex-col h-full '>

      <div className='flex-1 overflow-y-auto p-2 space-y-2'>
        <AnimatePresence>
          {fetchMessages?.map((msg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              key={index} className={`flex ${msg.senderId === deliverboyId ? 'justify-end' : 'justify-start'} `}>
              <div className={`max-w-[80%] px-4 py-2 rounded-xl ${msg.senderId === deliverboyId ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                <p className="text-sm font-medium ">{msg.text}</p>
                <span className={`text-xs text-gray-600 mt-1 block ${msg.senderId === deliverboyId ? 'text-right' : 'text-left'}`}>{msg.time}</span>
              </div>
            </motion.div>
          ))}

          <div ref={bottomRef} />
        </AnimatePresence>
      </div>

      <div className='flex items-center justify-center gap-5 my-2'>
        <input type="text" value={message} onChange={(e) => setmessage(e.target.value)} className='flex-1 bg-transparent border w-full rounded-lg text-sm p-2 border-gray-400 focus:outline-none ' placeholder="Type a message..." onKeyUp={handlemessage} />
        <button className='rounded-full cursor-pointer bg-neutral-200 hover:bg-neutral-300  p-2.5'> <ArrowRight size={19} onClick={handleSendMessage} /> </button>
      </div>
    </div>


  )
}

export default Chatassistant