"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { authClient } from "@/lib/auth-client"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { listMainNav } from "../list-nav"
import { Skeleton } from "@/components/ui/skeleton"

const Navbar = () => {
    const [menuState, setMenuState] = useState(false)

    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()

    return (
        <header>
            <nav data-state={menuState && 'active'} className="relative z-20 w-full border-b border-dashed bg-white backdrop-blur dark:bg-zinc-950/50 lg:dark:bg-transparent">
                <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                    <div className="flex w-full justify-between lg:w-auto">
                        <Link href="/" aria-label="home" className="flex items-center space-x-2 font-bold uppercase">
                            {process.env.NEXT_PUBLIC_APP_NAME}
                        </Link>

                        <button onClick={() => setMenuState(!menuState)} aria-label={menuState == true ? 'Close Menu' : 'Open Menu'} className="relative z-20 cursor-pointer p-2.5 lg:hidden">
                            <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                            <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                        </button>
                    </div>

                    <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                        <div className="lg:pr-4">
                            <ul className="space-y-6 text-base lg:flex lg:items-center lg:gap-8 lg:space-y-0 lg:text-sm">
                                {listMainNav.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.url} className="text-muted-foreground hover:text-accent-foreground duration-150">
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                ))}
                                {
                                    isPending ? (
                                        <Skeleton className="h-7 w-16 rounded-md" />
                                    ) : (
                                        session && (
                                            <li>
                                                <Link href="/dashboard" className="text-muted-foreground hover:text-accent-foreground duration-150">
                                                    <span>Dashboard</span>
                                                </Link>
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </div>

                        <div className="flex w-full flex-col items-center space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                            {
                                isPending ? (
                                    <Skeleton className="h-8 w-[4.5rem] rounded-md" />
                                ) : (
                                    session?.user ? (
                                        <Button
                                            size="sm"
                                            onClick={async () => await authClient.signOut({
                                                fetchOptions: {
                                                    onSuccess: () => {
                                                        router.refresh();
                                                    }
                                                }
                                            })}>
                                            Logout
                                        </Button>
                                    ) : (
                                        <Button asChild size="sm">
                                            <Link href="/authentication">
                                                Login
                                            </Link>
                                        </Button>
                                    )
                                )
                            }
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar