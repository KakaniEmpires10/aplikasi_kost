import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import FormFacility from "../form/form-facility"
import { propsDialogInsert } from "../facitity.constant"

const ModalInsert = ({ open, onOpenChange, data, dataClient ,swrKey }: propsDialogInsert) => {
  const isMobile = useIsMobile()

  const modalTitle = data ? "Edit Fasilitas" : "Tambah Fasilitas"
  const modalDesc = data ? "Edit Fasilitas jika masih belum sesuai" : "Tambah Fasilitas jika masih belum ada"

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
          <FormFacility open={open} onOpenChange={onOpenChange} data={data} dataClient={dataClient}  swrKey={swrKey} />
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
        <FormFacility open={open} onOpenChange={onOpenChange} data={data} dataClient={dataClient} swrKey={swrKey} />
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