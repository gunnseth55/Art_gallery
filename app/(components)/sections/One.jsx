"use client";
import Image from "next/image";
 export default function One(){
return(
<>
<div className="relative h-screen w-full overflow-hidden">
   <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/assets/videos/one.mp4" type="video/mp4" />
      </video>
       <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex items-center justify-center h-full text-white text-7xl font-semibold">
       Art Gallery
      </div>
</div>
 
</>
)

 }