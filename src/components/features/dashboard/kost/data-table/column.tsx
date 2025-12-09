"use client"

import { Kost, PropertyCategory, KostImage, KostRoom, RoomImage } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
// import { Checkbox } from "@/components/ui/checkbox"
import TableButton from "./table-button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColFormat, ColName, ColStatus } from "./col-button";

type roomsWithImages = KostRoom & {
    images: RoomImage[];
}

export type UserKostTable = Kost & {
    images: KostImage[],
    category: Pick<PropertyCategory, "id" | "name">,
    rooms: roomsWithImages[]
}

export const columns: ColumnDef<UserKostTable>[] = [
    {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
            return row.getCanExpand() ? (
                <Button
                    {...{
                        className: "size-7 shadow-none text-muted-foreground",
                        onClick: row.getToggleExpandedHandler(),
                        "aria-expanded": row.getIsExpanded(),
                        "aria-label": row.getIsExpanded()
                            ? `Collapse details for ${row.original.name}`
                            : `Expand details for ${row.original.name}`,
                        size: "icon",
                        variant: "ghost",
                    }}
                >
                    <ChevronDownIcon
                        className={cn("opacity-80 transition-transform", row.getIsExpanded() && "-rotate-180")}
                        size={16}
                        aria-hidden="true"
                    />
                </Button>
            ) : undefined
        },
    },
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
                <Image src={row.original.images[0].url} alt="kos_img" fill className="object-cover" />
            </div>
        )
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => {
            return (
                <ColName row={row} />
            )
        }
    },
    {
        accessorKey: "minStayDuration",
        header: "Format Bayar",
        cell: ({ row }) => (
            <ColFormat row={row} />
        )
    },
    {
        accessorKey: "totalRooms",
        header: () => <p className="text-center">Jumlah Kamar</p>,
        cell: ({ row }) => (
            <div className="flex flex-col items-center gap-2">
                <p className="capitalize font-semibold">{row.getValue("totalRooms")} Kamar</p>
                <div className="space-x-1">
                    <Badge>{row.original.availableRooms} Tersedia</Badge>
                    <Badge variant="secondary">
                        {row.original.totalRooms - row.original.availableRooms} Terisi
                    </Badge>
                </div>
            </div>
        )
    },
    {
        accessorKey: "isAvailable",
        header: () => <p className="text-center">Status Kost</p>,
        cell: ({ row }) => (
            <p className="text-center font-bold">
                {row.original.isAvailable ? "Tersedia" : "Penuh"}
            </p>
        )
    },
    {
        accessorKey: "isPublish",
        header: "Status",
        cell: ({ row }) => (
            <ColStatus row={row} />
        )
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
