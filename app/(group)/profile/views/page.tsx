"use client";

import { useEffect, useState } from "react";

export default function ProfileViewsPage() {
  const [views, setViews] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile/view")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(setViews)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
  
      {views.length === 0 ? <h2>viewers not available</h2> : <h2>Who viewed your profile</h2>}

      {views.map((view) => (
        <div key={view.id} className="border p-3 my-2">
          <p>{view.viewer.name}</p>
        </div>
      ))}
    </div>
  );
}
