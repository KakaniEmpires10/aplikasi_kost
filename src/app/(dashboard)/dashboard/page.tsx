import { ChartAreaInteractive } from "@/components/features/dahsboard/main/chart-area-interactive"
import { DataTable } from "@/components/features/dahsboard/main/data-table"
import { SectionCards } from "@/components/features/dahsboard/main/section-cards"

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
