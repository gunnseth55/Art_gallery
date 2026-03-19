"use client"
import Link from"next/link";
export default function Header(){
    return (
        <>
        <div className="absolute z-10 w-full pt-8">
           <div className="relative flex items-center px-16 py-4">
           
           <h1 className="text-xl text-white"></h1>
          
           <Link href="/">
           <h1 className="absolute text-xl left-1/2 -translate-x-1/2 text-white">Home</h1>
           </Link>
           
         
           <h1 className="ml-auto text-xl text-white"></h1>
       
           </div>
        </div>
        </>
    )
}