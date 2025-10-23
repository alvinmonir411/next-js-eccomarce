import { verifyAdmin } from "@/app/lib/adminMiddleware";
import clientPromise from "@/app/lib/mongodb";
// import { verifyFirebaseToken } from "@/app/lib/verifyFirebaseToken";
export async function GET(req) {
  try {
    const userData = await verifyAdmin(req);

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

    return new Response(JSON.stringify({ users }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
