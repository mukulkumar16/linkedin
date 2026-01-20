"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/helper/socket";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

/* ---------- TYPES ---------- */

interface Member {
  id: string;
  name: string;
  image?: string;
  isMe?: boolean;
  clerkId : string
  profile?: {
    image?: string;
  }
}

export interface Conversation {
  id: string;
  members: Member[];
  lastMessage?: {
    createdAt?: string;
  };
}


interface Message {
  text: string;
  self: boolean;
}

interface ApiMessage {
  text: string;
  isSender: boolean;
}

interface ReceiveMessagePayload {
  conversationId: string;
  text: string;
}

interface ChatWindowProps {
  conversation?: Conversation | null;
}

/* ---------- COMPONENT ---------- */

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");

  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user: myuser } = useUser();

  const user = conversation?.members?.find((m) => m.clerkId !== myuser?.id);

  console.log("chat data from chatwindow " ,  conversation);

  /* ---------- HELPERS ---------- */

  function timeAgo(date: string): string {
    const seconds = Math.floor(
      (Date.now() - new Date(date).getTime()) / 1000
    );

    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) {
        return `${value} ${key}${value > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  }

  /* ---------- FETCH MESSAGES ---------- */

  useEffect(() => {
    if (!conversation) return;

    setLoadingMessages(true);

    fetch(`/api/message/${conversation.id}`)
      .then((res) => res.json())
      .then((data: ApiMessage[]) => {
        setMessages(
          data.map((m) => ({
            text: m.text,
            self: m.isSender,
          }))
        );
      })
      .finally(() => setLoadingMessages(false));
  }, [conversation]);

  /* ---------- SOCKET LISTENER ---------- */

  useEffect(() => {
    if (!conversation) return;

    const handler = (data: ReceiveMessagePayload) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) => [
          ...prev,
          { text: data.text, self: false },
        ]);
      }
    };

    socket.on("receive-message", handler);

    return () => {
      socket.off("receive-message", handler);
    };
  }, [conversation]);

  /* ---------- AUTO SCROLL ---------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- JOIN ROOM ---------- */

  useEffect(() => {
    if (!conversation) return;
    socket.emit("join-conversation", conversation.id);
  }, [conversation]);

  /* ---------- SEND MESSAGE ---------- */

  const sendMessage = async (): Promise<void> => {
    if (!text.trim() || !conversation || sending || !myuser || !user) return;

    setSending(true);

    const res = await fetch("/api/message/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: conversation.id,
        text,
      }),
    });

    if (res.ok) {
      await res.json();

      socket.emit("send-message", {
        conversationId: conversation.id,
        senderId: myuser.id,
        receiverId: user.id,
        text,
      });

      setMessages((prev) => [...prev, { text, self: true }]);
      setText("");
    }

    setSending(false);
  };

  /* ---------- EMPTY STATE ---------- */

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Select a conversation
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* HEADER */}
      <div className="p-3 sm:p-4 border-b flex items-center gap-3 bg-white sticky top-0 z-10">
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
          {user?.profile?.image && (
            <Image
              src={user?.profile?.image}
              alt="Profile"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${user?.id}`}>
            <p className="font-semibold text-sm sm:text-base truncate">
              {user?.name}
            </p>
          </Link>
          <p className="text-xs text-gray-500 truncate">
            {conversation.lastMessage?.createdAt
              ? `Last active ${timeAgo(
                  conversation.lastMessage.createdAt
                )}`
              : "Active now"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 px-3 sm:px-4 py-4 space-y-2 overflow-y-auto bg-gray-50">
        {loadingMessages ? (
          <p className="h-full flex items-center justify-center text-gray-400 text-sm">
            Loading messages…
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`
                px-4 py-2 rounded-2xl text-sm wrap-break-word
                max-w-[80%] sm:max-w-[60%]
                ${
                  m.self
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white border text-gray-800"
                }
              `}
            >
              {m.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex items-center gap-2 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
          placeholder="Write a message…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2 text-sm disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
