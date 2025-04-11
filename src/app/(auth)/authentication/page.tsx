import SignInMobile from "@/components/layouts/auth/sign-in-mobile"
import SignInWrapper from "@/components/layouts/auth/sign-in-wrapper"

export default function AuthPage() {
    return (
        <>
            <section className="hidden lg:block">
                <SignInWrapper />
            </section>
            <section className="lg:hidden flex justify-center items-center min-h-svh">
                <SignInMobile />
            </section>
        </>
    )
}