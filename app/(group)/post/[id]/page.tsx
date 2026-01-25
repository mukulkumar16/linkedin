'use client'
import { useEffect, useState } from "react";
import PostComp from "../../component/PostComp";
import { useParams } from "next/navigation";
import Footer from "../../component/Footer";
interface Post {
  id: string;
  caption?: string;
  image?: string;
  user?: User;
}

interface User {
    id : string,
    name : string
}

export default function page() {
    const params = useParams();
    const postId = params.id;

    const [post , setPost] = useState<Post | null>(null);
    useEffect(() => {
        const fetchpost = async () => {
            const res = await fetch(`/api/single-post/${postId}`);
            const data = await res.json();
            setPost(data.data);


        }
        fetchpost();
    },[postId]);
  return (

    <div className="p-10 w-full h-full">
       
        {post && <PostComp post={post}/>}
        <div className="mb-0">
            <Footer/>
        </div>
    </div>
  )
}
