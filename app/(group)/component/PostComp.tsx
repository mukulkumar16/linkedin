"use client";

import  { useEffect, useState } from "react";
import { ThumbsUp, MessageSquareMore } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/app/context/userContext";
import Link from "next/link";

/* ---------------- TYPES ---------------- */

interface UserProfile {
  image?: string;
  headline?: string;
}

interface User {
  id?: string;
  name?: string;
  profile?: UserProfile;
}

interface Post {
  id: string;
  caption?: string;
  image?: string;
  user?: User;
}

interface CommentType {
  id: number | string;
  postId: string;
  content: string;
  user: User;
}

/* ---------------- COMPONENT ---------------- */
export default function PostComp({ post }: { post: Post }) {
  const postId = post.id;
  const { user } = useUser(); // ✅ properly typed

  const [likeState, setLikeState] = useState({
    likesCount: 0,
    likedByUser: false,
  });

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);

  /* ---------------- LOAD COMMENTS ---------------- */
  useEffect(() => {
    if (!showComments) return;

    const loadComments = async () => {
      try {
        const res = await fetch(`/api/comments/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch comments");

        const data = await res.json();
        setComments(Array.isArray(data.comments) ? data.comments : []);
      } catch (err) {
        console.error(err);
      }
    };

    loadComments();
  }, [showComments, postId]);

  /* ---------------- ADD COMMENT ---------------- */
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    const tempComment: CommentType = {
  id: Date.now(),
  postId,
  content: newComment,
  user: {
    name: user.name,
    profile: {
      headline: user.profile?.headline ?? undefined,
      image: user.profile?.image ?? undefined,
    },
  },
};


    // Optimistic update
    setComments((prev) => [tempComment, ...prev]);
    setNewComment("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: tempComment.content,
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  /* ---------------- LOAD LIKES ---------------- */
  useEffect(() => {
    const loadLikes = async () => {
      try {
        const res = await fetch("/api/likeCount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        if (!res.ok) return;

        const data = await res.json();
        setLikeState({
          likesCount: data.likesCount,
          likedByUser: data.likedByUser,
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadLikes();
  }, [postId]);

  /* ---------------- TOGGLE LIKE ---------------- */
  const toggleLike = async () => {
    setLikeState((prev) => ({
      likesCount: prev.likedByUser ? prev.likesCount - 1 : prev.likesCount + 1,
      likedByUser: !prev.likedByUser,
    }));

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        // revert optimistic update
        setLikeState((prev) => ({
          likesCount: prev.likedByUser
            ? prev.likesCount - 1
            : prev.likesCount + 1,
          likedByUser: !prev.likedByUser,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="w-full bg-white border rounded-xl p-4 sm:p-6 mb-4">
      {/* USER */}
      <Link href={`/profile/${post.user?.id || ""}`}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {post.user?.profile?.image && (
              <Image
                src={post.user.profile.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            )}
          </div>
          <h2 className="font-semibold text-sm sm:text-base">
            {post.user?.name}
          </h2>
        </div>
      </Link>

      {/* CAPTION */}
      <div className="mt-3 text-sm sm:text-base break-words">
        {post.caption}
      </div>

      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full rounded-lg mt-3 object-cover max-h-125"
        />
      )}

      {/* ACTIONS */}
      <hr className="mt-4" />
      <div className="flex gap-6 mt-4 text-sm">
        <button onClick={toggleLike} className="flex gap-2 items-center">
          <ThumbsUp
            size={18}
            className={likeState.likedByUser ? "text-blue-600" : "text-gray-600"}
          />
          <span>{likeState.likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex gap-2 items-center"
        >
          <MessageSquareMore size={18} />
          Comment
        </button>
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="border-t mt-4 pt-4">
          {/* INPUT */}
          <div className="flex gap-3 mb-4">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
              {user?.profile?.image && (
                <Image
                  src={user.profile.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
            />

            <button
              onClick={handleAddComment}
              className="text-blue-600 font-semibold text-sm"
            >
              Post
            </button>
          </div>

          {/* COMMENT LIST */}
          <div className="space-y-3">
            {comments
              .filter((c) => c.postId === postId)
              .map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMMENT ---------------- */
const Comment = ({ comment }: { comment: CommentType }) => {
  return (
    <div className="flex gap-3">
      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
        {comment.user?.profile?.image && (
          <Image
            src={comment.user.profile.image}
            alt="Profile"
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="bg-gray-100 rounded-lg px-4 py-2 w-full">
        <p className="text-sm font-semibold">{comment.user?.name}</p>
        <p className="text-xs text-gray-500">{comment.user?.profile?.headline}</p>
        <p className="text-sm mt-1 break-words whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
};
