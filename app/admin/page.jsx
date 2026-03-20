"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(null); // null = loading
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({ users: 0, artists: 0, artworks: 0 });
  const [adminId, setAdminId] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    const viewerId = localStorage.getItem("viewer_id");
    if (!viewerId) { router.push("/login"); return; }
    setAdminId(viewerId);

    // Verify admin role
    fetch("/api/auth/check-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: parseInt(viewerId) }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.isAdmin) { setIsAdmin(false); return; }
        setIsAdmin(true);
        loadData(viewerId);
      });
  }, [router]);

  const loadData = async () => {
    const [uRes, aRes,artistRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/artworks"),
      fetch("/api/artists")
    ]);
    const uData = await uRes.json();
    const aData=await aRes.json()
    const artData=await artistRes.json();
    const formattedArtists = artData.map(artist => ({
      ...artist,
      role: "artist", 
      user_id: artist.artist_id, 
      created_at: artist.created_at || new Date().toISOString()
    }));

    const allPeople = [...uData, ...formattedArtists];
    setUsers(allPeople);
    setArtworks(aData);
    setStats({
      users: uData.length,
      artists: artData.length,
      artworks: aData.length,
    });
  };

  const deleteUser = async (userId) => {
    if (!confirm("Permanently delete this user and all their data?")) return;
    const res = await fetch("/api/admin/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: parseInt(adminId), user_id: userId }),
    });
    const data = await res.json();
    if (res.ok) setUsers(users.filter(u => u.user_id !== userId));
    else alert(data.error);
  };

  const deleteArtwork = async (artworkId) => {
    if (!confirm("Permanently delete this artwork?")) return;
    const res = await fetch("/api/admin/delete-artwork", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: parseInt(adminId), artwork_id: artworkId }),
    });
    const data = await res.json();
    if (res.ok) setArtworks(artworks.filter(a => a.artwork_id !== artworkId));
    else alert(data.error);
  };

  if (isAdmin === null) return <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl font-serif">Verifying access...</div>;

  if (isAdmin === false) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-serif text-red-400">Access Denied</h1>
      <p className="text-gray-400">You do not have admin privileges.</p>
      <Link href="/" className="text-amber-400 underline text-sm">Go Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-zinc-950 to-zinc-700 text-white pt-30 px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-6">
          <h1 className="text-5xl font-serif text-amber-50 mb-1">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Gallery Management Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Users", value: stats.users, color: "text-white" },
            { label: "Artists", value: stats.artists, color: "text-white" },
            { label: "Artworks", value: stats.artworks, color: "text-white" },
          ].map(s => (
            <div key={s.label} className=" border border-white/10  p-6 text-center">
              <p className={`text-5xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-sm mt-2 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {["users", "artworks"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === tab ? "bg-amber-50 text-black" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="bg-white/5 border border-white/10  overflow-hidden">
            <table className="w-full text-sm">
              <thead className=" text-gray-400 uppercase tracking-widest text-xs">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Username</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Joined</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.user_id} className="border-t border-white/5 ">
                    <td className="p-4 text-gray-500">{u.user_id}</td>
                    <td className="p-4 font-medium">{u.name || "—"}</td>
                    <td className="p-4 text-gray-500">@{u.username || "—"}</td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-red-500/20 text-red-400" : u.role === "artist" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => deleteUser(u.user_id)}
                          className="text-red-400 hover:text-red-300 text-xs bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-full transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Artworks Table */}
        {activeTab === "artworks" && (
          <div className="bg-white/5 border border-white/10  overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/10 text-gray-400 uppercase tracking-widest text-xs">
                <tr>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Artist ID</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((a, i) => (
                  <tr key={a.artwork_id} className={`border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                    <td className="p-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black">
                        <Image src={a.image_url} alt={a.title} fill className="object-cover" unoptimized />
                      </div>
                    </td>
                    <td className="p-4 font-medium">{a.title}</td>
                    <td className="p-4 text-gray-500">{a.artist_id}</td>
                    <td className="p-4 text-gray-500">₹{a.price?.toLocaleString()}</td>
                    <td className="p-4 text-gray-400">{a.category_id}</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteArtwork(a.artwork_id)}
                        className="text-red-400 hover:text-red-200 text-xs bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-xl transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
