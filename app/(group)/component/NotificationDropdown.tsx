
"use client";

import { useRouter } from "next/navigation";



export default function NotificationDropdown({ notifications, setNotifications } : {notifications : any , setNotifications : any}) {
  const router = useRouter();

  async function handleClick(n : any) {
    await fetch("/api/notification/read", {
      method: "PATCH",
      body: JSON.stringify({ id: n.id }),
    });

    // Remove notification from UI
    setNotifications((prev : any) => prev.filter((p : any) => p.id !== n.id));

    if (n.type === "POST_LIKE" || n.type === "POST_COMMENT") {
      router.push(`/post/${n.entityId}`);
    } else if (n.type === "CONNECTION_ACCEPTED") {
      router.push(`/profile/${n.senderId}`);
    }
  }

  return (
    <div className="
      absolute right-0 mt-2 
      w-[80vw] max-w-md 
      bg-white shadow-lg rounded-lg 
      overflow-hidden
    ">
      {notifications.map((n : any )=> (
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
            src={n.sender?.profile?.image || "/avatar.png"}
            className="w-10 h-10 rounded-full shrink-0"
          />

          <div className="min-w-0">
            <p className="text-sm text-gray-800 wrap-break-word">
              <b className="font-semibold">{n.sender?.name}</b>{" "}
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
