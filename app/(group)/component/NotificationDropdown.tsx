"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/app/(group)/component/NotificationBell";

/* ---------- PROPS ---------- */
interface NotificationDropdownProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export default function NotificationDropdown({
  notifications,
  setNotifications,
}: NotificationDropdownProps) {
  const router = useRouter();

  async function handleClick(n: Notification) {
    await fetch("/api/notification/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: n.id }),
    });

    // Optimistic UI update
    setNotifications((prev) => prev.filter((p) => p.id !== n.id));

    if (
      (n.type === "POST_LIKE" || n.type === "POST_COMMENT") &&
      n.entityId
    ) {
      router.push(`/post/${n.entityId}`);
    }

    if (n.type === "CONNECTION_ACCEPTED" && n.senderId) {
      router.push(`/profile/${n.senderId}`);
    }
  }

  return (
    <div
      className="
        absolute right-0 mt-2
        w-[80vw] max-w-md
        bg-white shadow-lg rounded-lg
        overflow-hidden
      "
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => handleClick(n)}
          className={`
            flex gap-3 p-3 cursor-pointer
            hover:bg-gray-50 transition
            ${!n.isRead ? "bg-blue-50" : ""}
          `}
        >
          <img
            src={n.sender?.profile?.image ?? "/avatar.png"}
            alt="User"
            className="w-10 h-10 rounded-full shrink-0"
          />

          <div className="min-w-0">
            <p className="text-sm text-gray-800 break-words">
              <b className="font-semibold">
                {n.sender?.name ?? "Someone"}
              </b>{" "}
              {n.message}
            </p>
          </div>
        </div>
      ))}

      {notifications.length === 0 && (
        <p className="p-4 text-center text-sm text-gray-500">
          No new notifications
        </p>
      )}
    </div>
  );
}
