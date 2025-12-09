import { db } from "@/db/drizzle";

export const GET = async () => {
    try {
        const kostsData = await db.query.kosts.findMany({
            columns: {
                id: true,
                name: true,
            }
        })

        return new Response(JSON.stringify(kostsData), { status: 200 });
    } catch (err) {
        console.log(err);

        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
}