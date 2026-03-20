import Wishlist from "../../(components)/Wish.jsx";
import Review from "../../(components)/Review.jsx";
import Donations from "../../(components)/Donations.jsx";
import PurchaseButton from "../../(components)/PurchaseButton.jsx";
import Image from "next/image";
import { db } from "@/lib/db";

export default async function ArtistProfile({ params }) {
  const { slug } = await params;
  
  // Directly query the database from the Server Component for blazing fast, prod-ready data
  const [artists] = await db.query("SELECT * FROM artists WHERE slug = ?", [slug]);
  const artist = artists[0];

  if (!artist) {
    return (
      <div className="p-20 text-center text-white min-h-screen bg-black pt-32 text-2xl font-serif">
        Artist not found.
      </div>
    );
  }

  const [artworks] = await db.query(
      "SELECT * FROM artworks WHERE artist_id = ? ORDER BY created_at DESC", 
      [artist.artist_id]
  );

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
        <h1 className="px-6 text-9xl pb-2 text-amber-50 font-serif tracking-widest text-center whitespace-nowrap absolute bottom-0 w-full">
          {artist.name}
        </h1>
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
                unoptimized={true}
                className="object-cover w-full h-auto"
              />
            </div>
            <div className=" text-gray-50 col-span-4 pt-6">
              <p className="text-5xl font-serif font-bold">Nationality: {artist.country}</p>
              <p className="text-2xl pt-6">{artist.biography}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-20 pb-20 relative">
        <div className="bg-amber-50/10 p-10 rounded-xl">
          <div>
            {artworks.map((item) => (
              <div
                key={item.artwork_id}
                className="bg-black rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition duration-700 p-4 mb-4"
              >
                <div className="grid grid-cols-2 gap-6 py-8 px-8">
                  <div className="relative w-full h-96">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      unoptimized={true}
                      className="absolute object-contain rounded-2xl z-0 bg-black/50"
                    />
                    <div className="absolute bottom-4 right-4 z-10 bg-black/60 p-2 rounded-full border border-gray-700">
                      <Wishlist artworkId={item.artwork_id} />
                    </div>
                  </div>
                  <div className="text-white px-10 py-6">
                    <p className="text-5xl font-semibold font-serif">{item.title}</p>
                    <p className="pt-6 text-xs text-gray-500 tracking-widest uppercase">
                      CREATED AT: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xl mt-4 mb-8 text-gray-300">
                      {item.description || "No description provided."}
                    </p>
                    
                    <div className="mt-auto border-t border-gray-800 pt-8">
                        <p className="text-4xl text-amber-50 font-bold mb-6">₹{item.price}</p>
                        <PurchaseButton artwork={item} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pt-10 border-t border-gray-800">
        <Donations artistId={artist.artist_id} artistName={artist.name} />
      </section>
      <Review artistId={artist.artist_id} />
    </div>
  );
}