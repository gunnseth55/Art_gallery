import {db} from "@/lib/db"
export async function GET(){
    const [artists]=await db.query(
        "SELECT * FROM artists"
    );
    return Response.json(artists);
}