// app/api/users/route.js
import clientPromise from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("juwelary");

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return new Response(
        JSON.stringify({ error: "Missing uid query parameter" }),
        { status: 400 }
      );
    }

    const user = await db.collection("users").findOne({ uid });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error("MongoDB GET error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("juwelary");

    // Check for duplicate user
    const existingUser = await db
      .collection("users")
      .findOne({ email: body.email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
      });
    }

    // Insert new user
    const result = await db.collection("users").insertOne(body);

    return new Response(
      JSON.stringify({ message: "User created", data: result }),
      { status: 201 }
    );
  } catch (err) {
    console.error("MongoDB POST error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
