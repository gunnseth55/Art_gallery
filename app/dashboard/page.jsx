"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [artistId, setArtistId] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState({ total: 0, history: [] });

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artworkFile, setArtworkFile] = useState(null);
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedArtistId = localStorage.getItem("artist_id");
    const storedArtistName = localStorage.getItem("artist_name");

    if (!storedArtistId) {
      router.push("/auth");
    } else {
      setArtistId(storedArtistId);
      setArtistName(storedArtistName);
      fetchArtworks(storedArtistId);
      fetchCategories();
      fetchDonations(storedArtistId);
    }
  }, [router]);

  const fetchArtworks = async (id) => {
    const res = await fetch(`/api/artworks?artist_id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setArtworks(data);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  const fetchDonations = async (id) => {
    const res = await fetch(`/api/donations/history?artist_id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setDonations(data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("artist_id");
    localStorage.removeItem("artist_name");
    router.push("/auth");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      if (!artworkFile) throw new Error("Please select an image file to upload");

      // 1. Upload the artwork image
      const formData = new FormData();
      formData.append("file", artworkFile);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");

      // 2. Submit artwork details
      const res = await fetch("/api/artworks/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist_id: artistId,
          title,
          description,
          image_url: uploadData.url,
          price: parseFloat(price),
          category_id: parseInt(categoryId)
        }),
      });

      if (!res.ok) {
        throw new Error("Artwork submission failed");
      }

      alert("Artwork successfully uploaded!");
      setTitle("");
      setDescription("");
      setArtworkFile(null);
      setPrice("");
      setCategoryId("");
      
      // Refresh list
      fetchArtworks(artistId);

    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!artistId) return <div className="min-h-screen bg-black text-white p-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-amber-50 pt-32 px-10 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Left Side: Upload Form */}
        <div className="w-full md:w-1/3">
          <div className="bg-amber-50/10 border border-amber-50/20 p-8 rounded-2xl sticky top-32">
            <h2 className="text-3xl font-serif mb-2">My Studio</h2>
            <p className="text-gray-400 mb-6">Welcome back, {artistName}.</p>
            
            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm mb-8 underline tracking-widest"
            >
              LOGOUT
            </button>

            <h3 className="text-xl font-serif mb-6 border-b border-amber-50/20 pb-2">Upload New Artwork</h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 tracking-wider text-gray-300">TITLE</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full bg-black border border-gray-600 focus:border-amber-50 rounded-md p-2 outline-none" placeholder="Mona Lisa" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 tracking-wider text-gray-300">UPLOAD IMAGE</label>
                <input 
                  required 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setArtworkFile(e.target.files[0])} 
                  className="w-full bg-black border border-gray-600 focus:border-amber-50 rounded-md p-2 outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-black hover:file:bg-amber-100" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 tracking-wider text-gray-300">PRICE (₹)</label>
                  <input required value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" className="w-full bg-black border border-gray-600 focus:border-amber-50 rounded-md p-2 outline-none" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 tracking-wider text-gray-300">CATEGORY</label>
                  <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-black border border-gray-600 focus:border-amber-50 rounded-md p-2 outline-none">
                    <option value="" disabled>Select...</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 tracking-wider text-gray-300">DESCRIPTION</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black border border-gray-600 focus:border-amber-50 rounded-md p-2 outline-none" placeholder="Describe the piece..." />
              </div>

              <button type="submit" disabled={isUploading} className="w-full py-3 bg-amber-50 text-black font-serif font-bold tracking-widest hover:bg-white transition-colors rounded-lg mt-4 disabled:opacity-50">
                {isUploading ? "UPLOADING..." : "PUBLISH ARTWORK"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: My Artworks & Donations */}
        <div className="w-full md:w-2/3">
          
          <div className="mb-12 border border-amber-50/20 bg-amber-50/5 p-8 rounded-2xl">
            <h2 className="text-3xl font-serif mb-2">Total Support Received</h2>
            <p className="text-5xl font-bold text-amber-400 mb-6">₹{donations.total}</p>
            {donations.history.length > 0 ? (
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {donations.history.map(d => (
                     <div key={d.donation_id} className="flex justify-between items-center bg-black p-4 rounded-xl border border-gray-800 hover:border-amber-50/30 transition-colors">
                        <div>
                           <p className="font-bold text-lg">{d.user_name}</p>
                           <p className="text-xs text-gray-400">{new Date(d.donated_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-2xl font-bold text-amber-50">₹{d.amount}</p>
                     </div>
                  ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">No donations received yet. Keep creating!</p>
            )}
          </div>

          <h2 className="text-5xl font-serif mb-10 border-b border-amber-50/20 pb-4">My Portfolio</h2>
          {artworks.length === 0 ? (
            <p className="text-gray-400 text-xl font-serif">Your portfolio is currently empty. Start uploading your masterpieces!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {artworks.map((item) => (
                <div key={item.artwork_id} className="bg-amber-50/5 border border-amber-50/20 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-500">
                  <div className="relative w-full h-64 bg-black">
                    <Image 
                      src={item.image_url} 
                      alt={item.title} 
                      fill 
                      className="absolute object-contain" 
                      unoptimized={true}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold mb-2 truncate">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center border-t border-amber-50/10 pt-4">
                      <span className="text-xl font-bold">₹{item.price}</span>
                      <span className="text-xs tracking-widest text-gray-500 uppercase px-3 py-1 bg-black rounded-full border border-gray-700">
                        {categories.find(c => c.category_id === item.category_id)?.name || "Art"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
