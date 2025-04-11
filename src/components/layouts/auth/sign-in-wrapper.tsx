"use client"

import { useState } from "react"
import SwitchSectionButton from "./switch-section-button"
import LoginSection from "./login-section"
import RegisterSection from "./register-section"

const SignInWrapper = () => {
    const [isRegister, setIsRegister] = useState(false)

    const handleChange = (input: boolean) => {
        setIsRegister(input)
    }

    return (
        <>
            <SwitchSectionButton register={isRegister} onRegisterChange={handleChange} />
            <div className="w-full lg:grid lg:min-h-svh lg:grid-cols-2 overflow-x-hidden">
                <LoginSection register={isRegister} onRegisterChange={handleChange} />
                <RegisterSection register={isRegister} onRegisterChange={handleChange} />
            </div>
        </>
    )
}

export default SignInWrapper