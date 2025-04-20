import ViewKost from "@/components/features/dashboard/kost/view-kost"
import TitlePage from "@/components/features/dashboard/TitlePage"
import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "List Kost",
    description: "List Kost Anda",
}

const page = ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    return (
        <>
            <TitlePage>List Kost Anda</TitlePage>
            <Separator />
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <ViewKost queryParams={searchParams} />
            </Suspense>
        </>
    )
}

export default page