import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn, fetcher } from "@/lib/utils"
import { Row } from "@tanstack/react-table"
import { UserKostTable } from "./column"
import toast from "react-hot-toast"
import { updateCategory, updateFloor, updateGender, updateMinStay, updateName, updateStatus } from "@/action/kost-action"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, PenLine } from "lucide-react"
import useSWR from "swr"
import { PropertyCategory } from "@/db/schema"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const ColName = ({ row }: { row: Row<UserKostTable> }) => {
    const [loading, setLoading] = useState(false);
    const [openName, setOpenName] = useState(false);
    const [openGender, setOpenGender] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);
    const [openFloor, setOpenFloor] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const floorRef = useRef<HTMLInputElement>(null);

    const { data: kostCategories, isLoading: isLoadingkostCategories, error: isErrorkostCategories } = useSWR<PropertyCategory[]>('/api/property-categories?type=kost', fetcher, { revalidateOnFocus: false })

    const gender =
        row.original.gender === "male"
            ? "Laki-Laki"
            : row.original.gender === "female"
                ? "Perempuan"
                : "Pasutri";
    const category = row.original.category.name;
    const floorLevel = row.original.floorLevel;

    const handleChange = async (value: string, type: string) => {
        setLoading(true)
        let typeText = "";

        if (type == "name") typeText = "Nama Kost";
        if (type == "gender") typeText = "Gender Tujuan";
        if (type == "category") typeText = "Kategori Kost";
        if (type == "floor") typeText = "Jumlah Lantai";

        const toastId = toast.loading(`Mengubah ${typeText}...`)
        let res;
        const id = row.original.id

        if (type == "name") res = await updateName(id, value);
        if (type == "gender") res = await updateGender(id, value);
        if (type == "category") res = await updateCategory(id, parseInt(value))
        if (type == "floor") res = await updateFloor(id, parseInt(value))

        if (!res) {
            toast.error("Terjadi Kesalahan, Coba lagi nanti atau hubungi admin 🙏", { id: toastId })
            setLoading(false)
            return
        }

        if (!res.success) {
            toast.error(res.message, { id: toastId })
            setLoading(false)
            return
        }

        toast.success(res.message, { id: toastId })
        setLoading(false)
        if (type === "name") setOpenName(false)
        if (type === "gender") setOpenGender(false)
        if (type === "category") setOpenCategory(false)
        if (type === "floor") setOpenFloor(false)
    }

    return (
        <div className="space-y-4">
            <Popover open={openName} onOpenChange={setOpenName}>
                <div className="flex items-center gap-2">
                    <h6 className="capitalize font-semibold">{row.original.name}</h6>
                    <PopoverTrigger asChild>
                        <Button variant="secondary" className="h-5 w-2"><PenLine className="size-2.5" /></Button>
                    </PopoverTrigger>
                </div>
                <PopoverContent showArrow>
                    <Label className="mb-1.5">Ubah Nama Kost</Label>
                    <div className="flex gap-2">
                        <Input className="flex-1" disabled={loading} ref={nameRef} defaultValue={row.original.name} />
                        <Button
                            disabled={loading}
                            onClick={() => {
                                handleChange(nameRef.current?.value ?? "", "name")
                            }}
                            size="icon"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <PenLine />}
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            <div className="flex gap-1">
                <Popover open={openGender} onOpenChange={setOpenGender}>
                    <PopoverTrigger>
                        <Badge role="button" variant={gender === "Laki-Laki" ? "primary_soft" : gender === "Perempuan" ? "destructive_soft" : "indigo"} className="cursor-pointer transition-colors">{gender}</Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px]" showArrow>
                        <Label className="mb-2.5">Pilih Tujuan Gender</Label>
                        <Select defaultValue={row.original.gender!} onValueChange={(val) => handleChange(val, "gender")}>
                            <SelectTrigger disabled={loading} className="w-full">
                                <SelectValue placeholder="Pilih gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Gender</SelectLabel>
                                    <SelectItem value="male">Laki-laki</SelectItem>
                                    <SelectItem value="female">Perempuan</SelectItem>
                                    <SelectItem value="mix">Pasutri</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </PopoverContent>
                </Popover>
                <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger>
                        <Badge className={cn("capitalize cursor-pointer", category === "vip" ? "uppercase" : "")} variant={category === "vip" ? "warning" : "secondary"}>{category}</Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px]" showArrow>
                        <Label className="mb-2.5">Pilih Kategori Kost</Label>
                        {isLoadingkostCategories ? (
                            <div className="p-2 text-center text-muted-foreground">Memuat kategori...</div>
                        ) : isErrorkostCategories ? (
                            <div className="p-2 text-center text-destructive">Gagal memuat kategori</div>
                        ) : kostCategories && kostCategories.length > 0 ? (
                            <Select
                                value={String(row.original.category.id)}
                                onValueChange={(val) => handleChange(val, "category")}
                                disabled={loading}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Kategori</SelectLabel>
                                        {kostCategories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="p-2 text-center text-muted-foreground">Tidak ada kategori tersedia</div>
                        )}
                    </PopoverContent>
                </Popover>
                <Popover open={openFloor} onOpenChange={setOpenFloor}>
                    <PopoverTrigger>
                        <Badge variant="outline" className="cursor-pointer">{floorLevel} lantai</Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-[180px]" showArrow>
                        <Label className="mb-2.5">Ubah Jumlah Lantai</Label>
                        <div className="flex gap-2">
                            <Input className="flex-1" disabled={loading} type="number" ref={floorRef} defaultValue={row.original.floorLevel!} />
                            <Button
                                disabled={loading}
                                onClick={() => {
                                    handleChange(floorRef.current?.value ?? "", "floor")
                                }}
                                size="icon"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <PenLine />}
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export const ColFormat = ({ row }: { row: Row<UserKostTable> }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const formatRef = useRef<HTMLInputElement>(null)

    const handleChange = async (value: string) => {
        setLoading(true)
        const toastId = toast.loading(`Mengubah Format Pembayaran...`)

        const id = row.original.id

        const res = await updateMinStay(id, parseInt(value))

        if (!res) {
            toast.error("Terjadi Kesalahan, Coba lagi nanti atau hubungi admin 🙏", { id: toastId })
            setLoading(false)
            return
        }

        if (!res.success) {
            toast.error(res.message, { id: toastId })
            setLoading(false)
            return
        }

        toast.success(res.message, { id: toastId })
        setLoading(false)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Badge variant="outline" className="cursor-pointer">per-{row.getValue("minStayDuration")} bulan</Badge>
            </PopoverTrigger>
            <PopoverContent className="w-[180px]" showArrow>
                <Label className="mb-1.5">Ubah Format Bayar</Label>
                <p className="text-muted-foreground text-xs mb-2.5">Dalam Format Per Berapa Bulan</p>
                <div className="flex gap-2">
                    <Input className="flex-1" disabled={loading} type="number" ref={formatRef} defaultValue={row.original.minStayDuration!} />
                    <Button
                        disabled={loading}
                        onClick={() => {
                            handleChange(formatRef.current?.value ?? "")
                        }}
                        size="icon"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <PenLine />}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export const ColStatus = ({ row }: { row: Row<UserKostTable> }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = async (value: string) => {
        setLoading(true)
        const toastId = toast.loading(`Mengubah Status Kost...`)

        const id = row.original.id

        // Convert string to boolean
        const boolValue = value === "TRUE";

        const res = await updateStatus(id, boolValue)

        if (!res) {
            toast.error("Terjadi Kesalahan, Coba lagi nanti atau hubungi admin 🙏", { id: toastId })
            setLoading(false)
            return
        }

        if (!res.success) {
            toast.error(res.message, { id: toastId })
            setLoading(false)
            return
        }

        toast.success(res.message, { id: toastId })
        setLoading(false)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Badge variant={row.original.isPublish ? "success" : "secondary"} className="cursor-pointer">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    {row.original.isPublish ? "Publish" : "Draft"}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent showArrow className="dark p-2 text-xs text-center">
                                {row.original.isPublish
                                    ? "Kost Anda Sudah Bisa Dilihat Masyarakat Luas"
                                    : "Kost Masih Dalam Tahap Draft, belum terlihat oleh publik"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-[180px]" showArrow>
                <Label className="mb-1.5">Ubah Status Kost</Label>
                <Select
                    value={row.original.isPublish ? "TRUE" : "FALSE"}
                    onValueChange={handleChange}
                    disabled={loading}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="TRUE">Publish</SelectItem>
                            <SelectItem value="FALSE">Draft</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </PopoverContent>
        </Popover>
    )
}