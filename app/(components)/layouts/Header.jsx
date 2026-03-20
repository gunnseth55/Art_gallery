"use client"
import Link from"next/link";
import { useState, useEffect } from "react";

export default function Header(){
    const [artistId, setArtistId] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Using useEffect to safely check localStorage on client side
    useEffect(() => {
        setArtistId(localStorage.getItem("artist_id"));
        setMounted(true);
    }, []);

    return (
        <>
        <div className="absolute z-50 w-full pt-8 pointer-events-auto">
           <div className="relative flex items-center px-16 py-4">
           
           <Link href="/wishlist">
            <h1 className="text-xl text-white hover:text-amber-50 transition-colors">Wishlist</h1>
           </Link>
          
           <Link href="/">
            <h1 className="absolute text-xl left-1/2 -translate-x-1/2 text-white font-serif uppercase tracking-widest">Home</h1>
           </Link>
           
           <div className="ml-auto text-xl text-white">
             {mounted && (
               artistId ? (
                  <a href="/dashboard" className="text-amber-50 border border-amber-50 px-4 py-2 rounded-xl hover:bg-amber-50 hover:text-black transition-colors font-serif text-sm uppercase tracking-widest leading-none block">
                      My Studio
                  </a>
               ) : (
                  <a href="/auth" className="text-amber-50 hover:text-white transition-colors text-sm uppercase tracking-widest">
                      Artist Portal
                  </a>
               )
             )}
           </div>
       
           </div>
        </div>
        </>
    )
}