'use client';

import SideCard from "../component/SideCard";
import Footer from "../component/Footer";
import Link from "next/link";
import JobCard from "../component/JobCard";
import { useEffect, useState } from "react";

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

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data.data);
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
      {/* CONTENT */}
      <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* LEFT SIDEBAR – ALWAYS VISIBLE */}
          <aside className="md:col-span-3">
            <SideCard />

            <div className="mt-4 w-60 bg-white rounded-xl shadow border">
              <div className="p-3 border-b">
                <Link href="/myJob">
                  <button className="w-full text-sm border border-blue-600 text-white bg-blue-600 rounded-full py-2 hover:bg-blue-700">
                    My Jobs
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
                <hr />
                <Link href="/addPost">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium">
                    Post a free job
                  </li>
                </Link>
              </ul>
            </div>
          </aside>

          {/* JOB LIST */}
          <main className="md:col-span-9">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Recommended jobs
            </h1>

            {loading && <p>Loading jobs...</p>}

            {!loading && jobs?.length === 0 && (
              <p className="text-gray-500">No jobs available</p>
            )}

            <div className="space-y-4">
              {jobs?.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
