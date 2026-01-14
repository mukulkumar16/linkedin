"use client";

import { useEffect } from "react";
import { socket } from "@/helper/socket";

export default function SocketProvider({ userId }: { userId: string }) {
  useEffect(() => {
    if (!userId) return;

    // Join personal room for notifications
    socket.emit("join-user", userId);

    return () => {
      socket.off("join-user");
    };
  }, [userId]);

  return null;
}
