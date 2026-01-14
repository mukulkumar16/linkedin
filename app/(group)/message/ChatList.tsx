
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* ---------- TYPES ---------- */
interface Member {
  isMe?: boolean;
  name?: string;
  image?: string;
}

interface Message {
  text?: string;
  createdAt?: string;
}

interface Conversation {
  id: string;
  members: Member[];
  lastMessage?: Message;
  unreadCount?: number;
}

interface ChatListProps {
  onSelect: (conversation: Conversation) => void;
  activeId?: string;
}

export default function ChatList({ onSelect, activeId }: ChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetch("/api/conversation/me")
      .then((res) => res.json())
      .then(setConversations);
  }, []);

  return (
    <div
      className="
        h-full bg-white border-r overflow-y-auto
        w-full sm:w-80
        fixed sm:static
        left-0 top-0
        z-40
      "
    >
      {/* Header */}
      <div className="p-4  text-lg font-semibold border-b sticky mt-10 bg-white z-10">
        Messaging
      </div>

      {/* Conversations */}
      {conversations.map((c) => {
        const user = c.members.find((m) => !m.isMe);

        return (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className={`
              flex items-center gap-3 px-4 py-3 cursor-pointer transition
              hover:bg-gray-100
              ${activeId === c.id ? "bg-gray-100" : ""}
            `}
          >
            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
              {user?.image && (
                <Image
                  src={user.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Name & Message */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium truncate">
                  {user?.name || "Unknown"}
                </p>

                {c.lastMessage?.createdAt && (
                  <span className="text-xs text-gray-500 shrink-0">
                    {new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 truncate">
                {c.lastMessage?.text || "Start a conversation"}
              </p>
            </div>

            {/* Unread Count */}
            {c.unreadCount && c.unreadCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white shrink-0">
                {c.unreadCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
