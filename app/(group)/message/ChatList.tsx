"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { socket } from "@/helper/socket";

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

  /* ---------- FETCH CONVERSATIONS ---------- */
  useEffect(() => {
    fetch("/api/conversation/me")
      .then((res) => res.json())
      .then((data) =>
        setConversations(
          data.map((c: Conversation) => ({
            ...c,
            unreadCount: c.unreadCount || 0,
          }))
        )
      );
  }, []);

  /* ---------- SOCKET: RECEIVE MESSAGE ---------- */
  useEffect(() => {
    const handler = (data: {
      conversationId: string;
      text?: string;
      type: "TEXT" | "POST";
      senderId?: string;
      createdAt?: string;
    }) => {
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== data.conversationId) return c;

          // Active chat → no unread increment
          if (activeId === c.id) {
            return {
              ...c,
              lastMessage: {
                text: data.text || "Shared a post",
                createdAt: data.createdAt || new Date().toISOString(),
              },
            };
          }

          // Inactive chat → increment unread
          return {
            ...c,
            lastMessage: {
              text: data.text || "Shared a post",
              createdAt: data.createdAt || new Date().toISOString(),
            },
            unreadCount: (c.unreadCount || 0) + 1,
          };
        });

        // 🔥 Move updated conversation to top
        const updatedConv = updated.find(
          (c) => c.id === data.conversationId
        );
        const others = updated.filter(
          (c) => c.id !== data.conversationId
        );

        return updatedConv ? [updatedConv, ...others] : updated;
      });
    };

    socket.on("receive-message", handler);
    return () => {
      socket.off("receive-message", handler);
    };
  }, [activeId]);

  /* ---------- RENDER ---------- */

  console.log("conversation from chat " , conversations);
  return (
    <div
      className="
        h-full bg-white border-r overflow-y-auto
        w-full sm:w-80
        
        left-0 top-0
        z-40
      "
    >
      {/* Header */}
      <div className="p-4 text-lg font-semibold border-b  bg-white z-10">
        Messaging
      </div>

      {/* Conversations */}
      {conversations.map((c) => {
        const user = c.members.find((m) => !m.isMe);

        return (
          <div
            key={c.id}
            onClick={() => {
              onSelect(c);
              setConversations((prev) =>
                prev.map((item) =>
                  item.id === c.id
                    ? { ...item, unreadCount: 0 }
                    : item
                )
              );
            }}
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

            {/* Unread Badge */}
            {(c.unreadCount ?? 0) > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white shrink-0">
                {c.unreadCount ?? 0}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
