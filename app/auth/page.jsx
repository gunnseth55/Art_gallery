"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [biography, setBiography] = useState("");
  const [country, setCountry] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [usernameError, setUsernameError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        const res = await fetch("/api/auth/login-artist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to login");
        }

        // Clear any viewer session before setting artist session
        localStorage.removeItem("viewer_id");
        localStorage.removeItem("viewer_name");
        // Store artist info locally
        localStorage.setItem("artist_id", data.artist_id);
        localStorage.setItem("artist_name", data.name);
        
        router.push("/dashboard");
      } else {
        // Register Flow
        
        // 1. Upload Profile Image if provided
        let uploadedImageUrl = "";
        if (profileFile) {
          const formData = new FormData();
          formData.append("file", profileFile);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
          uploadedImageUrl = uploadData.url;
        }

        // 2. Submit Registration Data
        const res = await fetch("/api/auth/register-artist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            username,
            email,
            biography,
            country,
            profile_image: uploadedImageUrl,
          }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to register");
        }

        alert("Registered successfully! Please login now.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-amber-50 flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-xl border border-amber-50/20 bg-black p-10 rounded-2xl shadow-[0_0_40px_rgba(254,243,199,0.05)]">
        <h1 className="text-5xl font-serif text-center mb-2">
          {isLogin ? "Artist Portal" : "Join as Artist"}
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {isLogin ? "Welcome back. Access your studio space." : "Showcase your masterpieces to the world."}
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
            <div>
              <label className="block text-sm font-medium mb-1 tracking-wider">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 focus:border-amber-50 p-2 outline-none transition-colors"
                placeholder="Leonardo da Vinci"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 tracking-wider">USERNAME</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full bg-transparent border-b border-gray-600 focus:border-amber-50 p-2 outline-none transition-colors"
                placeholder="leonardo_artist"
                pattern="[a-z0-9_.]{3,30}"
                title="3-30 chars. Only lowercase letters, numbers, _ and . allowed."
              />
              <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, _ and . only · 3-30 chars</p>
            </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 tracking-wider">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:border-amber-50 p-2 outline-none transition-colors"
              placeholder="artist@example.com"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 tracking-wider">COUNTRY</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-600 focus:border-amber-50 p-2 outline-none transition-colors"
                  placeholder="Italy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 tracking-wider">PROFILE IMAGE UPLOAD</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileFile(e.target.files[0])}
                  className="w-full bg-transparent border-b border-gray-600 focus:border-amber-50 p-2 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-black hover:file:bg-amber-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 tracking-wider">BIOGRAPHY</label>
                <textarea
                  required
                  rows={3}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="w-full bg-transparent border border-gray-600 focus:border-amber-50 p-2 outline-none transition-colors rounded-lg mt-2"
                  placeholder="Tell us about your artistic journey..."
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-4 bg-amber-50 text-black text-lg font-serif font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-xl disabled:opacity-50"
          >
            {isLoading ? "Processing..." : (isLogin ? "Enter Studio" : "Create Profile")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-gray-400 hover:text-amber-50 text-sm tracking-widest transition-colors font-serif"
          >
            {isLogin 
              ? "NEW HERE? REGISTER AS AN ARTIST" 
              : "ALREADY REGISTERED? LOG IN"}
          </button>
        </div>
      </div>
    </div>
  );
}
