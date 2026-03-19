"use client";
import {useEffect,useState} from "react";
import Image from "next/image";
export default  function World(){
  const [cat,setCat]=useState([]);
  useEffect(()=>{
    async function fetchdata() {
      const res=await fetch (`http://localhost:3000/api/categories`,{
        cache:"no-store",
    });
    const data=await res.json();
    setCat(data);
    }
    fetchdata();
  },[]);
  const [show,setShow]=useState(null);

  return(
    <div className="bg-gradient-to-r from-gray-600 to-black h-full">
        <div className="grid grid-cols-3 pt-40 px-40 pb-20 shadow-xl">
          {cat.map((item)=>(
            <div key={item.category_id}  className="">
            
            {show!==item.category_id && 
              <div className="flex flex-col items-center text-center">
              <h1 className=" text-white font-serif text-2xl pb-2 font-semibold ">{item.name}</h1>
              <div className=" relative w-64 h-86  shadow-amber-50 shadow-md">
                     <Image
                  src={item.image_url_1}
                 fill
                  alt={item.name}
                  />
              </div>
              <button onClick={()=>setShow(item.category_id)} className="font-serif mt-2 mb-2 cursor-pointer hover:bg-amber-50 hover:text-black p-2 rounded-2xl bg-black text-gray-200 transition-colors">Show More</button>
            </div>
          } 

          <div className={`fixed top-0 right-0 h-full w-1/2 bg-white/40 shadow-2xl transform transition-transform duration-500
            overflow-y-auto
            z-50 ${show===item.category_id ? "translate-x-0":"translate-x-full"}`}>
              
            <div className="p-6">
             <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 ml-4 flex justify-between items-center z-10">
              <h1 className="text-2xl font-bold font-serif">{item.name}</h1>
              <button
                onClick={() => setShow(null)}
                className="text-2xl font-bold"
              >
                ✖
              </button>
              
            </div>
            <p className="px-4 text-2xl font-semibold">{item.description}</p>
             {[item.image_url_1, item.image_url_2, item.image_url_3].map((img, i) => (
                <div key={i} className="relative w-full h-screen ">
                  <Image
                    src={img}
                    fill
                    className="object-cover p-4"
                    alt={item.name}
                  />
                </div>
              ))}
            </div>
          </div>
            </div>
          ))}
        </div>
    </div>
  )
}