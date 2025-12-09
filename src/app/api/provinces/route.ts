import { ACEH_PROVINCE_ID } from "@/components/features/dashboard/kost/kost.constant";
import { db } from "@/db/drizzle";
import { provinces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const dynamic = "force-static";

export async function GET() {
  try {
    const acehProvince = await db.query.provinces.findMany({
      where: eq(provinces.id, ACEH_PROVINCE_ID),
    });

    return NextResponse.json(acehProvince);
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json(
      { error: "Failed to fetch provinces" },
      { status: 500 }
    );
  }
}
