import { verifyAdmin } from "@/app/lib/adminMiddleware";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    console.log("Received ID:", id);

    const isAdmin = await verifyAdmin(req);
    console.log("isAdmin:", isAdmin);

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.juyelarycollection);
    console.log("Collection OK:", collection.collectionName);

    const product = await collection.findOne({ _id: new ObjectId(id) });
    console.log("Product found:", product);

    const newStatus = !product.isTrending;
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isTrending: newStatus } }
    );

    return new Response(
      JSON.stringify({ success: true, isTrending: newStatus }),
      { status: 200 }
    );
  } catch (err) {
    console.error("ERROR IN /admin/trending:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
