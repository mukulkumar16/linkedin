import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f2ef]">

      {/* HEADER */}
      <header className="w-full bg-[#f9f9f9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="https://yt3.ggpht.com/-CepHHHB3l1Y/AAAAAAAAAAI/AAAAAAAAAAA/Z8MftqWbEqA/s900-c-k-no-mo-rj-c0xffffff/photo.jpg"
                alt="LinkedIn"
                width={45}
                height={45}
              />
              <h1 className="text-xl sm:text-2xl font-bold text-[#0A66C2]">
                Linkedin
              </h1>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/signup">
              <button className="rounded-full border border-black px-4 sm:px-5 py-1.5 text-sm font-semibold hover:bg-gray-100 transition">
                Join now
              </button>
            </Link>
            <Link href="/login">
              <button className="rounded-full border border-[#0A66C2] px-4 sm:px-5 py-1.5 text-sm font-semibold text-[#0A66C2] hover:bg-blue-50 transition">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 py-10 md:grid-cols-2">

        {/* LEFT SECTION */}
        <div className="p-4 sm:p-7">
          <h2 className="mb-6 text-2xl sm:text-3xl font-light leading-snug text-gray-600">
            Welcome to your <br /> professional community
          </h2>

          {/* Google Button */}
          <Link href="/signup">
            <button className="mb-3 flex w-full sm:w-100 items-center justify-center gap-2 rounded-full border bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                alt="Google"
                width={18}
                height={18}
              />
              Sign in with Google
            </button>

            {/* Email Button */}
            <button className="mb-4 w-full sm:w-100 rounded-full border-2 border-black px-4 py-3 text-sm font-semibold hover:bg-gray-100 transition">
              Sign in with email
            </button>
          </Link>

          {/* Terms */}
          <p className="mb-4 w-full sm:w-100 text-xs text-gray-600">
            By clicking Continue to join or sign in, you agree to LinkedIn’s{" "}
            <span className="text-[#0A66C2] hover:underline cursor-pointer">
              User Agreement
            </span>
            ,{" "}
            <span className="text-[#0A66C2] hover:underline cursor-pointer">
              Privacy Policy
            </span>{" "}
            and{" "}
            <span className="text-[#0A66C2] hover:underline cursor-pointer">
              Cookie Policy
            </span>
            .
          </p>

          {/* Footer Text */}
          <p className="text-sm">
            New to LinkedIn?{" "}
            <span className="cursor-pointer font-semibold text-[#0A66C2] hover:underline">
              Join now
            </span>
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden md:flex justify-center">
          <Image
            src="https://hashimedia.com/wengense/2020/10/Linkedin-company-page.png"
            alt="LinkedIn Hero"
            width={550}
            height={450}
            className="object-contain max-w-full h-auto"
            priority
          />
        </div>
      </main>
    </div>
  );
}
