"use client";
import { FaChevronCircleRight } from "react-icons/fa";
import Image from "next/image";
import {useEffect,useRef} from "react";
import  Link from "next/link";
 export default function World({setMode}){
    const ref=useRef(null);
    useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMode(entry.isIntersecting);
      },
      {
        threshold: 0.4, 
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [setMode]);
    return(
        
        <section ref={ref} className=" px-40">
            <div>
                <h1 className=" text-7xl font-semibold  ">UNCOVER WORLD ARTS</h1>
                <h3 className="tracking-widest text-xl">see the famous art from the world</h3>
            </div>
            <div className="flex justify-center gap-10 mt-8">
               <Image
                   src="/assets/images/greek.jpg"
                   alt="image"
                    width={1000}
                    height={1000}
                   className=" "
                 />
                  <Image
                   src="/assets/images/madhubani.jpg"
                   alt="image"
                    width={1000}
                    height={1000}
                   className=""
                 />
                 
            </div>
         <Link href="/world">
          <div className="flex justify-center items-center mt-4">
            <FaChevronCircleRight className="text-3xl  hover:scale-110 transition duration-500"/>
            </div>
         </Link>
        </section>
        
    )
 }