// app/api/login/route.ts (Next.js App Router)
import dbConnect from "@/components/lib/mongodb";
import User from "@/components/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const user = await User.findOne({ phoneNumber: body.phoneNumber });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    return new Response("Server Error", { status: 500 });
  }
}
