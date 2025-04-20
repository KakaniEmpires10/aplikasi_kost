import { Suspense } from "react"
import DataTableKost from "./data-table/data-table-kost"
import FilterKost from "./form/filter-kost"
import GridKost from "./grid-table/grid-kost"

const ViewKost = async ({ queryParams }: { queryParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const layout = (await queryParams).layout || "grid"

  return (
    <>
      <FilterKost />
      <Suspense fallback={<div className="flex justify-center items-center">Loading...</div>}>
        {layout == 'grid' ? (<GridKost />) : (<DataTableKost />)}
      </Suspense>
    </>
  )
}

export default ViewKost