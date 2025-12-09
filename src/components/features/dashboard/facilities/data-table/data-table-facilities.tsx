"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ModalInsert from "../modal/modal-insert"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTableFacilities<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [openModal, setOpenModal] = useState(false)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    // const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        // onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            // rowSelection
        }
    })

    const handleChange = () => {
        setOpenModal(!openModal)
    }

    return (
        <>
            <Card className="p-4 flex-row justify-between items-center">
                <div className="relative">
                    <Input
                        className="pl-8"
                        type="search"
                        placeholder="Cari Fasilitas..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                    />
                    <Search className="absolute size-4 stroke-3 top-1/2 left-2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <Button onClick={handleChange}>
                    <PlusCircle /> Tambah Fasilitas
                </Button>
            </Card>
            <div className="overflow-hidden">
                <Table className="border-t-4 border-primary border-b-2 w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-20 text-center font-bold">
                                    Data Fasilitas Belum Ada
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <ModalInsert open={openModal} onOpenChange={handleChange} />
        </>
    )
}
