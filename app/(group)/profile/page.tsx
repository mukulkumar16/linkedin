"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Pencil,
} from "lucide-react";
import EditProfileModal from "../component/EditProfile";
import { useEffect, useState } from "react";
import PostComp from "../component/PostComp";
import { useUser } from "@clerk/nextjs";
import Footer from "../component/Footer";

/* ---------------- TYPES ---------------- */
interface UserData {
  id: string;
  name: string;
  isPremium: boolean;
  profile: {
    image?: string;
    coverImg?: string;
    headline?: string;
    bio?: string;
    location?: string;
    education?: any[];
    experience?: any[];
  };
}

interface PostItem {
  id: string;
  [key: string]: any;
}

export default function ProfilePage() {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [views, setViews] = useState<any[]>([]);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUserData(data.data));
  }, []);

  /* ---------------- FETCH POSTS ---------------- */
  useEffect(() => {
    if (!userData?.id) return;

    fetch(`/api/allpost/${userData.id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data.data));
  }, [userData]);

  /* ---------------- FETCH CONNECTIONS ---------------- */
  useEffect(() => {
    fetch("/api/connection/countconnection")
      .then((res) => res.json())
      .then((data) => setConnections(data.data));
  }, []);

  /* ---------------- FETCH PROFILE VIEWS ---------------- */
  useEffect(() => {
    fetch("/api/profile/view")
      .then((res) => res.json())
      .then(setViews)
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#f3f2ef] min-h-screen">
      <div className="max-w-6xl mx-auto px-3 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ================= MAIN CONTENT ================= */}
        <div className="lg:col-span-8 space-y-4">

          {/* ---------- PROFILE CARD ---------- */}
          <Card className="overflow-hidden rounded-xl">
            {/* Cover */}
            <div className="relative h-36 sm:h-44 bg-gray-300">
              {userData?.profile?.coverImg && (
                <Image
                  src={userData.profile.coverImg}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Profile Info */}
            <CardContent className="relative p-4 sm:p-6">
              {/* Avatar */}
              <div className="absolute -top-14 left-4">
                <Image
                  src={
                    userData?.profile?.image ||
                    "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
                  }
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white bg-white"
                />
              </div>

              <div className="pt-16 flex flex-col sm:flex-row sm:justify-between gap-4">
                {/* LEFT */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    {userData?.name}
                  </h1>
                  <p className="text-gray-700 text-sm">
                    {userData?.profile?.headline}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <MapPin size={14} />
                    {userData?.profile?.location}
                  </div>

                  <Link
                    href="/connections"
                    className="text-sm text-blue-600 font-medium mt-1 inline-block"
                  >
                    {connections.length} connections
                  </Link>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-2">
                  {!userData?.isPremium ? (
                    <Button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                      onClick={async () => {
                        const res = await fetch(
                          "/api/stripe/create-checkout",
                          { method: "POST" }
                        );
                        const data = await res.json();
                        window.location.href = data.url;
                      }}
                    >
                      Try Premium
                    </Button>
                  ) : (
                    <span className="bg-yellow-400 px-3 py-1 rounded text-sm font-medium">
                      Premium
                    </span>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                  >
                    <Pencil size={14} className="mr-1" />
                    Edit profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---------- ABOUT ---------- */}
          {userData?.profile?.bio && (
            <Card className="rounded-xl">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {userData.profile.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* ---------- EXPERIENCE ---------- */}
          {userData?.profile?.experience?.length ? (
            <Card className="rounded-xl">
              <CardContent className="p-4 space-y-4">
                <h2 className="font-semibold">Experience</h2>
                {userData.profile.experience.map((exp, i) => (
                  <div key={i} className="flex gap-3">
                    <Briefcase size={18} className="text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium text-sm">{exp.role}</p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-500">{exp.duration}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {/* ---------- EDUCATION ---------- */}
          {userData?.profile?.education?.length ? (
            <Card className="rounded-xl">
              <CardContent className="p-4 space-y-4">
                <h2 className="font-semibold">Education</h2>
                {userData.profile.education.map((edu, i) => (
                  <div key={i} className="flex gap-3">
                    <GraduationCap size={18} className="text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium text-sm">{edu.institute}</p>
                      <p className="text-sm text-gray-600">{edu.degree}</p>
                      <p className="text-xs text-gray-500">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {/* ---------- POSTS ---------- */}
          <h2 className="font-semibold text-lg">
            {posts.length ? "Activity" : "No posts yet"}
          </h2>

          {posts.map((post) => (
            <PostComp key={post.id} post={post} />
          ))}
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">

          {/* PROFILE VIEWS */}
          <Card className="rounded-xl">
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1">
                Who viewed your profile
              </p>

              {userData?.isPremium ? (
                <>
                  <p className="text-2xl font-semibold text-blue-600">
                    {views.length}
                  </p>
                  <Link
                    href="/profile/views"
                    className="text-sm text-blue-600 font-medium"
                  >
                    See all views
                  </Link>
                </>
              ) : (
                <Button
                  className="w-full bg-yellow-400 text-black"
                  onClick={async () => {
                    const res = await fetch(
                      "/api/stripe/create-checkout",
                      { method: "POST" }
                    );
                    const data = await res.json();
                    window.location.href = data.url;
                  }}
                >
                  Try Premium
                </Button>
              )}
            </CardContent>
          </Card>

          {/* CONNECTIONS */}
          <Card className="rounded-xl">
            <CardContent className="p-4">
              <Link
                href="/connections"
                className="flex justify-between items-center"
              >
                <span className="font-semibold text-sm">Connections</span>
                <span className="text-blue-600 font-semibold">
                  {connections.length}
                </span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProfileModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={{
          name: userData?.name,
          bio: userData?.profile?.bio,
          headline: userData?.profile?.headline,
          location: userData?.profile?.location,
          image: userData?.profile?.image,
          cover_img: userData?.profile?.coverImg,
          experience: userData?.profile?.experience,
          education: userData?.profile?.education,
        }}
      />

      <Footer />
    </div>
  );
}
