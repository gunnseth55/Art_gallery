import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Query for standard users (we don't want an Artist accidentally logging into the Viewer portal natively)
    const [users] = await db.query("SELECT * FROM users WHERE email = ? AND role = 'user'", [email]);
    
    if (users.length === 0) {
      return Response.json({ error: "Invalid email or you might be registered as an Artist. Please use the Artist Portal." }, { status: 401 });
    }

    const user = users[0];
    
    return Response.json({
      user_id: user.user_id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
