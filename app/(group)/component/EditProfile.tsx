"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Education = {
  institute: string;
  degree: string;
  year: string;
};

type Experience = {
  company: string;
  role: string;
  duration: string;
};

export default function EditProfileModal({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: {
    name?: string;
    headline?: string;
    location?: string;
    bio?: string;
    image?: string;
    cover_img?: string;
    education?: Education[];
    experience?: Experience[];
  };
}) {
  const [name, setName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [about, setAbout] = useState<string>("");

  const [profilePreview, setProfilePreview] = useState<string | null>(initialData?.image || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.cover_img || null);

  const [education, setEducation] = useState<Education[]>([
    { institute: "", degree: "", year: "" },
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { company: "", role: "", duration: "" },
  ]);


  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "profile") {
        setProfilePreview(reader.result as string);
      } else {
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name || "");
    setCoverPreview(initialData.cover_img || null);
    setProfilePreview(initialData.image || null);
    setHeadline(initialData.headline || "");
    setLocation(initialData.location || "");
    setAbout(initialData.bio || "");

    if (initialData.education?.length) {
      setEducation(initialData.education);
    }

    if (initialData.experience?.length) {
      setExperience(initialData.experience);
    }
  }, [initialData]);

const uploadedImg = async (base64: string | null) => {
  if (!base64) return null;

  const res = await fetch("/api/upload-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: base64,
      folder: "profile",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.imageUrl;
};


 const handleSave = async () => {
  let profileImageUrl = null;
  let coverImageUrl = null;

  if (profilePreview && profilePreview.startsWith("data:image")) {
    profileImageUrl = await uploadedImg(profilePreview);
  }

  if (coverPreview && coverPreview.startsWith("data:image")) {
    coverImageUrl = await uploadedImg(coverPreview);
  }

  const res = await fetch("/api/editProfile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name,
      headline,
      location,
      bio: about,
      education,
      experience,
      image: profileImageUrl,
      cover_img: coverImageUrl,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data?.message || "Something went wrong");
    return;
  }

  alert("Profile updated successfully");
  onClose();
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-screen p-0 rounded-2xl flex flex-col">

        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        {/* COVER IMAGE */}
        <div className="relative h-40 bg-gray-200">
          {coverPreview ? (
            <Image
              src={coverPreview}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : initialData?.cover_img ? (
            <Image
              src={initialData.cover_img}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <p className="text-center pt-16 text-gray-500">Upload cover photo</p>
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => handleImageSelect(e, "cover")}
          />
        </div>


        <div className="relative w-24 h-24 -mt-12 ml-6 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
          {profilePreview ? (
            <Image
              src={profilePreview}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : initialData?.image ? (
            <Image
              src={initialData.image}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <p className="text-xs text-center pt-9 text-gray-600">Upload</p>
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => handleImageSelect(e, "profile")}
          />
        </div>


        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Textarea placeholder="About" value={about} onChange={(e) => setAbout(e.target.value)} />

          {/* EDUCATION */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Education</h3>
            {education.map((edu, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-2">
                <Input
                  placeholder="Institute"
                  value={edu.institute}
                  onChange={(e) => {
                    const copy = [...education];
                    copy[i].institute = e.target.value;
                    setEducation(copy);
                  }}
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const copy = [...education];
                    copy[i].degree = e.target.value;
                    setEducation(copy);
                  }}
                />
                <Input
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => {
                    const copy = [...education];
                    copy[i].year = e.target.value;
                    setEducation(copy);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setEducation([...education, { institute: "", degree: "", year: "" }])
              }
            >
              + Add education
            </Button>
          </div>

          {/* EXPERIENCE */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Experience</h3>
            {experience.map((exp, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-2">
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => {
                    const copy = [...experience];
                    copy[i].company = e.target.value;
                    setExperience(copy);
                  }}
                />
                <Input
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => {
                    const copy = [...experience];
                    copy[i].role = e.target.value;
                    setExperience(copy);
                  }}
                />
                <Input
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) => {
                    const copy = [...experience];
                    copy[i].duration = e.target.value;
                    setExperience(copy);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setExperience([...experience, { company: "", role: "", duration: "" }])
              }
            >
              + Add experience
            </Button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
