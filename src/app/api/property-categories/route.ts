import { db } from "@/db/drizzle";
import { propertyCategories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type");

  try {
    if (type) {
      const propertyCategories_data = await db
        .select()
        .from(propertyCategories)
        .where(eq(propertyCategories.type, type.toUpperCase()))
        .orderBy(asc(propertyCategories.createdAt));

      return NextResponse.json(propertyCategories_data, { status: 200 });
    }

    const propertyCategories_data = await db
      .select()
      .from(propertyCategories)
      .orderBy(asc(propertyCategories.createdAt));

    return NextResponse.json(propertyCategories_data, { status: 200 });
  } catch (e) {
    console.log(e);
  }
}
