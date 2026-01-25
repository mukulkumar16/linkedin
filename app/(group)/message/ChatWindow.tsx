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
  clerkId: string;
  profile?: {
    image?: string;
  };
}

interface SharedPost {
  id: string;
  caption?: string;
  image?: string;
  user?: {
    id: string;
    name?: string;
    profile?: {
      image?: string;
    };
  };
}

export interface Conversation {
  id: string;
  members: Member[];
}

interface Message {
  type: "TEXT" | "POST";
  text?: string;
  sharedPost?: SharedPost;
  self: boolean;
}

interface ApiMessage {
  type: "TEXT" | "POST";
  text?: string;
  sharedPost?: SharedPost;
  isSender: boolean;
}

interface ReceiveMessagePayload {
  conversationId: string;
  type: "TEXT" | "POST";
  text?: string;
  sharedPost?: SharedPost;
}

interface ChatWindowProps {
  conversation?: Conversation | null;
}

/* ---------- COMPONENT ---------- */

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user: myuser } = useUser();

  const user = conversation?.members.find(
    (m) => m.clerkId !== myuser?.id
  );


  /* ---------- MARK CONVERSATION AS READ ---------- */

useEffect(() => {
  if (!conversation) return;

  fetch(`/api/message/mark-read/${conversation.id}`, {
    method: "POST",
  });
}, [conversation?.id]);


  /* ---------- FETCH MESSAGES ---------- */

  useEffect(() => {
    if (!conversation) return;

    fetch(`/api/message/${conversation.id}`)
      .then((res) => res.json())
      .then((data: ApiMessage[]) => {
        setMessages(
          data.map((m) => ({
            type: m.type,
            text: m.text,
            sharedPost: m.sharedPost,
            self: m.isSender,
          }))
        );
      });
  }, [conversation]);

  /* ---------- SOCKET LISTENER ---------- */

  useEffect(() => {
    if (!conversation) return;

    const handler = (data: ReceiveMessagePayload) => {
      if (data.conversationId !== conversation.id) return;

      setMessages((prev) => [
        ...prev,
        {
          type: data.type,
          text: data.text,
          sharedPost: data.sharedPost,
          self: false,
        },
      ]);
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


  useEffect(() => {
  if (!conversation?.id) return;

  socket.emit("join-conversation", conversation.id);

  return () => {
    socket.emit("leave-conversation", conversation.id);
  };
}, [conversation?.id]);

useEffect(() => {
  if (!myuser?.id) return;
  socket.emit("join-user", myuser.id);
}, [myuser?.id]);


  /* ---------- SEND TEXT MESSAGE ---------- */

  const sendTextMessage = async () => {
    if (!text.trim() || !conversation) return;

    await fetch("/api/message/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: conversation.id,
        type: "TEXT",
        text,
      }),
    });

    socket.emit("send-message", {
      conversationId: conversation.id,
      type: "TEXT",
      text,
    });

    setMessages((prev) => [
      ...prev,
      { type: "TEXT", text, self: true },
    ]);

    setText("");
  };

  /* ---------- SEND POST MESSAGE ---------- */
  // Call this function when user clicks "Send in message"

  const sendPostMessage = async (post: SharedPost) => {
    if (!conversation) return;

    await fetch("/api/message/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: conversation.id,
        type: "POST",
        sharedPostId: post.id,
      }),
    });

    socket.emit("send-message", {
      conversationId: conversation.id,
      type: "POST",
      sharedPost: post, // 🔥 FULL OBJECT
    });

    setMessages((prev) => [
      ...prev,
      {
        type: "POST",
        sharedPost: post,
        self: true,
      },
    ]);
  };

  /* ---------- EMPTY ---------- */

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b flex items-center gap-3 bg-white">
        <div className="relative w-9 h-9 rounded-full overflow-hidden">
          {user?.profile?.image && (
            <Image src={user.profile.image} alt="" fill />
          )}
        </div>
        <Link href={`/profile/${user?.id}`}>
          <p className="font-semibold">{user?.name}</p>
        </Link>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[70%] ${m.self ? "ml-auto" : ""}`}>
            {/* TEXT */}
            {m.type === "TEXT" && (
              <div
                className={`px-4 py-2 rounded-xl text-sm ${
                  m.self
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {m.text}
              </div>
            )}

            {/* POST */}
            {m.type === "POST" && m.sharedPost && (
              <div className="border rounded-xl bg-white overflow-hidden">
                <div className="p-3 flex items-center gap-2 border-b">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    {m.sharedPost.user?.profile?.image && (
                      <Image
                        src={m.sharedPost.user.profile.image}
                        alt=""
                        fill
                      />
                    )}
                  </div>
                  <p className="text-sm font-semibold">
                    {m.sharedPost.user?.name}
                  </p>
                </div>

                {m.sharedPost.image && (
                  <img
                    src={m.sharedPost.image}
                    className="w-full max-h-60 object-cover"
                  />
                )}

                <div className="p-3 text-sm">
                  {m.sharedPost.caption}
                </div>

                <Link
                  href={`/post/${m.sharedPost.id}`}
                  className="block text-center text-blue-600 text-sm py-2 border-t"
                >
                  View post
                </Link>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
          placeholder="Write a message..."
          className="flex-1 border rounded-full px-4 py-2 text-sm"
        />
        <button
          onClick={sendTextMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
