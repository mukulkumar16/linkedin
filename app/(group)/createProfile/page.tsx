"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

interface Education {
  institute: string;
  degree: string;
  year: string;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
}

interface UploadResponse {
  imageUrl: string;
}

/* ---------------- COMPONENT ---------------- */

export default function CreateProfilePage() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [about, setAbout] = useState<string>("");

  const [education, setEducation] = useState<Education[]>([
    { institute: "", degree: "", year: "" },
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { company: "", role: "", duration: "" },
  ]);

  // base64 images
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  /* ---------------- IMAGE SELECT ---------------- */

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (type === "profile") setProfileImage(base64);
      else setCoverImage(base64);
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- UPLOAD IMAGE ---------------- */

  const uploadImage = async (
    base64: string | null
  ): Promise<string | null> => {
    if (!base64) return null;

    const res = await fetch("/api/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data: UploadResponse = await res.json();
    return data.imageUrl;
  };

  /* ---------------- CREATE PROFILE ---------------- */

  const handleCreateProfile = async (): Promise<void> => {
    try {
      const profileUrl = await uploadImage(profileImage);
      const coverUrl = await uploadImage(coverImage);

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          headline,
          location,
          bio: about,
          education,
          experience,
          image: profileUrl,
          cover_img: coverUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Profile creation failed");
      }

      alert("Profile created successfully 🎉");
      router.push("/profile");
    } catch (error) {
      const err = error as Error;
      alert(err.message);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl overflow-hidden">
        {/* COVER IMAGE */}
        <div className="relative h-40 bg-gray-200">
          {coverImage ? (
            <Image src={coverImage} alt="Cover" fill className="object-cover" />
          ) : (
            <p className="text-center pt-16 text-gray-500">
              Upload cover photo
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => handleImageSelect(e, "cover")}
          />
        </div>

        <CardContent className="pt-14 p-6 space-y-6">
          {/* PROFILE IMAGE */}
          <div className="relative w-24 h-24 -mt-20 ml-4 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <p className="text-xs text-center pt-9 text-gray-600">
                Upload
              </p>
            )}

            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleImageSelect(e, "profile")}
            />
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Textarea
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            {/* EDUCATION */}
            <div className="space-y-3">
              <h3 className="font-semibold">Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="border p-4 rounded-xl space-y-2">
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
                  setEducation([
                    ...education,
                    { institute: "", degree: "", year: "" },
                  ])
                }
              >
                + Add education
              </Button>
            </div>

            {/* EXPERIENCE */}
            <div className="space-y-3">
              <h3 className="font-semibold">Experience</h3>
              {experience.map((exp, i) => (
                <div key={i} className="border p-4 rounded-xl space-y-2">
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
                  setExperience([
                    ...experience,
                    { company: "", role: "", duration: "" },
                  ])
                }
              >
                + Add experience
              </Button>
            </div>
          </div>

          <Button className="w-full" onClick={handleCreateProfile}>
            Create Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
