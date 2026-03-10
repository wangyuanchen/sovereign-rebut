import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { users, generations, type SceneType, sceneTypes } from "@/lib/db/schema";
import { verifyAuth } from "@/lib/auth";
import { generateComeback, getAIProvider } from "@/lib/ai";
import { type Locale, locales } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = await verifyAuth(request);
    if (!walletAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate body
    const body = await request.json();
    const { scenario, sceneType, intensity, locale = "zh" } = body;

    // Validate inputs
    if (!scenario || typeof scenario !== "string" || scenario.length < 10) {
      return NextResponse.json(
        { error: "Scenario must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!sceneTypes.includes(sceneType)) {
      return NextResponse.json({ error: "Invalid scene type" }, { status: 400 });
    }

    if (typeof intensity !== "number" || intensity < 1 || intensity > 5) {
      return NextResponse.json(
        { error: "Intensity must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate locale
    const validLocale: Locale = locales.includes(locale) ? locale : "zh";

    // Get user and check credits
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check credits (unlimited = -1)
    if (user.credits !== -1 && user.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits", needsPayment: true },
        { status: 402 }
      );
    }

    // Get AI provider info for logging
    const provider = getAIProvider();
    console.log(`[Generate] Using AI provider: ${provider}, locale: ${validLocale}`);

    // Generate comeback using configured AI provider
    const output = await generateComeback(
      scenario,
      sceneType as SceneType,
      intensity,
      validLocale
    );

    // Deduct credit if not unlimited
    if (user.credits !== -1) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.walletAddress, walletAddress));
    }

    // Save generation
    const generationId = nanoid();
    await db.insert(generations).values({
      id: generationId,
      walletAddress,
      scenario,
      sceneType: sceneType as SceneType,
      intensity,
      output,
    });

    // Get updated credits
    const [updatedUser] = await db
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.walletAddress, walletAddress));

    return NextResponse.json({
      success: true,
      output,
      generationId,
      remainingCredits: updatedUser?.credits ?? 0,
      provider, // Include provider info in response
    });
  } catch (error) {
    console.error("[Generate] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
