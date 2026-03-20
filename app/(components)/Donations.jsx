"use client";
import {useState } from "react";
export default function Donations({artistId,artistName}){
    const[amount,setAmount]=useState("");
    const [status,setStatus]=useState("");
    const handleDonate =async(e)=>{
        if (e) e.preventDefault();
        const res=await fetch("/api/donations",{
            method:"POST",
            body: JSON.stringify({
                artist_id: artistId,
                user_id: 1, 
                amount: parseFloat(amount)
            })

        });
        if (res.ok) {
            setStatus("Success! Thank you for supporting " + artistName);
            setAmount("");
        } else {
            setStatus("Transaction failed. Please try again.");
        }
    }
    return (
        <div className="text-white px-30 tracking-wider">
        <h2 className="text-5xl font-serif pb-2">Support {artistName}</h2>
        <p className="text-2xl font-serif pb-2">Every contribution helps the artists keep creating</p>
        <div>
            {[50,100,500,1000].map((item)=>(
                <button
                key={item}
                onClick={() => setAmount(item)
                  
                }
                        className={`flex-1 p-3 rounded-xl border transition-all ml-2 mr-2 ${
                            amount == item ? 'bg-amber-400 border-amber-400 text-black font-bold' : 'border-gray-700 hover:border-amber-400'
                        }`}
                >
                    ₹{item}

                </button>
            ))}
            <form onSubmit={handleDonate} className="space-y-4 pb-20">
                <div className="relative border border-amber-50 rounded-2xl mt-4">
                    <span className="absolute left-4 top-3 text-gray-500">₹</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        className="w-full bg-transparent border-none p-3 pl-8 rounded-xl text-lg outline-none transition-colors"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={!amount}
                    className="w-full cursor-pointer bg-amber-50 text-black py-4 rounded-xl font-bold text-lg hover:bg-amber-200 transition-colors "
                >
                    Donate Now
                </button>
            </form>

            {status && <p className="mt-4 text-center text-amber-400 animate-pulse">{status}</p>}
        </div>
        </div>
    )
}