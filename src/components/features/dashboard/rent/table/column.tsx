"use client"

import { PropertyCategory, Rent, RentImage } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
// import { Checkbox } from "@/components/ui/checkbox"
import TableButton from "./table-button";
import Image from "next/image";
// import { Badge } from "@/components/ui/badge";

export type UserRentTable = Rent & {
    images: RentImage[],
    category: Pick<PropertyCategory, "id" | "name">,
}

export const columns: ColumnDef<UserRentTable>[] = [
    // {
    // id: "select",
    // header: ({ table }) => (
    //     <Checkbox
    //         checked={
    //             table.getIsAllPageRowsSelected() ||
    //             (table.getIsSomePageRowsSelected() && "indeterminate")
    //         }
    //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //         aria-label="Select all"
    //     />
    // ),
    // cell: ({ row }) => (
    //     <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //     />
    // ),
    // },
    {
        accessorKey: "image",
        header: "Gambar",
        cell: ({ row }) => (
            <div className="w-36 h-22 border border-border relative rounded overflow-hidden shadow-primary-foreground">
                <Image src={row.original.images[0].url} alt="rent_img" fill className="object-cover" />
            </div>
        )
    },
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "minStayDuration",
        header: "Format Bayar",
    },
    {
        accessorKey: "isAvailable",
        header: () => <p className="text-center">Status Rumah</p>,
        cell: ({ row }) => (
            <p className="text-center font-bold">
                {row.original.isAvailable ? "Tersedia" : "Terisi"}
            </p>
        )
    },
    {
        accessorKey: "isPublish",
        header: "Status",
    },
    {
        id: "action",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const data = row.original
            return (
                <TableButton id={data.id} />
            )
        }
    },
]
