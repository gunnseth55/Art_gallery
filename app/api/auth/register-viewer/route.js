import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    // Insert user into `users` table as 'user' role
    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name, email, "passwordless_hash_" + Date.now()]
    );

    return Response.json({ message: "Registration successful" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
