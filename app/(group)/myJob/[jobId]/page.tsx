'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "../../component/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Applicant {
  id: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
    profile?: {
      image?: string;
      headline?: string;
      location?: string;
    };
  };
}

export default function ApplicantsPage() {
  const params = useParams();
  const jobId = Array.isArray(params.jobId)
    ? params.jobId[0]
    : params.jobId;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const startChat = async (userid: string) => {
    const res = await fetch("/api/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: userid }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert(errorText);
      return;
    }

    const conversation = await res.json();
    router.push(`/message?c=${conversation.id}`);
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchApplicants = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();

        if (data.success) {
          setApplicants(data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex-1">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          Applicants
        </h1>

        {loading && <p>Loading applicants...</p>}

        {!loading && applicants.length === 0 && (
          <p className="text-gray-500">No applicants yet</p>
        )}

        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="
                bg-white rounded-xl border shadow
                p-4 sm:p-5
                flex flex-col sm:flex-row
                gap-4
              "
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {app.user.profile?.image && (
                  <img
                    src={app.user.profile.image}
                    alt={app.user.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold truncate">
                  {app.user.name}
                </h2>

                <p className="text-sm text-gray-600 wrap-break-words">
                  {app.user.profile?.headline || "No headline"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="
                flex flex-row sm:flex-col
                gap-2
                sm:items-end
              ">
                <Link href={`/profile/${app.user.id}`}>
                  <button className="text-sm border rounded-full px-4 py-1 hover:bg-gray-100">
                    View profile
                  </button>
                </Link>

                <button
                  onClick={() => startChat(app.user.id)}
                  className="text-sm border rounded-full px-4 py-1 hover:bg-gray-100"
                >
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
