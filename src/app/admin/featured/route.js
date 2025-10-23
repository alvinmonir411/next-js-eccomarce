import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAdmin } from "@/app/lib/adminMiddleware";

export async function POST(req) {
  try {
    // Extract product ID from URL params (?id=...)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing product ID" }), {
        status: 400,
      });
    }

    // Optional: Admin verification
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized — Admin access only" }),
        { status: 403 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.juyelarycollection);

    // Fetch current product to know its current isFeatured state
    const product = await collection.findOne({ _id: new ObjectId(id) });
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }

    const newFeaturedValue = !product.isFeatured;

    // Update isFeatured field
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isFeatured: newFeaturedValue } }
    );

    return new Response(
      JSON.stringify({
        success: true,
        id,
        newValue: newFeaturedValue,
        message: newFeaturedValue
          ? "Product marked as Featured ⭐"
          : "Product unfeatured ❌",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling featured:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
