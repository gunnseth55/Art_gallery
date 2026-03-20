"use client"
import Link from"next/link";
import { useState, useEffect } from "react";

export default function Header(){
    const [artistId, setArtistId] = useState(null);
    const [viewerId, setViewerId] = useState(null);
    const [viewerName, setViewerName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const aId = localStorage.getItem("artist_id");
        const vId = localStorage.getItem("viewer_id");
        const vName = localStorage.getItem("viewer_name");
        setArtistId(aId);
        setViewerId(vId);
        setViewerName(vName);
        setIsAdmin(localStorage.getItem("is_admin") === "true");
        setMounted(true);
    }, []);

    const handleViewerLogout = () => {
        localStorage.removeItem("viewer_id");
        localStorage.removeItem("viewer_name");
        localStorage.removeItem("is_admin");
        window.location.href = "/";
    };

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
           
           <div className="ml-auto text-xl text-white flex items-center gap-8">
             {mounted && (
               <>
                 {viewerId ? (
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <a href="/admin" className="text-red-400/80 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-bold border border-red-500/30 px-3 py-1 rounded-full">
                                Admin Panel
                            </a>
                        )}
                        <span className="text-gray-400 text-sm tracking-widest uppercase">Hi, {viewerName}</span>
                        <button onClick={handleViewerLogout} className="text-red-500/80 hover:text-red-400 transition-colors text-xs uppercase tracking-widest">
                            [Logout]
                        </button>
                    </div>
                 ) : (
                    <a href="/login" className="text-amber-50 hover:text-white transition-colors text-sm uppercase tracking-widest">
                        Sign In
                    </a>
                 )}
                 
                 {artistId ? (
                    <a href="/dashboard" className="text-amber-50 border border-amber-50 px-4 py-2 rounded-xl hover:bg-amber-50 hover:text-black transition-colors font-serif text-sm uppercase tracking-widest leading-none block">
                        My Studio
                    </a>
                 ) : (
                    <a href="/auth" className="text-amber-50 hover:text-white transition-colors text-sm uppercase tracking-widest">
                        Artist Portal
                    </a>
                 )}
               </>
             )}
           </div>
       
           </div>
        </div>
        </>
    )
}