import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { IconAlertCircle } from "@tabler/icons-react"
import { buttonVariants } from "@/components/ui/button"
import { propsDialogDelete } from "../kost.constant"
import { deleteKost } from "@/action/kost-action"

const ModalDelete = ({ id, open, onOpenChange }: propsDialogDelete) => {

    const handleDelete = async () => {
        toast.promise(
            deleteKost(id),
            {
                loading: 'Menghapus...',
                success: (success) => success?.message || "Kost Berhasil Dihapus",
                error: (err) => err.message || "Kost Gagal Dihapus",
            }
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader className="items-center">
                    <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <IconAlertCircle className="size-8 text-destructive" />
                    </div>
                    <AlertDialogTitle>Yakin Mau Menghapus Kost Ini?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Aksi ini tidak bisa di ulang kembali, tidak ada recycle bin dan tidak ada jin. Sekali hilang maka hilang selamanya
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2 sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleDelete}><Trash2 /> Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalDelete