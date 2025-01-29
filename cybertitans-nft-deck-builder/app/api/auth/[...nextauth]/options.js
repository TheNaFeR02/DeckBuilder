import GoogleProvider from "next-auth/providers/google";


export const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
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
}
