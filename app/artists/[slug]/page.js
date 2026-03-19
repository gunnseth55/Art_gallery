import Image from "next/image";

export default async function ArtistProfile({ params }) {
    const {slug}= await params;
    const res=await fetch (`http://localhost:3000/api/artists`,{
        cache:"no-store",
    });
    const allArtists=await res.json();
    const artist=allArtists.find((a)=>a.slug===slug);

  if (!artist) {
    return (
    <div className="p-20 text-center">Artist not found.</div>
    )
  }

  const artres=await fetch (`http://localhost:3000/api/artworks?artist_id=${artist.artist_id}`,
    {cache: "no-store"}
  );
  const artworks=await artres.json();

  return (
    <div className="bg-black">
       <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/assets/videos/bb.mp4" type="video/mp4" />
      </video>
      <section className=" h-[50vh] relative overflow-hidden ">
        
        <h1 className="px-6 text-9xl pb-2 text-amber-50 font-serif tracking-widest text-center whitespace-nowrap absolute bottom-0 w-full">{artist.name}</h1>
      </section>

      <section className="pb-20 relative">
        <div className="flex justify-center pt-8 ">
            <div className="grid grid-cols-5 gap-4 items-start rounded-2xl bg-amber-50/10 max-w-5xl w-full">
                           <div className="col-span-1">
                              <Image
                                        src={artist.profile_image}
                                        alt={artist.name}
                                        width={200}
                                        height={200}
                                        className="object-cover w-full h-auto"
                />
                           </div>
                <div className=" text-gray-50 col-span-4 pt-6">
                    <p className="text-5xl font-serif font-bold">Nationality: {artist.country}</p>
                    <p  className="text-2xl pt-6">{artist.biography}</p>
                </div>
            </div>
        </div>
      </section>

      <section className="px-20 pb-20 relative">
        
        <div className="bg-amber-50/10 p-10 rounded-xl">
          <div className="">
               {artworks.map((item)=>(
          <div key={item.artwork_id }
          className="bg-black rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-1000 p-4"
          >
                  <div className="grid grid-cols-2 gap-6 py-8 px-8 ">
                    <div className="relative w-full h-96">
              <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover rounded-2xl"
            />
            </div>
            <div className="text-white px-10 py-6">
               <p className="text-5xl font-semibold font-serif">{item.title}</p>
               <p className="pt-6 test-xs ">CREATED AT : {item.created_at}</p>
               <p className="text-xl ">{item.description}</p>
               <p className="text-4xl ">COST : ₹{item.price}</p>
              <div className="flex justify-center items-center">
                <button className="cursor-pointer  bg-gray-700 p-4 rounded-2xl hover:text-gray-700 hover:bg-amber-50 transition-colors">BUY NOW</button>
                </div>
            </div>
           
                    </div>
          </div>
        ))}
          </div>
        </div>
      </section>
    </div>
  );
}