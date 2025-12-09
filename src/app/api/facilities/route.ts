import { db } from "@/db/drizzle";
import { facilities } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type");

  try {
    if (type) {
      const facilities_data = await db
        .select()
        .from(facilities)
        .where(eq(facilities.category, type.toUpperCase()))
        .orderBy(asc(facilities.name));

      return NextResponse.json(facilities_data, { status: 200 });
    }

    const facilities_data = await db
      .select()
      .from(facilities)
      .orderBy(desc(facilities.createdAt));

    return NextResponse.json(facilities_data, { status: 200 });
  } catch (e) {
    console.log(e);
  }
}
