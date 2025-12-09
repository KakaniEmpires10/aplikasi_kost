import { db } from "@/db/drizzle";
import { districts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const dynamic = "force-static"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("cityId");

  if (!cityId) {
    return NextResponse.json({ error: "City ID is required" }, { status: 400 });
  }

  try {
    const kecamatan = await db.query.districts.findMany({
      where: eq(districts.regencyId, cityId)
    });
    
    return NextResponse.json(kecamatan);
  } catch (error) {
    console.error(`Error fetching districts for city ${cityId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}
