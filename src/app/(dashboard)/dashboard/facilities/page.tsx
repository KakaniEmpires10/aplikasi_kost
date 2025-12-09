import { columns } from "@/components/features/dashboard/facilities/data-table/column";
import { DataTableFacilities } from "@/components/features/dashboard/facilities/data-table/data-table-facilities";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Fasilitas",
  description: "Halaman ini menampilkan daftar fasilitas yang tersedia dalam dashboard aplikasi kost."
}

const Page = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/facilities", { 
    next: { tags: ["facilities"] } 
  });
  const data = await res.json();

  return (
    <DataTableFacilities columns={columns} data={data} />
  )
}

export default Page