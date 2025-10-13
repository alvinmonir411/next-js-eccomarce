import clientPromise from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const result = await db
      .collection(process.env.juyelarycollection)
      .find(
        {},
        {
          projection: {
            images: 1,
            _id: 1,
            title: 1,
            subtitle: 1,
            currency: 1,
            price: 1,
            offerPrice: 1,
            stockQuantity: 1,
            rating: 1,
            reviews: 1,
          },
        }
      )
      .toArray();

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
