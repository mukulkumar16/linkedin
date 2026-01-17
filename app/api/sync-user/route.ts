// app/api/sync-user/route.ts
import { NextResponse } from "next/server";
import { syncClerkUser } from "@/helper/syncClerckUser";
export const dynamic = "force-dynamic";
export async function GET() {
  const user = await syncClerkUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  return NextResponse.json({ success: true, user });
}
