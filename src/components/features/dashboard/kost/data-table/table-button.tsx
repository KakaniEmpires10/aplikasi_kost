import { Button } from "@/components/ui/button"
import { PenLine, PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"
import ModalDelete from "../modal/modal-delete";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

const TableButton = ({ id }: { id: string }) => {
    const [openDelete, setOpenDelete] = useState(false);

    const handleDelete = () => {
        setOpenDelete(!openDelete)
    }

    return (
        <>
            <div className="flex items-center gap-1 justify-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild size="icon-sm">
                                <Link
                                    href={`/dashboard/kost/add-room?kostId=${id}`}
                                >
                                    <PlusCircle className="size-3" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark px-2 py-1 text-xs" showArrow>
                            Tambah Kamar
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="secondary" size="icon-sm">
                                <Link href={`/dashboard/kost/edit/${id}`}>
                                    <PenLine className="size-3" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark px-2 py-1 text-xs" showArrow>
                            Edit
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={handleDelete} size="icon-sm" variant="destructive"><Trash2 className="size-3" /></Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark px-2 py-1 text-xs" showArrow>
                            Hapus
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <ModalDelete open={openDelete} onOpenChange={handleDelete} id={id} />
        </>
    )
}

export default TableButton