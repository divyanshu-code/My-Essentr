async function Emiteventhandler( event , data, target = null){
    
    try {
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify` , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({ event , data , target}),
        });

        return res ;

    } catch (error) {
        console.log(error);
        console.warn("Socket server unreachable, skipping emit:", err.message);
    }
}

export default Emiteventhandler;