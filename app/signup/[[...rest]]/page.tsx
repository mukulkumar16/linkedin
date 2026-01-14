"use client";


import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col items-center">

      {/* Logo */}
      <div className="w-full max-w-6xl px-6 py-6">
        <Link href="/">
          <h1 className="text-3xl font-bold text-[#0A66C2]">
            LinkedIn
          </h1>
        </Link>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">
          Make the most of your professional life
        </h2>

        <SignUp
          redirectUrl="/createProfile"
          appearance={{
            elements: {
              card: "shadow-none p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "rounded-full bg-[#0A66C2] py-3 text-sm font-semibold text-white hover:bg-[#004182]",
              socialButtonsBlockButton:
                "rounded-full border py-3 text-sm font-medium hover:bg-gray-50",
              formFieldInput:
                "rounded-md border px-3 py-3 text-sm focus:border-[#0A66C2]",
              dividerText: "text-gray-500",
            },
          }}
        />
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm">
        Already on LinkedIn?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#0A66C2] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
