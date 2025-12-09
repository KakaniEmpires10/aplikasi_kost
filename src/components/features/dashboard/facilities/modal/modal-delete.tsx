import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { propsDialogDelete } from "../facitity.constant"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { deleteFacilities } from "@/action/facilities-action"
import { IconAlertCircleFilled } from "@tabler/icons-react"
import { buttonVariants } from "@/components/ui/button"

const ModalDelete = ({ id, open, onOpenChange }: propsDialogDelete) => {

    const handleDelete = async () => {
        toast.promise(
            deleteFacilities(id),
            {
                loading: 'Menghapus...',
                success: "Fasilitas Berhasil Dihapus",
                error: "Fasilitas Gagal Dihapus",
            }
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <IconAlertCircleFilled className="size-8" />
                    <AlertDialogTitle>Yakin Mau Menghapus Fasilitas Ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Aksi ini tidak bisa di ulang kembali, tidak ada recycle bin dan tidak ada jin. Sekali hilang maka hilang selamanya
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleDelete}><Trash2 /> Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalDelete