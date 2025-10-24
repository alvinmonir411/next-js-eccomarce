import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const result = await db
      .collection(process.env.juyelarycollection)
      .find({})
      .toArray();

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const body = await request.json();

    const result = await db.collection("juyelarycollection").insertOne(body);

    return NextResponse.json(
      {
        message: "Product successfully added",
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("MongoDB Insert Error:", err);

    return NextResponse.json(
      {
        message: "Failed to insert document",
        error: err.message || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
