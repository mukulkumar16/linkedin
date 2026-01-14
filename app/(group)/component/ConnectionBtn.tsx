
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Connection {
  id: string,
  status? : "PENDING" | "ACCEPTED" | string;
  senderId? : string ;

}

export default function ConnectionButton({ profileUserId  , loggedInUserId } : {profileUserId : string | undefined, loggedInUserId : string | undefined}) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/connection/status/${profileUserId}`)
      .then(res => res.json())
      .then(setConnection);
  }, [profileUserId]);

  const sendRequest = async () => {
    await fetch("/api/connection/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: profileUserId }),
    });

    router.refresh();
  };

  const respond = async (action : any) => {
    await fetch("/api/connection/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        connectionId: connection?.id,
        action,
      }),
    });

    router.refresh();
  };

  // 🟢 NO CONNECTION
  if (!connection) {
    return (
      <button
        onClick={sendRequest}
        className="text-sm border rounded-full px-4 py-1 bg-blue-600 text-white hover:bg-blue-700">
        Connect
      </button>
    );
  }

  // 🟡 PENDING
  if (connection.status === "PENDING") {
    // 🔑 IF I SENT IT
    if (connection?.senderId === loggedInUserId) {
      return <span className="text-gray-500">Pending</span>;
    }

    // 🔑 IF I RECEIVED IT
    return (
      <div className="flex gap-2">
        <button
          onClick={() => respond("ACCEPT")}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Accept
        </button>
        <button
          onClick={() => respond("REJECT")}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Reject
        </button>
      </div>
    );
  }

  // 🟢 CONNECTED
  if (connection.status === "ACCEPTED") {
    return (
      <button

        className="text-sm border rounded-full px-4 py-1 hover:bg-gray-100">
        Connected
      </button>
    );
  }

  return null;
}
