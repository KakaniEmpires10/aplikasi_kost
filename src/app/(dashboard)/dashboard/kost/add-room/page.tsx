import FormRoom from "@/components/features/dashboard/kost/form/form-room"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tambah Kamar Kost",
  description: "Tambahkan kamar baru untuk kost Anda",
}

const page = async ({ searchParams }: { searchParams: Promise<{ kostId: string } | null | undefined> }) => {
  const params = await searchParams;
  const kostId = params?.kostId;

  return (
    <FormRoom kostId={kostId} />
  )
}

export default page