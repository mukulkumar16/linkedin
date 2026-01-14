
'use client'
import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react"

interface dbUser { 
    id : string,

}



export default function page() {
    const [connectUser, setConnectUser] = useState([]);
    const [dbUser, setDbuser] = useState<dbUser | null>(null);


    useEffect(() => {
        const fetchConnectUser = async () => {
            const res = await fetch('api/connection/countconnection');
            const data = await res.json();
            setConnectUser(data.data);
        }
        fetchConnectUser();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/api/user');
            const data = await res.json();
            setDbuser(data.data);

        }
        fetchUser();
    }, []);

    console.log("connected user from api ", connectUser);


    return (
        <div className="mt-10 ">
            <h1 className="text-center  mb-10">All connections</h1>
            {connectUser.map((r : any) => {


                return (
                    
                        <div key={r.id} className="pl-8 pr-8 ">
                            <div
                                key={r.id}
                                className="flex items-center  gap-4 p-3 border rounded mb-3"
                            >
                                <div className="relative w-9 h-9 rounded-full overflow-hidden">
                                    <Image
                                        src={r.receiver.id === dbUser?.id ? r.sender.profile.image : r.receiver.profile.image}
                                        alt="pic"
                                        height={100}
                                        width={100}
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium">{r.receiver.id === dbUser?.id ? r.sender.name : r.receiver.name}</p>
                                   
                                </div>
                                <Link href={`/profile/${r.receiver.id === dbUser?.id ? r.sender.id : r.receiver.id}`}>
                                    <button className=" cursor-pointer text-sm border rounded-full px-4 py-1 hover:bg-gray-100">view Profile</button>
                                </Link>
                            </div>
                        </div>
                    
                    
                );
            })}

        </div>
    )
}
