import { authSectionProps } from "@/components/features/auth/auth.constant"
import SignUpForm from "@/components/features/auth/form/sign-up"
import GoogleCredButton from "@/components/features/auth/google-cred-button"
import { cn } from "@/lib/utils"
import Image from "next/image"

const RegisterSection = ({ register, onRegisterChange }: authSectionProps) => {
    return (
        <>
            <div className="overflow-hidden absolute right-0 w-1/2 h-full">
                <Image fill className={cn("object-cover object-left transition-transform duration-500 ease-in-out", { "translate-x-full": register })} style={{ zIndex: 2 }} src="/image/auth_right.png" alt='bg-auth-right' />
            </div>

            <div className={cn("relative flex items-center justify-center py-12 transition-transform duration-500 ease-in-out", { "translate-x-3/4": !register })}>
                <div className="mx-auto w-[350px] space-y-4">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">Register</h1>
                        <p className="text-balance text-muted-foreground">
                            Masukkan Email Anda dan Jangan Lupa masukkan Password yang Kuat
                        </p>
                    </div>
                    <div>
                        <SignUpForm tab={register} />
                    </div>
                    <div className="text-center text-sm">
                        Sudah Punya Akun ? &nbsp;
                        <span onClick={() => onRegisterChange(false)} className="underline cursor-pointer">
                            Sign in
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

export default RegisterSection