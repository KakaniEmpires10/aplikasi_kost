import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import SubTableButton from "./sub-table-button"
import { formatCurrency } from "@/lib/utils"
import { Row } from "@tanstack/react-table"
import { UserKostTable } from "./column"

const SubTableKost = ({ row }: { row: Row<UserKostTable> }) => {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell></TableCell>
            <TableCell colSpan={row.getVisibleCells().length}>
                <h6 className="text-base font-semibold capitalize mt-4 px-4 py-3 bg-accent rounded shadow">☝️ Detail Kamar</h6>
                <Table className="mb-4">
                    <TableHeader className="bg-transparent">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-28 text-center">Gambar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                        {row.original.rooms.length > 0 ? row.original.rooms.map((room) => (
                            <TableRow key={room.id} className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent">
                                <TableCell className="py-4 w-28">
                                    <div className="w-20 h-12 border border-border relative rounded overflow-hidden shadow-primary-foreground">
                                        <Image src={room.images.length > 0 ? room.images[0].url : "/image/placeholder/img-placeholder.png"} alt="room_img" fill className="object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="space-y-2">
                                    <p className="font-semibold">{room.name}</p>
                                    <Badge variant={row.original.gender == "male" ? "primary_soft" : row.original.gender == "female" ? "destructive_soft" : "indigo"}>-</Badge>
                                </TableCell>
                                <TableCell>{formatCurrency(parseInt(room.price))}</TableCell>
                                <TableCell>{room.description}</TableCell>
                                <TableCell>
                                    {room.isAvailable ? (
                                        <Badge variant="success">Tersedia</Badge>
                                    ) : (
                                        <Badge variant="destructive_soft">Terisi</Badge>
                                    )}
                                </TableCell>
                                <TableCell><SubTableButton roomId={room.id} kostId={room.kostId} /></TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={row.getVisibleCells().length} className="text-center font-bold h-16">
                                    Data Kamar Tidak Ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableCell>
        </TableRow>
    )
}

export default SubTableKost