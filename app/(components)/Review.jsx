"use client";
import {useState, useEffect} from "react";
export default function Review({artistId}){
    const [review,setReview]=useState([]);
    const[comment,setComment]=useState("")
    const [rating,setRating]=useState(5)
const fetchReviews=async()=>{
    const res=await fetch(`/api/review?artist_id=${artistId}`);
    if (!res.ok) {
          const errorText = await res.text(); 
    console.error(`Server Error (${res.status}):`, errorText);
    try {
        const errorData = JSON.parse(errorText);
        console.error("Parsed API Error:", errorData);
    } catch (e) {
        console.error("Server sent non-JSON error (likely a 500 crash page)");
    }
    return;
        }
    const data=await res.json();
    setReview(data);
};

useEffect(() => {
    if (artistId) fetchReviews();
}, [artistId]);

const handlesubmit=async(e)=>{
    e.preventDefault();
    const viewer_id = localStorage.getItem("viewer_id");
    if (!viewer_id) {
       alert("Please Sign In to leave a review.");
       return;
    }

    await fetch("/api/review",{
        method: "POST",
        body: JSON.stringify({artist_id: artistId, user_id: parseInt(viewer_id), rating:rating, comment:comment}),

    })
    setComment("")
    fetchReviews()
};

    return(
        <>
            <div className="text-white px-30">
                <h1 className="text-5xl font-serif pb-4">Add your review</h1>
                <form onSubmit={handlesubmit}>
                   
                     <div className="flex justify-center">
                        {[1,2,3,4,5].map((item)=>(
                            <button key={item} type="button" onClick={()=>setRating(item)} className="text-3xl text-amber-300">
                                {item <= rating ?"★" : "☆"}
                            </button>
                        ))}
                     </div>
                     <textarea
                     value={comment}
                     onChange={(e)=> setComment(e.target.value)}
                     placeholder="Write your thoughts about the artist"
                     className="w-full p-3 bg-black border border-gray-700 rounded-md mb-4"
                     />
                     <div className="flex justify-center">
                     <button type="submit" className="bg-amber-50 text-black py-2 px-6 rounded-xl hover:text-red-500">Post Review</button>
                    </div>
                </form>

                <div className="space-y-6 pb-20 pt-8">
                      <h1 className="text-5xl font-serif pb-8">Published Reviews:</h1>
        {review.map((item) => (
          
          <div key={item.review_id} className="">
             
            <div className="border border-amber-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
             
              <span className="font-bold text-xl">{item.user_name}:</span>
              <span className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="text-yellow-500 text-lg">{"★".repeat(item.rating)}</div>
            <p className="mt-2 text-gray-300">Comment : {item.comment}</p>
            </div>
          </div>
        ))}
      </div>
            </div>
        </>
    )
}
