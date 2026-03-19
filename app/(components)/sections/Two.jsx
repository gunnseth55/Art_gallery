"use client";
import Image from "next/image";
export default function Two(){
    const content=[
  {
    id:1,
    title:"Art1",
    source:"/assets/images/black_cat.jpg",
    w:200,
    h:300

  },
  { id:2,
    title:"Art2",
    source:"/assets/images/two.jpg",
    w:800,
    h:800
},
{ id:3,
    title:"Art3",
    source:"/assets/images/download (2).jpg",
    w:500,
    h:700
},
{ id:4,
    title:"Art4",
    source:"/assets/images/black.jpg",
    w:200,
    h:300
},
];
return(
<>

<div className="z-0 mt-24 ml-48 mb-20">
   <div className="grid grid-cols-2  items-center">
     <div className=" grid grid-cols-3 grid-rows-2 gap-6 w-[600px] h-[540px]">
      <div className="relative col-span-2 row-span-2 overflow-hidden ">
        <Image
              src={content[0].source}
              alt={content[0].title}
           fill
             className="object-cover hover:scale-130 transition duration-500 "
            />
    </div>
   <div className="relative overflow-hidden">
        <Image
              src={content[1].source}
              alt={content[1].title}
           fill
             className="object-cover hover:scale-130 transition duration-500 "
            />
    </div>
    <div className="relative overflow-hidden">
        <Image
              src={content[2].source}
              alt={content[2].title}
           fill
             className="object-cover hover:scale-130 transition duration-500 "
            />
    </div>
    
    </div>
        <Image
                src="/assets/images/artisty-removebg-preview.png"
                alt="image"
                width={500}
                height={400}
                className="object-cover"
              />
   </div>
</div>
 </>

)

 }