import { Button } from "@/components/ui/button"
import { PenLine, Trash2 } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import ModalDelete from "../modal/modal-delete";

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
                            <Button asChild variant="secondary" size="icon-sm">
                                <Link href={`/dashboard/rent/edit/${id}`}>
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