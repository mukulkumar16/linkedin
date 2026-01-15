
'use client';

import Image from 'next/image';
import { useUser } from '@/app/context/userContext';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface UserProfile {
  image?: string;
}

interface data {
  name?: string;
  profile?: UserProfile;
  data?: any;
}

type UserContext = data | null;

export default function SideCard() {
  const { user }: { user: UserContext } = useUser();

  return (
    <div
      className="
        w-full 
        sm:w-full 
        md:w-60 
        bg-white 
        rounded-xl 
        shadow-lg 
        border 
        mb-4
      "
    >
      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
            {user?.data?.profile?.image && (
              <Image
                src={user?.data?.profile?.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {user?.data?.name}
            </p>
            <p className="text-xs text-gray-500 wrap-break-word">
              {user?.data?.profile?.headline}
            </p>
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500 wrap-break-word">
          {user?.data?.profile?.bio}
        </p>
      </div>

      {/* Menu */}
      <ul className="py-2 text-sm text-gray-700">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="wrap-break-word">
              {user?.data?.profile?.location}
            </span>
          </div>
        </li>

        <div className="p-4">
          <Link href="/profile">
            <button className="
              w-full 
              text-sm 
              border 
              border-blue-600 
              text-blue-600 
              rounded-full 
              py-2 
              hover:bg-blue-50
            ">
              View Profile
            </button>
          </Link>
        </div>
      </ul>
    </div>
  );
}
