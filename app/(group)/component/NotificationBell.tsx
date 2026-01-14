
"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "@/app/(group)/component/NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/notification")
      .then(res => res.json())
      .then(setNotifications);
  }, []);

  // 👇 Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const unread = notifications.filter((n : any) => !n.isRead ).length;

  return (
    <div ref={containerRef} className="relative">
      <Bell
        size={22}
        onClick={() => setOpen(prev => !prev)}
        className="cursor-pointer"
      />

      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          {unread}
        </span>
      )}

      {open && (
        <NotificationDropdown
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}
    </div>
  );
}
