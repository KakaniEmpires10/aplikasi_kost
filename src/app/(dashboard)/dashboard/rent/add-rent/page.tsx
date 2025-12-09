import FormRent from "@/components/features/dashboard/rent/form/form-rent"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Tambah Rumah Sewa",
    description: "Halaman untuk menambahkan data rumah sewa baru ke dalam sistem aplikasi.",
}

const page = () => {
    return (
        <FormRent />
    )
}

export default page