"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* ---------- TYPES ---------- */

interface Profile {
  image?: string;
}

interface User {
  id: string;
  name: string;
  profile?: Profile;
}

interface ConnectionRequest {
  id: string;
  sender: User;
}

/* ---------- COMPONENT ---------- */

export default function NetworkPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] =
    useState<boolean>(false);

  /* ---------- RECEIVED REQUESTS ---------- */

  useEffect(() => {
    fetch("/api/connection/receive")
      .then((res) => res.json())
      .then((data: ConnectionRequest[]) => {
        setRequests(data);
      });
  }, []);

  /* ---------- CONNECTION SUGGESTIONS ---------- */

  useEffect(() => {
    setLoadingSuggestions(true);

    fetch("/api/connection/suggestions")
      .then((res) => res.json())
      .then((data: unknown) => {
        // ✅ SAFETY CHECK (unchanged logic)
        if (Array.isArray(data)) {
          setSuggestions(data as User[]);
        } else {
          setSuggestions([]);
        }
      })
      .finally(() => setLoadingSuggestions(false));
  }, []);

  /* ---------- ACCEPT / REJECT ---------- */

  const respond = async (
    connectionId: string,
    action: "ACCEPT" | "REJECT"
  ): Promise<void> => {
    await fetch("/api/connection/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connectionId, action }),
    });

    setRequests((prev) =>
      prev.filter((r) => r.id !== connectionId)
    );
  };

  /* ---------- SEND REQUEST ---------- */

  const sendRequest = async (userId: string): Promise<void> => {
    await fetch("/api/connection/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    setSuggestions((prev) =>
      prev.filter((u) => u.id !== userId)
    );
  };

  /* ---------- UI ---------- */

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {/* ================= REQUESTS ================= */}
      <div>
        <h1 className="text-xl font-semibold mb-4">
          Connection Requests
        </h1>

        {requests.length === 0 && (
          <p className="text-gray-500">No pending requests</p>
        )}

        {requests.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-4 p-3 border rounded mb-3"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden">
              {r.sender.profile?.image && (
                <Image
                  src={r.sender.profile.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium">{r.sender.name}</p>
              <p className="text-sm text-gray-500">
                wants to connect with you
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => respond(r.id, "ACCEPT")}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Accept
              </button>
              <button
                onClick={() => respond(r.id, "REJECT")}
                className="px-3 py-1 border rounded"
              >
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= SUGGESTIONS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          People you may know
        </h2>

        {loadingSuggestions && (
          <p className="text-gray-500">Loading suggestions…</p>
        )}

        {!loadingSuggestions && suggestions.length === 0 && (
          <p className="text-gray-500">No suggestions available</p>
        )}

        {suggestions.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-4 p-3 border rounded mb-3"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden">
              {u.profile?.image && (
                <Image
                  src={u.profile.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-500">
                Suggested for you
              </p>
            </div>

            <button
              onClick={() => sendRequest(u.id)}
              className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
