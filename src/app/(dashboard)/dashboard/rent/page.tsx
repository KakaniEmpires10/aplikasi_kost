import { columns } from "@/components/features/dashboard/rent/table/column"
import { DataTableRent } from "@/components/features/dashboard/rent/table/data-table-rent"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "List Rumah Sewa",
    description: "List Rumah Sewa Anda",
}

const page = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/rent", {
        next: { tags: ["rents"] }
    })

    const data = await res.json();

    return (
        <>
            <DataTableRent columns={columns} data={data} />
        </>
    )
}

export default page