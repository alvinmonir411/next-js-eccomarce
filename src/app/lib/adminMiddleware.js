import { admin } from "./firebaseadmin";
import clientPromise from "./mongodb";

export async function verifyAdmin(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader) throw new Error("No token provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const decoded = await admin.auth().verifyIdToken(token);
    console.log("decode emai", decoded.email);
    // Optional: check admin claim here, e.g., decoded.admin
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const usersCollection = db.collection("users");
    const finduser = await usersCollection.findOne({ email: decoded.email });
    console.log("finduser", finduser);
    if (!finduser || finduser.role !== "admin") {
      throw new Error("Unauthorized: Admin only");
    }
    return decoded;
  } catch (err) {
    throw new Error("verifyAdmin error: " + err.message);
  }
}
