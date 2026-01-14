//@ts-nocheck
import prisma from "./prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncClerkUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Check if user already exists in DB
  let user = await prisma.user.findUnique({
    where: { clerkId : clerkUser.id },
  });

  if (!user) {
    // Create user in DB
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        name: clerkUser.firstName + " " + (clerkUser.lastName || ""),
        email: clerkUser.emailAddresses[0].emailAddress,
        password: "", 
      },
    });
  }

  return user;
}
