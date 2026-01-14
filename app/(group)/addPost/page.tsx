'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Footer from "../component/Footer";

/* ================= TYPES ================= */

type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
type WorkplaceType = "REMOTE" | "ONSITE" | "HYBRID";

interface UserData {
  id: string;
  name: string;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: JobType;
  workplace: WorkplaceType;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string;
}

/* ================= PAGE ================= */

export default function Page() {
  const { isLoaded, isSignedIn } = useUser();

  const [dbUser, setDbUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const [jobData, setJobData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    type: "FULL_TIME",
    workplace: "ONSITE",
    description: "",
    salaryMin: undefined,
    salaryMax: undefined,
    skills: "",
  });

  /* ================= FETCH LOGGED-IN USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setDbUser(data.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    if (isLoaded && isSignedIn) fetchUser();
  }, [isLoaded, isSignedIn]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setJobData((prev) => ({
      ...prev,
      [name]:
        name === "salaryMin" || name === "salaryMax"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  /* ================= SUBMIT JOB ================= */

  const handleSubmit = async () => {
    if (!dbUser) return alert("User not found");

    if (
      !jobData.title ||
      !jobData.company ||
      !jobData.location ||
      !jobData.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.type,
      workplace: jobData.workplace,
      description: jobData.description,
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
      skills: jobData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isOpen: true,
      userId: dbUser.id,
    };

    try {
      setLoading(true);

      console.log("JOB PAYLOAD:", payload);

      const res = await fetch("/api/addJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to post job");

      alert("Job posted successfully 🚀");

      setJobData({
        title: "",
        company: "",
        location: "",
        type: "FULL_TIME",
        workplace: "ONSITE",
        description: "",
        salaryMin: undefined,
        salaryMax: undefined,
        skills: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col items-center p-6 border-b">
        <h1 className="text-2xl text-blue-600">Hi {dbUser?.name}</h1>
        <h2 className="text-4xl font-semibold mt-2">
          Find your next great hire
        </h2>
        <p className="text-gray-500 mt-1">
          86% of small businesses get a qualified candidate in one day
        </p>
      </div>

      {/* MAIN */}
      <div className="flex justify-center gap-6 p-8 flex-1">
        <main className="w-full max-w-2xl bg-white rounded-xl shadow border p-6">
          <h1 className="text-xl font-semibold mb-6">Post a job</h1>

          <div className="space-y-4">
            <input
              name="title"
              value={jobData.title}
              onChange={handleChange}
              placeholder="Job title*"
              className="w-full border rounded px-3 py-2"
            />

            <input
              name="company"
              value={jobData.company}
              onChange={handleChange}
              placeholder="Company*"
              className="w-full border rounded px-3 py-2"
            />

            <input
              name="location"
              value={jobData.location}
              onChange={handleChange}
              placeholder="Location*"
              className="w-full border rounded px-3 py-2"
            />

            <select
              name="type"
              value={jobData.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>

            <select
              name="workplace"
              value={jobData.workplace}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="ONSITE">On-site</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>

            <div className="flex gap-3">
              <input
                name="salaryMin"
                type="number"
                value={jobData.salaryMin ?? ""}
                onChange={handleChange}
                placeholder="Salary Min"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="salaryMax"
                type="number"
                value={jobData.salaryMax ?? ""}
                onChange={handleChange}
                placeholder="Salary Max"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <input
              name="skills"
              value={jobData.skills}
              onChange={handleChange}
              placeholder="Skills (React, Next.js, Node)"
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Job description*"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              {loading ? "Posting..." : "Post job"}
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
