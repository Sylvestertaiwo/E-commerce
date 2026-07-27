import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from './CartContext';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get("reference");
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    const navigate = useNavigate()
    const {refreshCartCount} = useCart()
    const Server_Url = import.meta.env.VITE_SERVER_URL
    
    useEffect(() => {
        const verify = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${Server_Url}/cart/verify/${reference}`);
                if(!res.data.status){
                    setStatus("failed")
                    return setLoading(false)
                }
                setLoading(false)
                setStatus("success")
                refreshCartCount()
            } catch (err) {
                setStatus("failed")
                return setLoading(false)
            }
        };
        verify();
    }, []);

    useEffect(() => {
        if(status === "success"){
            setTimeout(() => {
                navigate("/cart");

            }, 3000);
        }else{
            setTimeout(() => {
                navigate("/cart");
            }, 3000);
        }
    }, [status])
    
    
    let showBox;
    if (loading){
        showBox = <h2>Loading...</h2>
    }else{
        if(status === "success"){
            showBox = <h2>Transaction Successful</h2>
        }else if (status === "failed"){
            showBox = <h2>Transaction Failed</h2>
        }else if (status === "pending"){
            showBox = <h2>Traansaction Pending</h2>
        }
    }
  return (
    <>
    <div style={{display:"flex", justifyContent: "center", alignItems:"center", height: "50dvh"}}>{showBox}</div>
    </>
  )
}

export default Verify