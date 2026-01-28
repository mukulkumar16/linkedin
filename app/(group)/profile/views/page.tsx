"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Viewer {
  id: string;
  createdAt: string;
 
  viewer: {
    id : string,
    name: string;
    profile : {
    id : string,
    image : string,
    headline : string,

  }
  };
}

export default function ProfileViewsPage() {
  const [views, setViews] = useState<Viewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await fetch("/api/profile/view");

        if (!res.ok) {
          throw new Error("Failed to fetch profile views");
        }

        const data = await res.json();
        setViews(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading profile views...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {views.length === 0
          ? "No one has viewed your profile yet"
          : "Who viewed your profile"}
      </h2>

      <div className="space-y-4">
        {views.map((view) => (
          <div
            key={view.id}
            className="flex items-center gap-4 border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            {/* Profile Image */}
            <Image
              src={view.viewer.profile.image || "/avatar.png"}
              alt={view.viewer.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />

            {/* Viewer Info */}
            <div className="flex-1">
              <p className="font-medium">{view.viewer.name}</p>
              {view.viewer.profile.headline && (
                <p className="text-sm text-gray-600">
                  {view.viewer.profile.headline}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Viewed {new Date(view.createdAt).toLocaleString()}
              </p>
            </div>
            <Link href={`/profile/${view.viewer.id}`}>View profile</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
