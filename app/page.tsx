"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

interface Email {
  id: string;
  subject: string;
  snippet: string;
  category: "Important" | "Promotions" | "General";
}

const categoryColors: Record<Email["category"], string> = {
  Important: "bg-red-100 text-red-800",
  Promotions: "bg-yellow-100 text-yellow-800",
  General: "bg-blue-100 text-blue-800",
};

export default function Home() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEmails() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/emails");
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to fetch emails");
      }
      const data = (await res.json()) as Email[];
      setEmails(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-zinc-900 py-16 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Smart Gmail Assistant
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Log in with Google to read and categorize your Gmail messages.
        </p>

        {!session ? (
          <button
            onClick={() => signIn("google")}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-zinc-700 dark:text-zinc-300">
                Signed in as{" "}
                <span className="font-semibold">{session.user?.email}</span>
              </p>
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Sign out
              </button>
            </div>

            <button
              onClick={fetchEmails}
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Fetching…" : "Fetch Emails"}
            </button>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-400">
                Error: {error}
              </div>
            )}

            {!loading && emails.length === 0 && !error && (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                No emails loaded yet. Click &quot;Fetch Emails&quot; to get
                started.
              </p>
            )}

            {emails.length > 0 && (
              <ul className="space-y-3">
                {emails.map((email) => (
                  <li
                    key={email.id}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex-1">
                        {email.subject}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[email.category]}`}
                      >
                        {email.category}
                      </span>
                    </div>
                    {email.snippet && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {email.snippet}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

