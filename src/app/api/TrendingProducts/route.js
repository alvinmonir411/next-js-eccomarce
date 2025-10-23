import { verifyAdmin } from "@/app/lib/adminMiddleware";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const juyelarycollections = db.collection(process.env.juyelarycollection);

    // Fetch products (optionally filter by email)
    const Trending = await juyelarycollections
      .find({ isTrending: true })
      .toArray();

    return new Response(JSON.stringify(Trending), { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
