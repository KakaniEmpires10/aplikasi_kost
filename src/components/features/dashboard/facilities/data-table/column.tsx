"use client"

import { Badge } from "@/components/ui/badge";
import { Facility } from "@/db/schema"
import { IconMap } from "@/lib/icon-mapper";
import { ColumnDef } from "@tanstack/react-table"
// import { Checkbox } from "@/components/ui/checkbox"
import TableButton from "./table-button";

export const columns: ColumnDef<Facility>[] = [
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
        accessorKey: "icon",
        header: "Icon",
        cell: ({ row }) => {
            const iconName = row.getValue('icon') as string;
            const IconComponent = IconMap[iconName as keyof typeof IconMap];

            return IconComponent ? <IconComponent /> : null;
        }
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => <p className="font-bold capitalize">{ row.getValue("name") }</p>
    },
    {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => {
            const val = row.getValue('category') as string;

            return (
                <Badge variant="outline" className="capitalize">{val.toLocaleLowerCase()}</Badge>
            )
        }
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
