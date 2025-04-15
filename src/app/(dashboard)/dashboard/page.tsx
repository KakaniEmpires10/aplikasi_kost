import { ChartAreaInteractive } from "@/components/features/dashboard/main/chart-area-interactive"
import { DataTable } from "@/components/features/dashboard/main/data-table"
import { SectionCards } from "@/components/features/dashboard/main/section-cards"

import data from "./data.json"

export default function Page() {
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </>
  )
}
