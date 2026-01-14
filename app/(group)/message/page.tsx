
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { Conversation } from "./ChatWindow";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const conversationId = searchParams.get("c");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setSelectedConversation(null);
      return;
    }

    fetch(`/api/conversation/${conversationId}`)
      .then((res) => res.json())
      .then(setSelectedConversation);
  }, [conversationId]);

  const handleSelect = (conversation : any) => {
    setSelectedConversation(conversation);
    router.push(`/message?c=${conversation.id}`);
  };

  return (
    <div className="h-screen flex overflow-hidden">

      {/* Chat List */}
      <div
        className={`
          w-full md:w-[320px] border-r bg-white
          ${selectedConversation ? "hidden md:block" : "block"}
        `}
      >
        <ChatList
          onSelect={handleSelect}
          activeId={selectedConversation?.id}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`
          flex-1
          ${!selectedConversation ? "hidden md:flex" : "flex"}
        `}
      >
        <ChatWindow conversation={selectedConversation} />
      </div>

    </div>
  );
}
