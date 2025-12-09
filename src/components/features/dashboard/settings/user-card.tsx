"use client"

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Session } from '@/lib/auth'
import Image from 'next/image'

const UserCard = ({ session }: { session: Session | null | undefined }) => {

    return (
        <Card className='overflow-hidden'>
            <div className="flex items-center justify-between space-x-4 py-2 px-8">
                <div className="flex items-center gap-4">
                    <Image
                        src={session?.user.image ? session?.user.image : '/image/placeholder/user.png'}
                        className="h-16 w-16 rounded-full"
                        width={64}
                        height={64}
                        alt='user image'
                    />
                    <div className="flex flex-col">
                        <div className='space-x-2 flex items-center'>
                            <h2 className="text-lg font-semibold capitalize">{session?.user.name}</h2>
                            <Badge variant="secondary">{session?.user.role}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{session?.user.email}</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default UserCard