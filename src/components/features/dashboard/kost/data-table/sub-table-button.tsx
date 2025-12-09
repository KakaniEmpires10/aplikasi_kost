import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PenLine, Trash2 } from "lucide-react"
import { useState } from "react"
import ModalRoomDelete from "../modal/modal-room-delete"

const SubTableButton = ({ roomId, kostId }: { roomId: string, kostId: string }) => {
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
                            <Button onClick={handleUpdate} variant="secondary" size="icon-sm">
                                <PenLine className="size-3" />
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
            <ModalRoomDelete kostId={kostId} roomId={roomId} open={openDelete} onOpenChange={handleDelete} />
        </>
    )
}

export default SubTableButton