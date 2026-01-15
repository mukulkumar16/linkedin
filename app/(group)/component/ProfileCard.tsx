
'use client';
import Image from 'next/image';
import { useUser } from '@/app/context/userContext';
import { MapPin, Briefcase } from 'lucide-react';

interface UserProfile {
  image?: string;
}

interface data {
  name?: string;
  profile?: UserProfile;
  data?: any;

}

type UserContext = data | null;

export default function ProfileCard() {
  const { user, loading }: { user: UserContext; loading: boolean } = useUser();

  if (loading) {
    return (
      <div className="w-70 rounded-xl bg-white shadow p-4 animate-pulse">
        <div className="h-16 bg-gray-200 rounded-t-xl" />
        <div className="flex justify-center -mt-8">
          <div className="w-16 h-16 bg-gray-300 rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-70 rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden">

      {/* Cover Image */}
      <div className="relative h-16 bg-linear-to-r from-blue-600 to-blue-400" />

      {/* Profile Image */}
      <div className="relative flex justify-center -mt-8">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white">
          <Image
            src={user?.data?.profile?.image || '/avatar.png'}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 pb-4 text-center">
        <h3 className="mt-2 font-semibold text-gray-900">
          {user?.data?.name}
        </h3>

        <p className="text-sm text-gray-600">
          {user?.data?.profile?.headline || 'Frontend Developer'}
        </p>

        {/* Location */}
        {user?.data?.profile?.location && (
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
            <MapPin size={14} />
            <span>{user.data.profile.location}</span>
          </div>
        )}

        {/* Company */}
        {user?.data?.profile?.company && (
          <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
            <Briefcase size={14} />
            <span>{user.data.profile.company}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-full bg-blue-600 text-white text-sm py-1.5 hover:bg-blue-700 transition">
            Connect
          </button>
          <button className="flex-1 rounded-full border border-blue-600 text-blue-600 text-sm py-1.5 hover:bg-blue-50 transition">
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
