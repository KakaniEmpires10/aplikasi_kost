import { authSectionProps } from "@/components/features/auth/auth.constant"
import { cn } from "@/lib/utils"
import Image from "next/image"
import SignInForm from "@/components/features/auth/form/sign-in"
import GoogleCredButton from "@/components/features/auth/google-cred-button"

const LoginSection = ({ register, onRegisterChange }: authSectionProps) => {
    return (
        <>
            <div className="overflow-hidden absolute w-1/2 h-full">
                <Image fill className={cn("object-cover object-right transition-transform duration-500 ease-in-out", { "-translate-x-full pointer-events-none": !register })} style={{ zIndex: 2 }} src="/image/auth_left.png" alt='bg-auth-left' />
            </div>

            <div className={cn("relative flex items-center justify-center py-12 transition-transform duration-500 ease-in-out", { "-translate-x-3/4": register })}>
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Masukkan Email dan Password Anda untuk Masuk ke Akun Anda
                        </p>
                    </div>
                    <div className="">
                        <SignInForm tab={register} />
                    </div>
                    <div className="text-center text-sm">
                        Belum Punya akun ? &nbsp;
                        <span onClick={() => onRegisterChange(true)} className="underline cursor-pointer">
                            Sign up
                        </span>
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            atau masuk menggunakan
                        </span>
                    </div>
                    <GoogleCredButton />
                </div>
            </div>
        </>
    )
}

export default LoginSection