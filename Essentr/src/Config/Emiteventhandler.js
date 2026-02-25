async function Emiteventhandler( event , data ){
    
    try {
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify` , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({ event , data }),
        });

    } catch (error) {
        console.log(error);
    }
}

export default Emiteventhandler;