
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SideCard from "../component/SideCard";
import RightSidebar from "../component/RightSideBar";
import PostComp from "../component/PostComp";
import CreatePostModal from "@/app/(group)/component/CreatePost";
import { useUser } from "@/app/context/page";
import Footer from "../component/Footer";

/* ---------- TYPES ---------- */
interface Post {
  id: string;
  [key: string]: any;
}


interface UserProfile {
  image?: string;
}

interface data {
  name?: string;
  profile?: UserProfile;
  data?: any;
}

type UserContext = data | null;


export default function Page() {
  const [openPostModal, setOpenPostModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
 const { user }: { user: UserContext } = useUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/post");
      const data = await res.json();
      setPosts(data.data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  return (
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col">
      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">

        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block md:col-span-3 ">
          <SideCard />
        </aside>

        {/* FEED */}
        <main className="md:col-span-6 space-y-4">
          {/* START POST */}
          <div className="bg-white border rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={
                    user?.data?.profile?.image ||
                    "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
                  }
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>

              <button
                onClick={() => setOpenPostModal(true)}
                className="flex-1 text-left border rounded-full px-4 py-2.5 text-gray-500 hover:bg-gray-100 transition text-sm"
              >
                Start a post
              </button>
            </div>

            {openPostModal && (
              <CreatePostModal onClose={() => setOpenPostModal(false)} />
            )}
          </div>

          {/* POSTS */}
          {posts?.map((post) => (
            <PostComp key={post.id} post={post} />
          ))}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3">
          <RightSidebar />
        </aside>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
