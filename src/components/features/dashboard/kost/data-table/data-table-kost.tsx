"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
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
import { Info, PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Fragment, useState } from "react"
import Link from "next/link"
import { UserKostTable } from "./column"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import SubTableKost from "./sub-table-kost"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTableKost<TData extends UserKostTable, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    // const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getRowCanExpand: (row) => Boolean(row.original),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        // onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            // rowSelection
        }
    })

    return (
        <>
            <Card className="p-4 flex-row justify-between items-center">
                <div className="relative">
                    <Input
                        className="pl-8"
                        type="search"
                        placeholder="Cari Kost..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                    />
                    <Search className="absolute size-4 stroke-3 top-1/2 left-2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <Button asChild>
                    <Link href="/dashboard/kost/add-kost">
                        <PlusCircle /> Tambah Kost
                    </Link>
                </Button>
            </Card>

            <Alert variant="primary-soft">
                <Info />
                <AlertTitle>Tips</AlertTitle>
                <AlertDescription>
                    <p>Anda bisa merubah beberapa hal yang tampak di tampilan bawah ini dengan meng-klik data terkait <br /> seperti: <strong>kos laki-laki</strong> menjadi <strong>kos wanita</strong></p>
                </AlertDescription>
            </Alert>

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
                                <Fragment key={row.id}>
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
                                    {row.getIsExpanded() && (
                                        <SubTableKost row={row} />
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-20 text-center font-bold">
                                    Kost Tidak Ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}