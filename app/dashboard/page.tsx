import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const userGenerations = await db
    .select()
    .from(generations)
    .where(eq(generations.walletAddress, session.walletAddress))
    .orderBy(desc(generations.createdAt))
    .limit(50);

  return <DashboardClient generations={userGenerations} />;
}
