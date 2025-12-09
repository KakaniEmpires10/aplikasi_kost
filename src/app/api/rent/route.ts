import { db } from "@/db/drizzle";

export const GET = async () => {
    try {
        const rentsData = await db.query.rents.findMany({
            with: {
                images: true,
                category: {
                    columns: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        return new Response(JSON.stringify(rentsData), { status: 200 });
    } catch (err) {
        console.log(err);

        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
}