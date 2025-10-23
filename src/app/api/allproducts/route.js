import { verifyAdmin } from "@/app/lib/adminMiddleware";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    // Verify admin user
    const userData = await verifyAdmin(req);

    // Get email from query
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const juyelarycollections = db.collection(process.env.juyelarycollection);

    // Fetch products (optionally filter by email)
    const allProducts = await juyelarycollections.find({}).toArray();

    return new Response(JSON.stringify(allProducts), { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
