'use client';

import { useEffect, useState } from "react";
import SideCard from "../component/SideCard";
import Footer from "../component/Footer";
import Link from "next/link";

interface MyJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  workplace: string;
  isOpen: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<MyJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await fetch("/api/addJob/myJob");
        const data = await res.json();
        setJobs(data.data || []);
      } catch (error) {
        console.error("Failed to fetch my jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  return (
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block md:col-span-3">
            <SideCard />

            <div className="mt-4 bg-white rounded-xl shadow border">
              <div className="p-4 border-b">
                <Link href="/addPost">
                  <button className="w-full text-sm bg-blue-600 text-white rounded-full py-1 hover:bg-blue-700">
                    Post a job
                  </button>
                </Link>
              </div>

              <ul className="py-2 text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium">
                  My posted jobs
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Job preferences
                </li>
              </ul>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="md:col-span-9">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              My jobs
            </h1>

            {loading && <p>Loading your jobs...</p>}

            {!loading && jobs.length === 0 && (
              <div className="bg-white rounded-xl border p-6 text-gray-500">
                You haven’t posted any jobs yet.
              </div>
            )}

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow border p-4 sm:p-5"
                >
                  {/* TOP */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-blue-600">
                        {job.title}
                      </h2>
                      <p className="text-sm font-medium">
                        {job.company}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {job.location} · {job.type.replace("_", " ")} ·{" "}
                        {job.workplace}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Posted on{" "}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`self-start px-3 py-1 text-xs rounded-full font-medium ${
                        job.isOpen
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {job.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 items-center mt-4">
                    <p className="text-sm text-gray-700">
                      Applicants:{" "}
                      <span className="font-semibold">
                        {job._count.applications}
                      </span>
                    </p>

                    <Link href={`/myJob/${job.id}`}>
                      <button className="text-sm border rounded-full px-4 py-1 hover:bg-gray-100">
                        View applicants
                      </button>
                    </Link>

                    <button className="text-sm border rounded-full px-4 py-1 hover:bg-gray-100">
                      {job.isOpen ? "Close job" : "Reopen job"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
