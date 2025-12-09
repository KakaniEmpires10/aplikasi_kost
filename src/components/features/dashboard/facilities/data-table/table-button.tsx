import { Button } from "@/components/ui/button"
import { PenLine, Trash2 } from "lucide-react"
import { useState } from "react"
import ModalDelete from "../modal/modal-delete";
import { Facility } from "@/db/schema";
import ModalInsert from "../modal/modal-insert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TableButton = ({ data }: { data: Facility }) => {
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const handleDelete = () => {
        setOpenDelete(!openDelete)
    }

    const handleUpdate = () => {
        setOpenUpdate(!openUpdate)
    }

    return (
        <>
            <div className="flex items-center gap-1 justify-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={handleUpdate} size="icon-sm"><PenLine className="size-3" /></Button>
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

            <ModalInsert open={openUpdate} onOpenChange={handleUpdate} data={data} />
            <ModalDelete open={openDelete} onOpenChange={handleDelete} id={data.id} />
        </>
    )
}

export default TableButton