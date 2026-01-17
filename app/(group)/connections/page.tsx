'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserProfile {
  image?: string | null;
}

interface User {
  id: string;
  name: string;
  profile?: UserProfile;
}

interface Connection {
  id: string;
  sender: User;
  receiver: User;
}

interface DbUser {
  id: string;
}

export default function Page() {
  const [connectUser, setConnectUser] = useState<Connection[]>([]);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);

  // Fetch connections
  useEffect(() => {
    const fetchConnectUser = async () => {
      const res = await fetch('/api/connection/countconnection');
      const data = await res.json();
      setConnectUser(data.data ?? []);
    };
    fetchConnectUser();
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user');
      const data = await res.json();
      setDbUser(data.data ?? null);
    };
    fetchUser();
  }, []);

  return (
    <div className="mt-10">
      <h1 className="text-center mb-10">All Connections</h1>

      {connectUser.map((r) => {
        // Determine the "other" user
        const isReceiver = r.receiver.id === dbUser?.id;
        const user = isReceiver ? r.sender : r.receiver;
        const imageSrc = user.profile?.image ?? '/default-profile.png'; // fallback image

        return (
          <div key={r.id} className="pl-8 pr-8">
            <div className="flex items-center gap-4 p-3 border rounded mb-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={user.name}
                  height={100}
                  width={100}
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
              </div>

              <Link href={`/profile/${user.id}`}>
                <button className="cursor-pointer text-sm border rounded-full px-4 py-1 hover:bg-gray-100">
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
