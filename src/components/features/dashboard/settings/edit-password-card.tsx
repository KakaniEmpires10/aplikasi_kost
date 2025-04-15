"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FormUpdatePassword from './form/form-update-password'
import { buttonVariants } from '@/components/ui/button'
import { useState } from 'react'
import { HelpCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const EditPasswordCard = () => {
    const [open, setOpen] = useState(false)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Password <span
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
                    Silakan perbarui Password Anda di bawah ini
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormUpdatePassword />
            </CardContent>
        </Card>
    )
}

export default EditPasswordCard