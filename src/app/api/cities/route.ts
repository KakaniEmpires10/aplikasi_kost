import { ACEH_BESAR_ID, ACEH_PROVINCE_ID, BANDA_ACEH_ID } from "@/components/features/dashboard/kost/kost.constant";
import { db } from "@/db/drizzle";
import { regencies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("provinceId");

  if (!provinceId || provinceId !== ACEH_PROVINCE_ID) {
    return NextResponse.json(
      { error: "Province ID is required" },
      { status: 400 }
    );
  }

  try {
    const cities = await db.query.regencies.findMany({
      where: eq(regencies.provinceId, ACEH_PROVINCE_ID),
    });

    const currentAvailabelAcehCities = cities.filter(
      item => item.id === ACEH_BESAR_ID || item.id === BANDA_ACEH_ID
    );

    return NextResponse.json(currentAvailabelAcehCities);
  } catch (error) {
    console.error(`Error fetching cities for province ${provinceId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}