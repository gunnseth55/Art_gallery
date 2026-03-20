import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email, biography, country, profile_image } = await req.json();

    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    // Insert into users
    const [userResult] = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'none', 'artist')",
      [name, email]
    );
    const newUserId = userResult.insertId;

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    // Insert into artists
    const [artistResult] = await db.query(
      "INSERT INTO artists (user_id, biography, country, profile_image, name, slug) VALUES (?, ?, ?, ?, ?, ?)",
      [newUserId, biography || "", country || "", profile_image || "", name, slug]
    );

    return Response.json({ 
      message: "Artist registered successfully", 
      artist_id: artistResult.insertId,
      slug: slug
    });

  } catch (error) {
    console.error("Register Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
