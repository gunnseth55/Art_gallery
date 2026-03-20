"use client";
import Image from "next/image";
import {useState,useEffect, useRef} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay , Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Link from "next/link";


export default function Four(){
    const swiperRef = useRef(null);
    const [artists,setArtists]=useState([]);
    const [swiperInstance, setSwiperInstance] = useState(null);
    useEffect(()=>{
        fetch ("/api/artists")
        .then(res=>res.json())
        .then(data=>setArtists(data))
    },[])
    // const artists=[
    //     {
    //         name:"one",
    //         source:"/assets/images/a1.png",
    //     }, {
    //         name:"two",
    //         source:"/assets/images/a2.png",
    //     }, {
    //         name:"three",
    //         source:"/assets/images/p3.png",
    //     }, {
    //         name:"four",
    //         source:"/assets/images/p4.png",
    //     }, {
    //         name:"five",
    //         source:"/assets/images/a5.png",
    //     }, {
    //         name:"a6",
    //         source:"/assets/images/a6.png",
    //     },
    // ]
    return (
        <>
        <section className="sticky top-0 h-screen flex justify-center items-center">
            <h1 className="text-6xl font-bold border-t-2 border-t-amber-50 border-b-2  border-b-amber-50 p-2">ALL STILLS</h1>
        </section>


        
        <section className="relative h-screen bg-amber-50">
            <div className="flex justify-center items-center ">
                <h1 className="text-black text-6xl mt-30 mb-30 font-semibold border-t-2 border-t-black border-b-2 border-b-black ">ARTISTS WE LOVE</h1>
            </div>
            <div className="relative">
                    {/* <button
                      onClick={() =>  swiperInstance?.slidePrev()}
                      className="absolute left-5 top-1/2 z-10 bg-black text-white px-4 py-2 rounded-full"
                    >
                    ←
                    </button>

                    <button
                      onClick={() => swiperInstance?.slideNext()}
                      className="absolute right-5 top-1/2 z-10 bg-black text-white px-4 py-2 rounded-full"
                    >
                    →
                    </button> */}

                <Swiper
                            ref={swiperRef}
                            key={artists.length}
                            modules={[Autoplay,Navigation]}
                            onSwiper={setSwiperInstance}
                            navigation
                            spaceBetween={16}
                            slidesPerView={2}
                            loop={true}
                            autoplay={{
                              delay: 2000,
                              disableOnInteraction: false,
                            }}
                            speed={800}
                            breakpoints={{
                              480: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                              },
                              640: {
                                slidesPerView: 3.5,
                                spaceBetween: 10,
                              },
                              768: {
                                slidesPerView:5,
                                spaceBetween: 10,
                              },
                              1024: {
                                slidesPerView:5,
                                spaceBetween: 10,
                              },
                              1280: {
                                slidesPerView: 5,
                                spaceBetween: 10,
                              },
                            }}
                            className="w-full "
                          >
                            {artists.map((item)=>(
                                <SwiperSlide key={item.artist_id} >
                                  <Link href={`/artists/${item.slug}`}>
                                   <div className="cursor-pointer h-[300px] overflow-hidden">
                                     <Image
                                        src={item.profile_image}
                                        alt={item.name}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover  hover:scale-105 transition duration-500"
                                      />
                                    </div>
                                  </Link>
                                       <p className="mt-2 text-center text-black font-semibold">{item.name}</p>
                                </SwiperSlide>
                            ))}
                          </Swiper>
           
            </div>
        </section>
        </>
    )
}