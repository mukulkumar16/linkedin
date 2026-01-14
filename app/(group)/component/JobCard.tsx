'use client';
import { MapPin, Clock, Briefcase } from "lucide-react";
import { Job } from "../addJob/page";
import { useEffect, useState } from "react";

export default function JobCard({ job }: { job: Job }) {

  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkApplied = async () => {
      const res = await fetch(`/api/addJob/applied?jobId=${job.id}`);
      const data = await res.json();
      setApplied(data.applied);
    };

    checkApplied();
  }, [job.id]);
  const applyJob = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/addJob/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setApplied(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Apply failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow border hover:shadow-md transition">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold text-blue-600">
            {job.title}
          </h2>

          <p className="text-sm font-medium">{job.company}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {job.location}
            </span>

            <span className="flex items-center gap-1">
              <Briefcase size={14} /> {job.type.replace("_", " ")}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={14} /> {job.workplace}
            </span>
          </div>
        </div>

      
      </div>

      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2 flex-wrap">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-gray-100 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex justify-end mt-4">
        <button
          onClick={applyJob}
          disabled={applied || loading}
          className={`px-5 py-1.5 text-sm rounded-full
            ${
              applied
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          {applied ? "Applied" : loading ? "Applying..." : "Apply"}
        </button>
      </div>
      </div>
    </div>
  );
}
