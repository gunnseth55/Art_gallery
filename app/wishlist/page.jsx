"use client";
import Image from "next/image";
import {useState , useEffect  } from "react";
export default function WishlistPage(){
    const [data,setData]=useState([]);
    const[loading,setLoading]=useState(true);
    useEffect(()=>{
        fetch("/api/wishlist?user_id=1")
            .then((res)=>res.json())
            .then((json)=>{
                setData(json);
                setLoading(false);
            })
            .catch(err=>console.error("Fetched error",err));
            
    },[]);

    const removeWishlist=async (artwork_id)=>{
        try{
            const res=await fetch("/api/wishlist",{
                method :"DELETE",
                body: JSON.stringify({
                    user_id:1,
                    artwork_id:artwork_id
                })
            })
            if(res.ok){
                setData(data.filter(item=>item.artwork_id!== artwork_id));
            }
        }catch(error){

        }
    }


    if(loading) return <div className="">Loading Wishlist...</div>
    return(
        <div>
           {data.length==0?(
            <>
            <p>Your Wishlist is empty!</p>
            </>
           ):(
            <div className="bg-gradient-to-r from-gray-700 to-pink-200 h-screen">
             <div className="flex justify-center items.center pt-30">
                <h1 className="text-4xl font-serif">My Wishlist</h1>
            </div>
                <div  className="grid grid-cols-3 gap-4 px-20">
                     {data.map((item)=>(
                <div key={item.artwork_id}
                className="p-4 rounded-xl"
                >
                    <h1 className="text-2xl">{item.title}</h1>
                    <div className="relative w-full h-80 shadow-lg">
                        <Image
                                  src={item.image}
                                  alt={item.title}
                                fill
                                  className=" object-cover rounded-2xl z-0"
                                />
                    
                    </div>
                    <button 
                        onClick={() => removeWishlist(item.artwork_id)}
                        className="mt-4 w-full py-2 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-lg transition-colors text-sm"
                    >
                        Remove from Wishlist
                    </button>
                </div>
            ))}
                </div>
            </div>
           )}
        </div>
    )
}