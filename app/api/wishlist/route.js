import {db} from "@/lib/db";
export async function GET(req){
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const [rows] = await db.query(
      `SELECT 
        wishlist.artwork_id, 
        COALESCE(artworks.title, categories.name) AS title, 
        COALESCE(artworks.image_url, categories.image_url_1, categories.image_url_2) AS image
      FROM wishlist
      LEFT JOIN artworks ON wishlist.artwork_id = artworks.artwork_id
      LEFT JOIN categories ON wishlist.artwork_id = categories.category_id
      WHERE wishlist.user_id = ?`,
      [user_id]
    );

    return Response.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req){
   try {
        const { user_id, artwork_id } = await req.json();
        const [result] = await db.query(
            "INSERT INTO wishlist (user_id, artwork_id) VALUES (?, ?)",
            [user_id, artwork_id]
        );
        
        return Response.json({ message: "Added to wishlist", id: result.insertId });
    } catch (error) {
        console.error("Database Error:", error); 
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req){
   try{
     const {user_id,artwork_id} =await req.json();
    await db.query(
        "DELETE FROM wishlist WHERE user_id=? AND artwork_id=?",
        [user_id,artwork_id]
    );
    return Response.json({message: "Removed from wishlist"});
   }
   catch(err){
    return Response.json({error:error.message},{status:500});
   }

}