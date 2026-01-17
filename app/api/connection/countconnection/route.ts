import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {

    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({
            success : false,
            message : "user not found"
        })

    }
    console.log("user form connection ", userId);

    const dbuser = await prisma.user.findUnique({
        where : {
            clerkId : userId
        }
    })

    if(!dbuser){
        return NextResponse.json({
            success : false,
            message : "user not found in db"
        })
    }

    const countConct = await prisma.connection.findMany({
        where : {
            status : "ACCEPTED",
            OR : [
                {senderId : dbuser.id},
                {receiverId : dbuser.id}
            ]
        },
        include : {
            sender : {
                include : {
                    profile : true
                }
            },
            receiver : {
                include : {
                    profile : true
                }
            }
        }
    });
    return NextResponse.json({
        success : true,
        data : countConct
    })
    
}