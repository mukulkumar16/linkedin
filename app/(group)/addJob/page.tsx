"use client";

import SideCard from "../component/SideCard";
import Footer from "../component/Footer";
import Link from "next/link";
import JobCard from "../component/JobCard";
import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  workplace: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  createdAt: string;
  user: {
    id: string;
    name: string;
    profile?: {
      image?: string;
      headline?: string;
    };
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data.data || []);
      } catch (error) {
        console.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col">
      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 h-fit">
            <SideCard />

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <Link href="/myJob">
                  <button className="w-full text-sm font-medium border border-blue-600 text-white bg-blue-600 rounded-full py-2 hover:bg-blue-700">
                    My jobs
                  </button>
                </Link>
              </div>

              <ul className="py-2 text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Preferences
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Career insights
                </li>
                <hr className="my-2" />
                <Link href="/addPost">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-blue-600">
                    Post a free job
                  </li>
                </Link>
              </ul>
            </div>
          </aside>

          {/* ================= JOB LIST ================= */}
          <main className="lg:col-span-9 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-5">
              <h1 className="text-lg sm:text-xl font-semibold">
                Recommended jobs
              </h1>
              <p className="text-sm text-gray-500">
                Based on your profile and activity
              </p>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
                Loading jobs...
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && jobs.length === 0 && (
              <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
                No jobs available right now
              </div>
            )}

            {/* JOBS */}
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </main>
        </div>
      </div>
      {/* MOBILE POST JOB BUTTON */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <Link href="/addPost">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium hover:bg-blue-700">
            + Post a job
          </button>
        </Link>
      </div>



      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
