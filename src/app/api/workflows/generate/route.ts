import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { generateWorkflowFromPrompt } from "@/lib/ai/workflow-generator";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A valid automation prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt exceeds maximum length of 500 characters" },
        { status: 400 }
      );
    }

    const result = await generateWorkflowFromPrompt(prompt);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to generate workflow proposal";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
