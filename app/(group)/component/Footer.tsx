"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 mb-0 bg-white text-sm text-gray-600">
      <div className="mx-auto mb-0 max-w-7xl px-4 py-6">
        {/* Top section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left */}
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <span className="text-blue-600">Linked</span>
            <span>App</span>
            <span className="text-gray-500 font-normal">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Center links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
            <Link href="/accessibility" className="hover:text-blue-600">
              Accessibility
            </Link>
            <Link href="/privacy" className="hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600">
              Terms
            </Link>
            <Link href="/help" className="hover:text-blue-600">
              Help Center
            </Link>
          </nav>

          {/* Right */}
          <div className="text-gray-500">
            Built with ❤️ using Next.js
          </div>
        </div>
      </div>
    </footer>
  );
}
