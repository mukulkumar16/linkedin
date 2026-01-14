"use client";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
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

      {/* Sign In Card */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-1 text-2xl font-semibold">Sign in</h2>
        <p className="mb-6 text-sm text-gray-600">
          Stay updated on your professional world
        </p>

        <SignIn
          redirectUrl="/feed"
          appearance={{
            elements: {
              card: "shadow-none p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "rounded-full border py-3 text-sm font-medium hover:bg-gray-50",
              formButtonPrimary:
                "rounded-full bg-[#0A66C2] py-3 text-sm font-semibold text-white hover:bg-[#004182]",
              dividerText: "text-gray-500",
              formFieldInput:
                "rounded-md border px-3 py-3 text-sm focus:border-[#0A66C2]",
            },
          }}
        />
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm">
        New to LinkedIn?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#0A66C2] hover:underline"
        >
          Join now
        </Link>
      </p>
    </div>
  );
}
