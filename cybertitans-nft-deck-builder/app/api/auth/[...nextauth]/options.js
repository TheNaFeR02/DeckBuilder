import { prisma } from "@/client";
import { Prisma } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";


export const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log(
                "sign in started"
            )
            try {
                const _user = await prisma.user.create({
                    data: {
                        email: user.email,
                        name: user.name,
                        image: user.image
                    }
                })

                console.log("user created successfully", _user)
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                  // The .code property can be accessed in a type-safe manner
                  if (e.code === 'P2002') {
                    console.log(
                      'User has already an account.'
                    )
                    return true
                  }
                  console.log("unknown error :", e)
                }
                throw e
              }

            return true
        },

        // async jwt({ token, user, account, profile, isNewUser }) {
            
        // }
    }
}
