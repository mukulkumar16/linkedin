
'use client';
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import ConnectionButton from "../component/ConnectionBtn";
interface searchData {
  id: string,
  name: string,
  profile: {
    image: string,
    headline: string
  }
}


import { useUser } from "@clerk/nextjs";
export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const user = useUser();
  const [searchData, setSearchData] = useState<searchData[]>([]);
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await fetch(`/api/search/user?name=${query}`);

        if (!res.ok) {
          console.error("API error:", res.status);
          setSearchData([]);
          return;
        }

        const data = await res.json();
        setSearchData(data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setSearchData([]);
      }
    };
    fetchSearch();

  }, [query]);
  console.log("data from search page ", searchData);

  const sendRequest = async (userId: any) => {
    await fetch("/api/connection/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    setSearchData(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="p-5 mb-5">Search results for : {query}
      <hr className="mt-5" />
      <div className="mt-5">



        {searchData.map((u) => (
          <Link href={`/profile/${u.id}`} key={u.id}>
            <div
              key={u.id}
              className="flex items-center gap-4 p-3 border rounded mb-3"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden">
                {u.profile?.image && (
                  <Image
                    src={u.profile.image}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium">{u.name}</p>
                <p className="font-extralight text-sm">{u?.profile?.headline}</p>

              </div>


              <ConnectionButton profileUserId={u.id} loggedInUserId={user?.user?.id} />
            </div>
          </Link>
        ))}


      </div>

    </div>

  );
}
