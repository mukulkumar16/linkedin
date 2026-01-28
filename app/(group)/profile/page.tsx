
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import EditProfileModal from "../component/EditProfile";
import { useEffect, useState } from "react";
import PostComp from "../component/PostComp";
import { useUser } from "@clerk/nextjs";
import Footer from "../component/Footer";
interface userData {
  id: string,
  name: string,
  profile: {
    id: string,
    image: string,
    coverImg: string,
    headline: string,
    bio: string,
    education: any,
    experience: any,
    location: string

  },
  isPremium: boolean
}

interface PostItem {
  id: string;
  [key: string]: any;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<userData | null>(null);
  const [countConnect, setCountConnect] = useState([]);
  const [posts, setPosts] = useState<PostItem[] | null>(null);
  const user = useUser();

   const [views, setViews] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile/view")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(setViews)
      .catch((err) => setError(err.message));
  }, []);
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  useEffect(() => {
    if (!user?.user?.id) return;

    const userPost = async () => {
      try {
        const res = await fetch('/api/allpost/' + userData?.id);

        if (!res.ok) {
          throw new Error("Post not fetched");
        }

        const data = await res.json();
        setPosts(data.data);
      } catch (error) {
        console.error(error);
        alert("Post not fetched");
      }
    };

    userPost();
  }, [userData]);

  useEffect(() => {
    const fetchConnect = async () => {
      const res = await fetch('/api/connection/countconnection');
      const data = await res.json();
      setCountConnect(data.data);
    }
    fetchConnect();
  }, [userData]);

  console.log("connection data from profile", countConnect);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUserData(data.data);
    };
    fetchUser();
  }, []);


  return (
    <div className="bg-[#f3f2ef] min-h-screen">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* MAIN PROFILE SECTION */}
        <div className="lg:col-span-8 space-y-4">

          {/* PROFILE HEADER */}
          <Card className="overflow-hidden rounded-xl">
            {/* Cover */}
            <div className="relative h-36 sm:h-44 md:h-52 bg-gray-300">
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
            <CardContent className="relative px-4 sm:px-6 pb-5">
              {/* Profile Image */}
              <div className="absolute -top-14 sm:-top-16 left-4 sm:left-6">
                <Image
                  src={
                    userData?.profile?.image ||
                    "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
                  }
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white bg-white h-28 w-28 sm:h-32 sm:w-32"
                />
              </div>

              <div className="pt-16 sm:pt-20 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    {userData?.name}
                  </h1>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {userData?.profile?.headline}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin size={14} />
                    {userData?.profile?.location}
                  </div>
                </div>
                <Link href={'/connections'}>
                  <div className="flex items-center gap-2 text-lg text-blue-500 mt-1">connections
                    <div className="text-lg text-black" >
                      {countConnect?.length}
                    </div>
                  </div>
                </Link>

                {!userData?.isPremium && (
                  <Button
                    onClick={async () => {
                      const res = await fetch("/api/stripe/create-checkout", {
                        method: "POST",
                      });

                      const data = await res.json();
                      window.location.href = data.url;
                    }}
                    className="bg-yellow-400 px-2 hover:bg-yellow-600 rounded"
                  >
                    Try Premium
                  </Button>
                )}



                {userData?.isPremium && (
                  <span className="bg-yellow-400 px-2 py-1 h-9  rounded">
                    Premium
                  </span>
                )}


                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setOpen(true)}>
                    Edit profile
                  </Button>

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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ABOUT */}
          {userData?.profile?.bio && (
            <Card className="rounded-xl">
              <CardContent className="p-5">
                <h2 className="font-semibold text-base mb-2">About</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {userData.profile.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* EXPERIENCE */}
          {userData?.profile?.experience?.length > 0 && (
            <Card className="rounded-xl">
              <CardContent className="p-5 space-y-4">
                <h2 className="font-semibold text-base">Experience</h2>

                {userData?.profile.experience.map((exp: any, i: any) => (
                  <div key={i} className="flex gap-4">
                    <Briefcase className="text-gray-500 mt-1" size={20} />
                    <div>
                      <h3 className="font-medium text-sm">{exp.role}</h3>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-500">{exp.duration}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* EDUCATION */}
          {userData?.profile?.education?.length > 0 && (
            <Card className="rounded-xl">
              <CardContent className="p-5 space-y-4">
                <h2 className="font-semibold text-base">Education</h2>

                {userData?.profile.education.map((edu: any, i: any) => (
                  <div key={i} className="flex gap-4">
                    <GraduationCap className="text-gray-500 mt-1" size={20} />
                    <div>
                      <h3 className="font-medium text-sm">{edu.institute}</h3>
                      <p className="text-sm text-gray-600">{edu.degree}</p>
                      <p className="text-xs text-gray-500">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <hr />

          <h1 className="text-2xl font-extrabold">{posts?.length ? "All Post" : "No post yet"}</h1>
          <hr />

          {posts?.map((p: any) => (
            <PostComp key={p.id} post={p} />
          ))}
        </div>

        {/* RIGHT SIDEBAR (Optional / Future) */}
        {/* RIGHT SIDEBAR */}
<div className="hidden lg:block lg:col-span-4 space-y-4">

  {/* PROFILE VIEWS CARD */}
  <Card className="rounded-xl">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-sm">
          Who viewed your profile
        </p>
        {userData?.isPremium && (
          <span className="text-xs text-gray-500">
            Last 7 days
          </span>
        )}
      </div>

      {userData?.isPremium ? (
        <>
          <p className="text-2xl font-semibold text-blue-600">
            {views.length}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            profile views
          </p>

          <Link href="/profile/views">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              See all views
            </Button>
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Get noticed by seeing who viewed your profile.
          </p>

          <Button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
            onClick={async () => {
              const res = await fetch("/api/stripe/create-checkout", {
                method: "POST",
              });
              const data = await res.json();
              window.location.href = data.url;
            }}
          >
            Try Premium
          </Button>
        </>
      )}
    </CardContent>
  </Card>

  {/* CONNECTIONS CARD */}
  <Card className="rounded-xl">
    <CardContent className="p-4">
      <Link href="/connections">
        <div className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-semibold text-sm">
              Connections
            </p>
            <p className="text-xs text-gray-500">
              Grow your network
            </p>
          </div>
          <span className="text-blue-600 font-semibold">
            {countConnect?.length}
          </span>
        </div>
      </Link>
    </CardContent>
  </Card>

  {/* FOOTER / INFO */}
  <Card className="rounded-xl">
    <CardContent className="p-4 text-xs text-gray-500 leading-relaxed">
      <p className="font-medium text-sm mb-2">LinkedIn Clone</p>
      <p>
        Build your professional identity, connect with others,
        and showcase your work.
      </p>
    </CardContent>
  </Card>

</div>

      </div>
      <Footer/>
    </div>
  );
}
