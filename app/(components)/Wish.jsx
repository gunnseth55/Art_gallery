"use client";
export default function Wishlist({artworkId})
{
const handleWishlist=async()=>{
  try{
    
    await fetch("/api/wishlist",{
     method: "POST",
     body:JSON.stringify({
      user_id:1,
      artwork_id:artworkId,
     }),
    });
    alert ("Added to wishlist");
  } catch (error){
    console.error("Error")
  }
};
   return (
    <button onClick={handleWishlist}
    className="text-2xl z-50 hover:scale-110 transition-transform"
    >
      ❤️
    </button>
   );
}
