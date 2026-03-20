"use client";
import {useState,useEffect} from "react";
import Image from "next/image";
import Wishlist from "../(components)/Wish.jsx";
export default function Vibes(){
    const [data,setData]=useState([]);
    useEffect(()=>{
        fetch("/api/world_arts").then(res => res.json()).then(setData);
    },[]);
    const groupedArt = data.reduce((acc, item) => {
        if (!acc[item.country_name]) acc[item.country_name] = [];
        acc[item.country_name].push(item);
        return acc;
    }, {});
    return (
        <div className="min-h-screen bg-black text-stone-200 p-10 pt-30">
            <h1 className="text-6xl font-serif text-center mb-20 text-amber-50">Global Collections</h1>

            {Object.keys(groupedArt).map((country) => (
                <section key={country} className="mb-24 max-w-7xl mx-auto">
                   
                    <div className="flex items-center gap-6 mb-8">
                        <h2 className="text-4xl font-serif text-amber-500">{country}</h2>
                        
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {groupedArt[country].map((art) => (
                            <div key={art.art_id} className="group relative">
                                <div className="relative overflow-hidden rounded-lg bg-stone-900  w-full h-64">
                                    <Image 
                                        src={art.image_url} 
                                        alt={art.title} 
                                        fill
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-4 z-10 bg-black/60 p-2 rounded-full border border-gray-700">
                                                                      <Wishlist artworkId={art.art_id + 100000} />
                                                                    </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-serif">{art.title}</h3>
                                    <p className="text-xs text-stone-500 uppercase tracking-widest">{art.era}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}