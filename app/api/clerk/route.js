import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";

export async function POST(req) {

    const secret = process.env.SIGNING_SECRET;

    if (!secret) {
        throw new Error("SIGNING_SECRET is missing");
    }

    const wh = new Webhook(secret);

    const headerPayload = headers();

    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
    };

   
    const body = await req.text();

    let evt;

    try {
        evt = wh.verify(body, svixHeaders);
    } catch (err) {
        return new Response("Invalid webhook", { status: 400 });
    }

    const { data, type } = evt;

    const userData = {
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
    };

    await connectDB();

    switch (type) {
        case "user.created":
            await User.create(userData);
            break;

        case "user.updated":
            await User.findByIdAndUpdate(data.id, userData);
            break;

        case "user.deleted":
            await User.findByIdAndDelete(data.id);
            break;

        default:
            break;
    }

    return Response.json({ message: "Event received" });
}
