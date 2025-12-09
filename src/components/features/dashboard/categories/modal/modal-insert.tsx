import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { propsDialogInsert } from "../categories.constant"
import FormCategories from "../form/form-categories"

const ModalInsert = ({ open, onOpenChange, data }: propsDialogInsert) => {
  const isMobile = useIsMobile()

  const modalTitle = data ? "Edit Tipe" : "Tambah Tipe"
  const modalDesc = data ? "Edit Tipe jika masih belum sesuai" : "Tambah Tipe jika masih belum ada"

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{ modalTitle }</DialogTitle>
            <DialogDescription>
              { modalDesc }
            </DialogDescription>
          </DialogHeader>
          <FormCategories open={open} onOpenChange={onOpenChange} data={data} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{ modalTitle }</DrawerTitle>
          <DrawerDescription>
            { modalDesc }
          </DrawerDescription>
        </DrawerHeader>
        <FormCategories open={open} onOpenChange={onOpenChange} data={data} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ModalInsert