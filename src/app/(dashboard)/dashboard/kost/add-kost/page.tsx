import FormKost from "@/components/features/dashboard/kost/form/form-kost"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Tambah Kost",
    description: "Tambahkan kost anda untuk bisa dilihat dan dibooking oleh khalayak umum"
}

const page = () => {
  return (
    <FormKost />
  )
}

export default page