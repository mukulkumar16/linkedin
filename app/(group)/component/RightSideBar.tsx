"use client";

export default function RightSidebar() {
  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky  top-20 ml-10 h-fit">
      
      {/* LinkedIn News */}
      <div className="bg-white border  rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-3">LinkedIn News</h3>

        <ul className="space-y-3 text-sm">
          <li>
            <p className="font-medium hover:text-blue-600 cursor-pointer">
              India tech hiring rebounds
            </p>
            <span className="text-xs text-gray-500">
              2d ago • 12,345 readers
            </span>
          </li>

          <li>
            <p className="font-medium hover:text-blue-600 cursor-pointer">
              AI skills in high demand
            </p>
            <span className="text-xs text-gray-500">
              1d ago • 9,876 readers
            </span>
          </li>

          <li>
            <p className="font-medium hover:text-blue-600 cursor-pointer">
              Startup funding trends 2025
            </p>
            <span className="text-xs text-gray-500">
              3d ago • 7,450 readers
            </span>
          </li>
        </ul>

        <button className="mt-3 text-sm font-medium text-gray-600 hover:text-blue-600">
          Show more
        </button>
      </div>

      {/* Sponsored / Ad */}
      <div className="bg-white border rounded-xl p-4 text-sm">
        <p className="text-xs text-gray-500 mb-2">Sponsored</p>

        <div className="space-y-2">
          <p className="font-medium">
            Learn Full Stack Development 🚀
          </p>
          <p className="text-gray-600 text-xs">
            Upgrade your skills with industry projects.
          </p>

          <button className="mt-2 px-4 py-1.5 border rounded-full text-blue-600 font-medium hover:bg-blue-50">
            Learn more
          </button>
        </div>
      </div>

      {/* Mini Footer */}
      <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 px-2">
        <span className="hover:underline cursor-pointer">About</span>
        <span className="hover:underline cursor-pointer">Accessibility</span>
        <span className="hover:underline cursor-pointer">Help Center</span>
        <span className="hover:underline cursor-pointer">Privacy</span>
        <span className="hover:underline cursor-pointer">Terms</span>
      </div>
    </aside>
  );
}
