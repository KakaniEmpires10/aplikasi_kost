import { db } from "@/db/drizzle";
import { villages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const dynamic = "force-static"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const districtId = searchParams.get("districtId");

  if (!districtId) {
    return NextResponse.json({ error: "District ID is required" }, { status: 400 });
  }

  try {
    const desa = await db.query.villages.findMany({
      where: eq(villages.districtId, districtId)
    });

    return NextResponse.json(desa);
  } catch (error) {
    console.error(`Error fetching villages for city ${districtId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch villages" },
      { status: 500 }
    );
  }
}
