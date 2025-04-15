"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FormUpdateProfile from './form/form-update-profile'
import { Session } from '@/lib/auth'
import { HelpCircleIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const EditProfileCard = ({ session }: { session: Session['user'] | null | undefined }) => {
    const [open, setOpen] = useState(false)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Profile <span 
                    role='button' 
                    tabIndex={0} 
                    className={buttonVariants({ variant: 'secondary', size: 'iconSm' })} 
                    onClick={() => setOpen((prev) => !prev)}
                    >
                        <HelpCircleIcon />
                    </span>
                </CardTitle>
                <CardDescription 
                    className={cn("transition-all duration-300 ease-in-out transform overflow-hidden",
                        open ? "opacity-100 translate-y-0 max-h-20" : "-translate-y-4 opacity-0 max-h-0"
                    )}
                >
                    Silakan perbarui informasi profil Anda di bawah ini
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormUpdateProfile session={session} />
            </CardContent>
        </Card>
    )
}

export default EditProfileCard