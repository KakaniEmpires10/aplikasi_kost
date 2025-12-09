import { columns } from "@/components/features/dashboard/kost/data-table/column"
import { DataTableKost } from "@/components/features/dashboard/kost/data-table/data-table-kost"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "List Kost",
    description: "List Kost Anda",
}

const page = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/kost", {
        next: { tags: ["kosts"] }
    })

    const data = await res.json();

    return (
        <>
            <DataTableKost columns={columns} data={data} />
        </>
    )
}

export default page