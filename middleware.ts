import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect all app routes except static files
    "/((?!_next|.*\\..*).*)",
  ],
};
