//  api/ cart / route.js;
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    userId,
    productId,
    image,
    title,
    price,
    quantity = 1,
  } = await req.json();

  console.log();
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);

  try {
    // Check if product already exists in user's cart
    const existingItem = await db.collection("usercart").findOne({
      userId,
      productId,
    });

    if (existingItem) {
      // Update quantity
      const updated = await db
        .collection("usercart")
        .updateOne({ _id: existingItem._id }, { $inc: { quantity } });
      return new Response(JSON.stringify({ success: true, updated }), {
        status: 200,
      });
    } else {
      // Insert new item
      const result = await db.collection("usercart").insertOne({
        userId,
        productId,
        quantity,
        image,
        title,
        price,
        createdAt: new Date(),
      });
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
      }
    );
  }
}

// GET => Fetch cart items with product details

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing userId" }),
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);

  try {
    // 1️⃣ Fetch the cart items
    const cartItems = await db
      .collection("usercart")
      .find({ userId })
      .toArray();

    return new Response(JSON.stringify({ success: true, items: cartItems }), {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}

// for delelte ?

// api/addTocard/route.js

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing cartId" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // ObjectId convert
    const result = await db
      .collection("usercart")
      .deleteOne({ _id: new ObjectId(cartId) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Cart item not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Cart item deleted" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
