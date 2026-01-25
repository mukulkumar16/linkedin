"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";

import PostComp from "../../component/PostComp";
import ConnectionButton from "../../component/ConnectionBtn";
import Footer from "../../component/Footer";

import { useUser } from "@clerk/nextjs";

/* ================= TYPES ================= */

interface Profile {
    image?: string;
    coverImg?: string;
    headline?: string;
    location?: string;
    bio?: string;
    experience?: Experience[];
    education?: Education[];
}

interface Experience {
    company?: string;
    role?: string;
    duration?: string;
}

interface Education {
    institute?: string;
    degree?: string;
    year?: string;
}

interface UserData {
    id: string;
    name?: string;
    profile?: Profile;
}

interface Post {
    id: string;
    [key: string]: any; // ⛔ no logic change, PostComp controls structure
}

/* ================= COMPONENT ================= */

export default function Home({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = React.use(params);

    const router = useRouter();
    const { user } = useUser();

    const [open, setOpen] = useState<boolean>(false);

    const [userData, setUserData] = useState<UserData | null>(null);
    const [logUser, setLogUser] = useState<UserData | null>(null);
    const [post, setPost] = useState<Post[] | null>(null);
    const [suggestUser, setSuggestUser] = useState<UserData[] | null>(null);



    const profileUserId = id;

    console.log("profileuserid from profiel view" , profileUserId);

    useEffect(() => {
        fetch("/api/profile/view/view-record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileUserId }),
        });
    }, [profileUserId]);

    /* ================= LOGGED IN USER ================= */

    useEffect(() => {
        const ftUser = async () => {
            const res = await fetch("/api/user");
            const data = await res.json();
            setLogUser(data?.data ?? null);
        };
        ftUser();
    }, []);

    /* ================= PROFILE USER ================= */

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/user/" + id);
            const data = await res.json();
            setUserData(data?.data ?? null);
        };
        fetchUser();
    }, [id]);

    /* ================= SUGGESTIONS ================= */

    useEffect(() => {
        const suggUser = async () => {
            try {
                const res = await fetch("/api/connection/suggestions");
                const data = await res.json();
                setSuggestUser(data?.data ?? null);
            } catch (error) {
                console.error(error);
            }
        };
        suggUser();
    }, []);

    /* ================= POSTS ================= */

    useEffect(() => {
        if (!id) return;

        const userPost = async () => {
            try {
                const res = await fetch("/api/allpost/" + id);
                if (!res.ok) throw new Error("Post not fetched");
                const data = await res.json();
                setPost(data?.data ?? []);
            } catch (error) {
                console.error(error);
                alert("Post not fetched");
            }
        };

        userPost();
    }, [id]);

    /* ================= CHAT ================= */

    const startChat = async (): Promise<void> => {
        if (!userData?.id) return;

        const res = await fetch("/api/conversation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                receiverId: userData.id,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            alert(errorText);
            return;
        }

        const conversation = await res.json();
        router.push(`/message?c=${conversation.id}`);
    };

    /* ================= UI ================= */

    return (
        <div>
            <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-2 space-y-6">
                    {/* PROFILE HEADER */}
                    <Card className="rounded-2xl overflow-hidden">
                        {userData?.profile?.coverImg ? (
                            <div className="relative w-full h-36 sm:h-44 md:h-52">
                                <Image
                                    src={userData.profile.coverImg}
                                    alt="Cover Image"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="w-full h-36 sm:h-44 md:h-52 bg-linear-to-r from-amber-600 to-orange-500" />
                        )}

                        <CardContent className="relative pt-20 sm:pt-24">
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

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
                                <div>
                                    <h1 className="text-2xl font-bold">{userData?.name}</h1>
                                    <p className="text-gray-600">
                                        {userData?.profile?.headline}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <MapPin size={14} />
                                        {userData?.profile?.location}
                                    </div>
                                </div>

                                <ConnectionButton
                                    profileUserId={id}
                                    loggedInUserId={logUser?.id}
                                />

                                <button
                                    disabled={!userData?.id}
                                    onClick={startChat}
                                    className="text-sm border rounded-full px-4 py-1 hover:bg-gray-100"
                                >
                                    Message
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ABOUT */}
                    {userData?.profile && (
                        <Card className="rounded-2xl">
                            <CardContent className="p-5">
                                <h2 className="font-semibold text-lg mb-2">About</h2>
                                <p className="text-gray-600 text-sm">
                                    {userData.profile.bio}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* EXPERIENCE */}
                    {userData?.profile?.experience?.map((exp, index) => (
                        <Card key={index} className="rounded-2xl">
                            <CardContent className="p-5 space-y-4">
                                <h2 className="font-semibold text-lg">Experience</h2>
                                <div className="flex gap-4">
                                    <Briefcase className="text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">{exp.company}</h3>
                                        <p className="text-sm text-gray-600">{exp.role}</p>
                                        <p className="text-xs text-gray-500">{exp.duration}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* EDUCATION */}
                    {userData?.profile?.education?.map((edu, index) => (
                        <Card key={index} className="rounded-2xl">
                            <CardContent className="p-5 space-y-4">
                                <h2 className="font-semibold text-lg">Education</h2>
                                <div className="flex gap-4">
                                    <GraduationCap className="text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">{edu.institute}</h3>
                                        <p className="text-sm text-gray-600">{edu.degree}</p>
                                        <p className="text-xs text-gray-500">{edu.year}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <h1 className="text-2xl font-extrabold">
                        {post?.length ? "All Post" : "No post yet"}
                    </h1>

                    {post?.map((p) => (
                        <PostComp key={p.id} post={p} />
                    ))}
                </div>

                {/* RIGHT */}
                <div className="space-y-6 hidden lg:block">
                    <Card className="rounded-2xl">
                        <CardContent className="p-5">
                            <h2 className="font-semibold mb-4">Suggestions</h2>

                            {suggestUser?.map((u) => (
                                <div key={u.id} className="flex items-center gap-3 mb-4">
                                    <Image
                                        src={u.profile?.image ?? ""}
                                        alt="user"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            {u.profile?.headline}
                                        </p>
                                    </div>
                                    <ConnectionButton
                                        loggedInUserId={user?.id}
                                        profileUserId={u.id}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <Link href="/addJob">
                            <Image
                                src="https://media.licdn.com/media/AAYABATPAAgAAQAAAAAAAKwYrfHUPkoBQGmwnaG71Ps_5Q.png"
                                alt="Advertise"
                                width={500}
                                height={600}
                            />
                        </Link>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
}
