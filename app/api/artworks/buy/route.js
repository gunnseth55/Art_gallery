import { db } from "@/lib/db";

export async function POST(req) {
    try {
        const { artwork_id, buyer_name, shipping_address } = await req.json();

        if (!artwork_id) {
            return Response.json({ error: "Artwork ID is required" }, { status: 400 });
        }

        // Technically you can save the buyer_name and shipping_address to a new 'orders' table. 
        // For the mock, we will just mark the masterpiece as sold!

        await db.query(
            "UPDATE artworks SET is_sold = true WHERE artwork_id = ?",
            [artwork_id]
        );

        return Response.json({ message: "Purchase completed successfully! Masterpiece secured." });

    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
