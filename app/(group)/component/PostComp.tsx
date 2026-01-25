"use client";
import { ThumbsUp, MessageSquareMore, Send } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/app/context/userContext";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/helper/socket";

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

interface Conversation {
  id: string;
  members: User[];
}


/* ---------------- COMPONENT ---------------- */
export default function PostComp({ post }: { post: Post }) {
  const postId = post.id;
  const { user } = useUser(); 
  const [showMenu, setShowMenu] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [likeState, setLikeState] = useState({
    likesCount: 0,
    likedByUser: false,
  });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
  if (!showShare) return;

  fetch("/api/conversations")
    .then(async (res) => {
      if (!res.ok) return [];
      const text = await res.text();
      return text ? JSON.parse(text) : [];
    })
    .then((data) => setConversations(Array.isArray(data) ? data : []))
    .catch(console.error);
}, [showShare]);


 

const sharePost = async (conversationId: string) => {
  const res = await fetch("/api/message/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId,
      type: "POST",
      sharedPostId: postId,
    }),
  });

  const data = await res.json();

  // 🔥 EMIT SOCKET EVENT
  socket.emit("send-message", {
    conversationId,
    type: "POST",
    sharedPost: data.sharedPost, // FULL POST OBJECT
  });

  setShowShare(false);
};



  const handleDeletePost = async () => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`/api/post/${postId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete post");

    window.location.reload(); // simplest safe refresh
  } catch (err) {
    console.error(err);
    alert("Failed to delete post");
  }
};


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


  useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node)
    ) {
      setShowMenu(false);
    }
  }

  if (showMenu) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showMenu]);

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
      <div className="flex justify-between items-start">
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

{user?.id === post.user?.id && (
  <div className="relative" ref={menuRef}>
    <button onClick={() => setShowMenu((p) => !p)}>
      <MoreVertical size={18} />
    </button>

    {showMenu && (
      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md z-50">
        <button
          onClick={handleDeletePost}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete post
        </button>
      </div>
    )}
  </div>
)}

</div>






      {/* CAPTION */}
      <div className="mt-3 text-sm sm:text-base wrap-break-words">
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
      <button
          onClick={() => setShowShare(true)}
          className="flex gap-2 items-center"
        >
          <Send size={18} />
          Send
        </button>
      </div>

         {showShare && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Send in message</h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {conversations.map((c) => {
                const other = c.members.find((m) => m.id !== user?.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => sharePost(c.id)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      {other?.profile?.image && (
                        <Image src={other.profile.image} alt="" fill />
                      )}
                    </div>
                    <span className="text-sm font-medium">{other?.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowShare(false)}
              className="mt-3 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
        <p className="text-sm mt-1 wrap-break-words whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
};
