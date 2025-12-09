"use client"

import { PropertyCategory } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import TableButton from "./table-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<PropertyCategory>[] = [
    {
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
        id: "Number",
        header: "No.",
        cell: ({ row }) => <span>{row.index + 1}</span>
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => <p className="font-bold capitalize">{row.getValue("name")}</p>
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => <p className="capitalize whitespace-normal text-xs">{row.getValue("description")}</p>
    },
    {
        accessorKey: "type",
        header: "Jenis",
        cell: ({ row }) => (
            <Badge
                className={cn("lowercase",
                    row.getValue("type") === "KOST"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : row.getValue("type") === "RENT"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                        : ""
                )}
            >
                {row.getValue("type")}
            </Badge>
        )
    },
    {
        id: "action",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const data = row.original
            return (
                <TableButton data={data} />
            )
        }
    },
]
