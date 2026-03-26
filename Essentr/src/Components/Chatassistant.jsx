import { getSocket } from '@/Config/socket'
import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Chatassistant = ({ orderId, deliverboyId }) => {

  const [message, setmessage] = useState("")

  const [fetchMessages, setfetchMessages] = useState([])

  useEffect(() => {

    const socket = getSocket();

    socket.emit("joinChatRoom", orderId);
  }, [orderId])

  useEffect(() => {

    const getallmessages = async () => {

      try {

        const result =await fetch('/api/chat/getallmessages', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ roomId: orderId })
        })

        const response = await result.json();
        
        setfetchMessages(response.messages);

      } catch (err) {
          console.log(err);
      }
    }

    getallmessages();

  },[])

  const handleSendMessage = () => {
    if (message.trim()) {

      const socket = getSocket();

      socket.emit("sendMessage", {
        roomId: orderId,
        senderId: deliverboyId,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      socket.on("newMessage", (data) => {
        if (data.roomId === orderId) {
          setfetchMessages((prevMessages) => [...prevMessages, data]);
        }
      });
      
      setmessage("");
    }

  };

  const handlemessage = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  return (
    <div className='px-8 py-5 flex flex-col h-full'>

      <div className='fixed   bottom-14 w-115 flex items-center justify-center  gap-5'>
        <input type="text" value={message} onChange={(e) => setmessage(e.target.value)} className='border w-full rounded-lg text-sm p-2 border-gray-400 focus:outline-none ' placeholder="Type a message..." onKeyUp={handlemessage} />
        <button className='rounded-full cursor-pointer bg-neutral-200 hover:bg-neutral-300  p-2.5'> <ArrowRight size={19} onClick={handleSendMessage} /> </button>

      </div>
    </div>


  )
}

export default Chatassistant