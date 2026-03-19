import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { categorize } from "@/lib/categorize";

export interface EmailMessage {
  id: string;
  subject: string;
  snippet: string;
  category: "Important" | "Promotions" | "General";
}

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = listRes.data.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json([]);
    }

    const emails: EmailMessage[] = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["Subject"],
        });

        const headers = detail.data.payload?.headers ?? [];
        const subjectHeader = headers.find((h) => h.name === "Subject");
        const subject = subjectHeader?.value ?? "(No Subject)";
        const snippet = detail.data.snippet ?? "";

        return {
          id: msg.id!,
          subject,
          snippet,
          category: categorize(subject),
        };
      })
    );

    return NextResponse.json(emails);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch emails";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
