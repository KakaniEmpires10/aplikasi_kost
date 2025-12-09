import { DataTableCategories } from "@/components/features/dashboard/categories/data-table/data-table-categories";
import { columns } from "@/components/features/dashboard/categories/data-table/column";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "List Tipe",
    description: "Halaman ini menampilkan daftar Tipe/kategori yang tersedia dalam dashboard aplikasi kost."
}

const page = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/property-categories", {
        next: { tags: ["property_categories"] }
    });
    const data = await res.json();

    return (
        <DataTableCategories columns={columns} data={data} />
    )
}

export default page