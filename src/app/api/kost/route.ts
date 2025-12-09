import { db } from "@/db/drizzle"
import { kostImages, kosts } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const GET = async () => {
    try {
        const kostData = await db.query.kosts.findMany({
            orderBy: [asc(kosts.updatedAt)],
            columns: {
                checkInTime: false,
                checkOutTime: false,
                longitude: false,
                latitude: false,
                createdAt: false,
                updatedAt: false,
                deletedAt: false,
                provinceId: false,
                regencyId: false,
                districtId: false,
                categoryId: false
            },
            with: {
                category: {
                    columns: { name: true, id: true }
                },
                images: {
                    columns: { url: true },
                    where: eq(kostImages.isFeatured, true)
                },
                rooms: {
                    with: {
                        images: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(kostData), { status: 200 })
    } catch (err) {
        console.log(err);
    }
}