async function Emiteventhandler( event , data, target = null){
    
    try {
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify` , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({ event , data , target}),
        });

    } catch (error) {
        console.log(error);
    }
}

export default Emiteventhandler;