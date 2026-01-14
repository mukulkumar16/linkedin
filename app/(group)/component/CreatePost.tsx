
"use client";

import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useUser } from "@/app/context/page";



interface UserProfile {
  image?: string;
}

interface data {
  name?: string;
  profile?: UserProfile;
  data?: any;
}

type UserContext = data | null;




export default function CreatePostModal({
  onClose,
}: {
  onClose: () => void;
}) {

 const { user }: { user: UserContext } = useUser();

  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // ✅ store real file

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };



  const handlePost = async () => {
    if (!caption.trim() && !imagePreview) return;

    try {
      let image = null;

      if (imagePreview) {
        const uploadedImg = await fetch("/api/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imagePreview, // base64 string
          }),
        });

        const res = await uploadedImg.json();

        if (!uploadedImg.ok) {
          throw new Error(res.message || "Image upload failed");
        }

        image = res.imageUrl;
      }

      const postRes = await fetch("/api/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, image }),
      });

      if (!postRes.ok) {
        const err = await postRes.json();
        throw new Error(err.message || "Post failed");
      }

      setCaption("");
      setImagePreview(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      console.error("Post failed:", err);
    }
  };


  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 z-50
                   w-130 max-w-[95vw]
                   max-h-[90vh]
                   -translate-x-1/2 -translate-y-1/2
                   bg-white rounded-xl shadow-xl
                   flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-lg font-semibold">Create a post</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4">
            {user?.data?.profile?.image && <div className="relative w-7.5 h-7.5 rounded-full overflow-hidden">
              <Image
                src={user?.data?.profile?.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            }
            <div>
              <p className="font-semibold text-sm">{user?.data?.name}</p>
              <span className="text-xs text-gray-500">Post to Anyone</span>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full resize-none px-4 py-2 outline-none min-h-25 text-sm"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mx-4 my-2 max-h-75 overflow-hidden rounded-lg border">
              <Image
                src={imagePreview}
                alt="Preview"
                width={500}
                height={300}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t shrink-0 bg-white">
          <div className="flex gap-4 text-gray-600">
            <button
              onClick={() => fileRef.current?.click()}
              className="hover:bg-gray-100 p-2 rounded-full"
            >
              <ImageIcon />
            </button>

            

            

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />
          </div>

          <button
            onClick={handlePost}
            disabled={!caption.trim() && !imagePreview}
            className={`px-6 py-1.5 rounded-full text-sm font-medium text-white ${caption.trim() || imagePreview
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
              }`}
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
}
