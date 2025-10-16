import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const product = await db
      .collection(process.env.juyelarycollection)
      .findOne({ _id: new ObjectId(params.id) });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  const updates = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB);
    const products = db.collection(process.env.juyelarycollection);

    if (req.method === "PATCH") {
      const filteredUpdates = {};
      for (const key in updates) {
        if (updates[key] !== undefined) {
          filteredUpdates[key] = updates[key];
        }
      }

      const result = await products.updateOne(
        { _id: new ObjectId(id) },
        { $set: filteredUpdates }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const updatedProduct = await products.findOne({ _id: new ObjectId(id) });
      res.status(200).json(updatedProduct);
    } else {
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    await client.close();
  }
}
