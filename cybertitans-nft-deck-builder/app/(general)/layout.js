import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Link from "next/link";
import Providers from "./providers";
import Image from "next/image"
import { getServerSession } from 'next-auth/next'
import { options } from "../api/auth/[...nextauth]/options";
import { signOut } from "next-auth/react";
import Logout from "../(auth)/google/signin/logout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cybertitans builder",
  description: "Deck builder for cybertitans",
  icons: {
    icon: '/icon.png', // /public path
  }
};

export default async function RootLayout({ children }) {

  const session = await getServerSession(options)

  if (!session)
    console.log("session lay", session, "user is not logged in")

  return (
    <html lang="en" >
      {/* <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head> */}
      <Providers>
        <body
          data-theme="dark"
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl" href="/">
                <Image
                  src="https://dex-bin.bnbstatic.com/static/dapp-uploads/1lalKyaw4nxafPLQMCRzC"
                  alt="cybertitans"
                  width={50}
                  height={50}
                />
                Cybertitans
              </a>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                {!session && <li><Link href={"/google/signin"}>Sign in</Link></li>}

                {session &&
                  // @ts-ignore
                  // (<>
                  //   <li><Link href={"/"}>Builds</Link></li>
                  //   <li>
                  //     <details>
                  //       <summary><Link href={"/"}>{session.user.name}</Link></summary>
                  //       <ul className="bg-base-100 rounded-t-none p-2">
                  //         <li><Logout /></li>
                  //       </ul>
                  //     </details>
                  //   </li> */
                  // </>
                  // )}
                  <>
                    <li><Link href={"/builds"}>Builds</Link></li>
                    <li>
                      <details>
                        <summary>{session.user.name}</summary>
                        <ul className="bg-base-100 rounded-t-none p-2">
                          <li><Logout /></li>
                        </ul>
                      </details>
                    </li>
                  </>
                }
              </ul>
            </div>
          </div>
          {children}
        </body>
      </Providers>
    </html>
  );
}
