"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useUnread } from '@/app/(group)/context/UnreadCount';
import { useRouter } from "next/navigation";
import {
    Home,
    Users,
    Briefcase,
    MessageCircle,
    Search,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

interface data {
    name?: string;
    profile?: {
        image?: string,
        headline : string 
    }
   
}




const Header = () => {
    const [isopen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();
    const [userData, setUserData] = useState<data | null>(null);
    const [networkCount, setNetworkCount] = useState<number>(0);
    const { totalUnread } = useUnread();
    const [query, setQuery] = useState<string>("");
    const { signOut } = useClerk();

    useEffect(() => {
        fetch("/api/connection/count")
            .then((res) => res.json())
            .then((data) => setNetworkCount(data.count))
            .catch(() => setNetworkCount(0));
    }, []);


    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push('/searchPage?q=' + query);
        }
        setQuery("");
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (!res.ok) return;
                const data = await res.json();
                setUserData(data.data);
            } catch {
                window.location.href = "/login";
            }
        };
        fetchUser();
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-gray-50 border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">

                {/* TOP ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="https://yt3.ggpht.com/-CepHHHB3l1Y/AAAAAAAAAAI/AAAAAAAAAAA/Z8MftqWbEqA/s900-c-k-no-mo-rj-c0xffffff/photo.jpg"
                            alt="LinkedIn"
                            width={40}
                            height={40}
                            className="shrink-0"
                        />

                        {/* SEARCH (VISIBLE EVERYWHERE) */}
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-full sm:w-72"
                        >
                            <Search size={18} className="text-black shrink-0" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                type="text"
                                placeholder="Search"
                                className="bg-transparent outline-none ml-2 text-sm flex-1"
                            />
                            <button
                                type="submit"
                                className="ml-2 rounded px-2 py-0.5 bg-blue-600 text-white text-xs"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* RIGHT NAV */}
                    <nav className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 flex-wrap">
                        <Link href="/feed">
                            <NavItem icon={<Home size={22} />} label="Home" />
                        </Link>

                        <Link href="/network">
                            <NavItem
                                icon={<Users size={22} />}
                                label="My Network"
                                badge={networkCount}

                            />
                        </Link>


                        <Link href="/addJob">
                            <NavItem icon={<Briefcase size={22} />} label="Jobs" />
                        </Link>

                        <Link href="/message" className="relative">
                            <NavItem icon={<MessageCircle size={22} />} label="Messaging" />

                            {totalUnread > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </Link>

                        <div className="flex flex-col items-center gap-1">
                        <NotificationBell />
                            <div className="text-xs text-gray-700">
                            Notification
                            </div>

                        </div>

                        {/* PROFILE */}
                        <div
                            className="relative flex flex-col items-center cursor-pointer"
                            onClick={() => setIsOpen((prev) => !prev)}
                        >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src={
                                        userData?.profile?.image ||
                                        "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
                                    }
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>


                            {/* DROPDOWN */}
                            {isopen && (
                                <>
                                    {/* Overlay */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsOpen(false);
                                        }}
                                    />


                                    {/* Dropdown */}
                                    <div
                                        className="absolute top-18 right-3 w-64 bg-white rounded-xl shadow-lg border z-50"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* User Info */}
                                        <div className="p-4 border-b">
                                            <div className="flex items-center gap-3">
                                                {userData?.profile?.image ? (<div className="relative w-7.5 h-7.5 rounded-full overflow-hidden">
                                                    <Image
                                                        src={userData?.profile?.image}
                                                        alt="Profile"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                ) : (<Image
                                                    src="https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
                                                    alt="Profile"
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />)}
                                                <div>
                                                    <p className="font-semibold text-sm">{userData?.name}</p>
                                                    <p className="text-xs text-gray-500">{userData?.profile?.headline}</p>
                                                </div>
                                            </div>

                                            <Link href={'/profile'} > <button onClick={(prev) => { setIsOpen(!prev) }} className="mt-3 w-full text-sm border border-blue-600 text-blue-600 rounded-full py-1 hover:bg-blue-50">
                                                View Profile
                                            </button></Link>
                                        </div>

                                        {/* Menu */}
                                        <ul className="py-2 text-sm text-gray-700">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Account</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                Settings & Privacy
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Help</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Language</li>

                                            <hr className="my-1" />

                                            <li
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                                                onClick={handleLogout}
                                            >
                                                Sign Out
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>

    );
};

export default Header;

const NavItem = ({
    icon,
    label,
    badge,
}: {
    icon: React.ReactNode;
    label: string;
    badge?: number;
}) => {
    return (
        <div className="flex flex-col items-center text-gray-600 hover:text-black">

            {/* ICON */}
            <div className="relative flex items-center justify-center w-6 h-6">
                {icon}

                {/* BADGE → only render if badge > 0 */}
                {badge !== undefined && badge > 0 && (
                    <span
                        className="
              absolute -top-2 -right-2
              min-w-4.5 h-4.5
              px-1
              flex items-center justify-center
              bg-red-600 text-white
              text-[10px] font-semibold
              rounded-full
              ring-2 ring-white
            "
                    >
                        {badge > 99 ? "99+" : badge}
                    </span>
                )}
            </div>

            {/* LABEL */}
            <span className="text-xs mt-1">
                {label}
            </span>
        </div>
    );
};
