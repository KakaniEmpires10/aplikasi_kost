"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
// import FormUser from "../content/user/form/FormUser"
import { useState } from "react"
import { ClipboardList, DoorOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import SignInForm from "@/components/features/auth/form/sign-in"

const SignInMobile = () => {
    const [tabs, setTabs] = useState("login")

    const handleChangeTab = (value: string) => {
        setTabs(value)
    }

    return (
        <>
            <Tabs value={tabs} onValueChange={handleChangeTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2 drop-shadow">
                    <TabsTrigger className={cn({ "font-bold": tabs === "login" })} value="login">{tabs !== "login" && <DoorOpen className="w-5 h-5 mr-2" />} Login</TabsTrigger>
                    <TabsTrigger className={cn({ "font-bold": tabs !== "login" })} value="register">{tabs === "login" && <ClipboardList className="w-5 h-5 mr-2" />} Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card className="shadow">
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Masukkan Nomor Telepon dan Password Anda untuk Masuk ke Akun Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <SignInForm />
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">
                            Belum Punya Akun ? &nbsp;
                            <span className="underline cursor-pointer" onClick={() => handleChangeTab('register')}>Sign up</span>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card className="shadow">
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Masukkan Nomor Telepon Anda dan Jangan Lupa masukkan Password yang Kuat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <FormUser route="register" /> */}
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">
                            Sudah Punya Akun ? &nbsp;
                            <span className="underline cursor-pointer" onClick={() => handleChangeTab('login')}>Sign in</span>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default SignInMobile