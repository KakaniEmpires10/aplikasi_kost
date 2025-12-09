import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { IconAlertCircleFilled } from "@tabler/icons-react"
import { buttonVariants } from "@/components/ui/button"
import { propsDialogDelete } from "../categories.constant"
import { deletePropertyCategories } from "@/action/categories-action"

const ModalDelete = ({ id, open, onOpenChange }: propsDialogDelete) => {

    const handleDelete = async () => {
        toast.promise(
            deletePropertyCategories(id),
            {
                loading: 'Menghapus...',
                success: "Tipe/Kategori Berhasil Dihapus",
                error: "Tipe/Kategori Gagal Dihapus",
            }
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <IconAlertCircleFilled className="size-8" />
                    <AlertDialogTitle>Yakin Mau Menghapus Tipe Ini?</AlertDialogTitle>
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