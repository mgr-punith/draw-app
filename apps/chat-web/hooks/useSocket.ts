import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";


export function useSocket(){
    const [loading, setLoading ] = useState(true);
    const [socket , setSocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NTExY2ZhOS1mNjJjLTRmMTktODgyNC0yMjVmYmUzZjNiZWEiLCJpYXQiOjE3NDAyNDgwNDV9._CGWR4u4EVamYQbEGenOSSTSVSseTNN5R9T5-oLh39Y`);
        ws.onopen = ()=>{
            setLoading(false);
            setSocket(ws)
        }
    }, [])

    return{
        loading,
        socket
    }
}