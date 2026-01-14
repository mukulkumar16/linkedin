import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {

    const user = await currentUser();
    if(!user){
        return NextResponse.json({
            success : false,
            message : "user not found"
        })

    }
    console.log("user form connection ", user);

    const dbuser = await prisma.user.findUnique({
        where : {
            clerkId : user.id
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