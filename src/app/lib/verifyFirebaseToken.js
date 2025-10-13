import { admin } from "./firebaseadmin";

export async function verifyFirebaseToken(req) {
  const authheader = req.headers.get("authorization") || "";
  const token = authheader.split(" ")[1];
  if (!token) throw new Error("no token provided");
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded;
}

