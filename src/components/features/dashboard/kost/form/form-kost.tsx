"use client"

import {
    useFieldArray,
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    Textarea
} from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertCircleIcon, Check, ChevronsUpDown, CircleAlert, ImageIcon, LoaderCircle, Map, MinusCircle, PlusCircle, Save, Trash2, UploadIcon, XIcon } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn, fetcher } from "@/lib/utils"
import { useFileUpload } from "@/hooks/use-file-upload"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Facility, PropertyCategory } from "@/db/schema"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useSWR from "swr"
import ModalInsert from "../../facilities/modal/modal-insert"
import { City, District, kostSchema, Province, rules_placeholder, Village } from "../kost.constant"
import toast from "react-hot-toast"
import { createKost } from "@/action/kost-action"
import { useRouter } from "next/navigation"
import { rollbackUploadsClient, uploadToCloudinaryClient } from "@/lib/image-uploader-client"
import { UploadedImage } from "@/lib/image-uploader"

export default function FormKost() {
    const [provinces, setProvinces] = useState<Province[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [villages, setVillages] = useState<Village[]>([])
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
    const [isLoadingCities, setIsLoadingCities] = useState(false)
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
    const [isLoadingVillages, setIsLoadingVillages] = useState(false)

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState("")
    const [swrKey, setSwrKey] = useState("")

    const router = useRouter();

    const handleDialogType = ({ type, key }: { type: string, key: string }) => {
        setDialogType(type);
        setSwrKey(key)
    }

    const handleChange = () => setOpenDialog(!openDialog);

    const maxSizeMB = 5
    const maxSize = maxSizeMB * 1024 * 1024 // 5MB default
    const maxFiles = 6

    const [
        { files: filesFeatured, isDragging: isDraggingFeatured, errors: errorsFeatured },
        {
            handleDragEnter: handleDragEnterFeatured,
            handleDragLeave: handleDragLeaveFeatured,
            handleDragOver: handleDragOverFeatured,
            handleDrop: handleDropFeatured,
            openFileDialog: openFileDialogFeatured,
            removeFile: removeFileFeatured,
            getInputProps: getInputPropsFeatured,
        },
    ] = useFileUpload({
        accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/webp",
        maxSize,
    })

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/webp",
        maxSize,
        multiple: true,
        maxFiles,
    })

    const form = useForm<z.infer<typeof kostSchema>>({
        resolver: zodResolver(kostSchema),
        defaultValues: {
            kost_name: "",
            total_rooms: 0,
            available_rooms: 0,
            gender: 'male',
            check_in_time: "00.00",
            check_out_time: "00.00",
            floor_level: 1,
            general_facilies: [],
            private_facilies: [],
            kost_description: "",
            kost_type: "1",
            address: "",
            province: "11",
            city: "1171",
            district: "",
            village: "",
            rules: [
                { value: "" },
                { value: "" },
            ],
            latitude: 5.5587044039,
            longitude: 95.3277134583,
            room_price: "",
            room_name: "",
            deposit: "",
            min_stay: "",
            room_size: "",
            room_type: "1",
            max_occupants: "bebas",
            isPublish: false
        },
        mode: "onChange",
    })

    const { fields, prepend, remove } = useFieldArray({
        name: "rules",
        control: form.control,
    })

    const previewUrlFeatured = filesFeatured[0]?.preview || null

    const type = form.watch("kost_type");
    const duration = form.watch("min_stay");
    const watchProvince = form.watch('province')
    const watchCity = form.watch('city')
    const watchDistrict = form.watch('district')

    const { data: generalFacilities, isLoading: isLoadingGeneralFacilities, error: isErrorGeneralFacilities } = useSWR<Facility[]>('/api/facilities?type=umum', fetcher, { revalidateOnFocus: false })

    const { data: personalFacilities, isLoading: isLoadingPersonalFacilities, error: isErrorPersonalFacilities } = useSWR<Facility[]>('/api/facilities?type=pribadi', fetcher, { revalidateOnFocus: false })

    const { data: kostCategories, isLoading: isLoadingkostCategories, error: isErrorkostCategories } = useSWR<PropertyCategory[]>('/api/property-categories?type=kost', fetcher, { revalidateOnFocus: false })

    // set room type based on kost type
    useEffect(() => {
        form.setValue("room_type", type);
    }, [type, form]);

    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('/api/provinces')
                const data = await res.json()

                setProvinces(data)
            } catch (error) {
                console.error('Failed to fetch provinces:', error)
            } finally {
                setIsLoadingProvinces(false)
            }
        }

        fetchProvinces()
    }, [])

    // Fetch cities when province changes (or on initial load)
    useEffect(() => {
        if (!watchProvince) return

        const fetchCities = async () => {
            setIsLoadingCities(true)
            try {
                const res = await fetch(`/api/cities?provinceId=${watchProvince}`)
                const data = await res.json()
                setCities(data)
            } catch (error) {
                console.error('Failed to fetch cities:', error)
            } finally {
                setIsLoadingCities(false)
            }
        }

        fetchCities()
    }, [watchProvince])

    // Fetch districts when city changes
    useEffect(() => {
        if (!watchCity) return

        const fetchDistricts = async () => {
            setIsLoadingDistricts(true)
            try {
                const res = await fetch(`/api/districts?cityId=${watchCity}`)
                const data = await res.json()
                setDistricts(data)
            } catch (error) {
                console.error('Failed to fetch districts:', error)
            } finally {
                setIsLoadingDistricts(false)
            }
        }

        fetchDistricts()
    }, [watchCity])

    useEffect(() => {
        if (!watchDistrict) return

        const fetchVillages = async () => {
            setIsLoadingVillages(true)
            try {
                const res = await fetch(`/api/villages?districtId=${watchDistrict}`)
                const data = await res.json()
                setVillages(data)
            } catch (error) {
                console.error("gagal mengambil desa: ", error)
            } finally {
                setIsLoadingVillages(false)
            }
        }

        fetchVillages()
    }, [watchDistrict])
    console.log(form.formState.errors);
    async function onSubmit(values: z.infer<typeof kostSchema>) {
        // Verifikasi gambar: harus ada gambar utama yang diupload
        if (filesFeatured.length === 0) {
            toast.error("Silahkan upload gambar utama terlebih dahulu")
            return
        };

        // Verifikasi gambar: harus ada gambar kost yang di upload setidaknya 1
        if (files.length === 0) {
            toast.error("Silahkan upload setidaknya 1 gambar kost terlebih dahulu")
            return
        };

        const uploadToastId = toast.loading("Memulai proses upload...");

        // 1. tracked uploaded image
        const uploadedFiles: UploadedImage[] = [];

        toast.loading("Mengupload gambar utama...", { id: uploadToastId });
        // 2. Upload featured image first
        const featuredUploadResult = await uploadToCloudinaryClient(filesFeatured[0]?.file as File, "kost-featured");

        if (!featuredUploadResult.success || !featuredUploadResult.result) {
            toast.error("Gagal mengupload gambar utama", { id: uploadToastId });
            return;
        }

        const featuredImageUrl = featuredUploadResult.result?.secure_url;
        const featuredPublicId = featuredUploadResult.result?.public_id;

        uploadedFiles.push({ url: featuredImageUrl, publicId: featuredPublicId });

        toast.loading(`Mengupload gambar kost (0/${files.length})...`, { id: uploadToastId })
        // 3. Upload other images
        const imageUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const imageFile = files[i];
            toast.loading(`Mengupload gambar kost (${i + 1}/${files.length})`, { id: uploadToastId })

            const uploadResult = await uploadToCloudinaryClient(imageFile.file as File, "kost-images");

            if (!uploadResult.success || !uploadResult.result) {
                // If any upload fails, delete all previously uploaded images and return error
                await rollbackUploadsClient(uploadedFiles);
                toast.error("Gagal mengupload salah satu gambar kost", { id: uploadToastId });
                return;
            }

            const imageUrl = uploadResult.result.secure_url;
            const publicId = uploadResult.result.public_id;

            imageUrls.push(imageUrl);
            uploadedFiles.push({ url: imageUrl, publicId });
        }

        // 4. bind images with values
        const dataToSubmit = {
            ...values,
            featured_image: featuredImageUrl,
            images: imageUrls
        };

        toast.loading("Menyimpan Kost & Menambah Kamar...", { id: uploadToastId })
        // 5. Create kost
        const res = await createKost(dataToSubmit);

        if (!res) {
            toast.error("terjadi kesalahan, silahkan coba lagi atau hubungi admin 🙏", { id: uploadToastId });
            return
        }

        if (!res.success) {
            // If create kost fails, delete all uploaded images
            await rollbackUploadsClient(uploadedFiles);
            toast.error(res.message, { id: uploadToastId });
        }

        toast.success(res.message, { id: uploadToastId });

        // 6. Reset form
        form.reset()

        // 7. Redirect to kost list page
        router.push("/dashboard/kost");
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum</CardTitle>
                            <CardDescription>Lengkapi data penting mengenai properti kost Anda untuk menarik calon penyewa yang tepat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                                <FormField
                                    control={form.control}
                                    name="kost_name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                            <FormLabel>Nama Kost</FormLabel>
                                            <FormDescription>Tuliskan nama properti sesuai yang dikenal masyarakat atau sesuai papan nama.</FormDescription>
                                            <FormControl>
                                                <Input
                                                    placeholder="Kost Cowok Banda..."
                                                    type="text"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="total_rooms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jumlah Kamar</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="available_rooms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kamar Tersedia</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="floor_level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jumlah lantai</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="check_in_time"
                                render={({ field }) => (
                                    <FormItem className="hidden">
                                        <FormLabel>Waktu Check-in</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="hidden"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="check_out_time"
                                render={({ field }) => (
                                    <FormItem className="hidden">
                                        <FormLabel>Waktu Check-out</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="hidden"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <FormDescription>
                                            Untuk Siapakah Kost Anda ini?
                                        </FormDescription>
                                        <FormMessage />
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-10"
                                        >
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:grayscale-0 [&:has([data-state=checked])>div>span]:font-bold cursor-pointer">
                                                    <FormControl>
                                                        <RadioGroupItem value="male" className="sr-only" />
                                                    </FormControl>
                                                    <div className="space-y-2 text-center rounded-md p-1 grayscale">
                                                        <Image src="/male_option.svg" width={80} height={80} alt="img-gender-male" />
                                                        <span className="font-thin text-xs">Pria</span>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:grayscale-0 [&:has([data-state=checked])>div>span]:font-bold cursor-pointer">
                                                    <FormControl>
                                                        <RadioGroupItem value="female" className="sr-only" />
                                                    </FormControl>
                                                    <div className="space-y-2 text-center rounded-md p-1 grayscale">
                                                        <Image src="/female_option.svg" width={80} height={80} alt="img-gender-male" />
                                                        <span className="font-thin text-xs">Wanita</span>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:grayscale-0 [&:has([data-state=checked])>div>span]:font-bold cursor-pointer">
                                                    <FormControl>
                                                        <RadioGroupItem value="mix" className="sr-only" />
                                                    </FormControl>
                                                    <div className="space-y-2 text-center rounded-md p-1 grayscale">
                                                        <Image src="/mix_option.svg" width={70} height={80} alt="img-gender-male" />
                                                        <span className="font-thin text-xs">Pasutri</span>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kost_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-2">Tipe Kost</FormLabel>
                                        <FormMessage />
                                        {isLoadingkostCategories ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Array.from({ length: 2 }).map((_, idx) => (
                                                    <Skeleton key={idx} className="h-24 rounded-md" />
                                                ))}
                                            </div>
                                        ) : isErrorkostCategories ? (
                                            <div role="alert" className="rounded-md border px-4 py-3">
                                                <p className="text-sm">
                                                    <CircleAlert
                                                        className="me-3 -mt-0.5 inline-flex text-red-500"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                    Terjadi Error Dalam Pengambilan Data Kategori Kost. Coba lagi dalam beberapa saat atau hubungi admin 🙏
                                                </p>
                                            </div>
                                        ) : kostCategories && kostCategories.length > 0 ? (
                                            <RadioGroup
                                                className="grid grid-cols-1 md:grid-cols-2"
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                {kostCategories.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                                                    >
                                                        <RadioGroupItem
                                                            value={String(category.id)}
                                                            id={String(category.id)}
                                                            aria-describedby={`${category.id}-description`}
                                                            className="order-1 after:absolute after:inset-0"
                                                        />
                                                        <div className="grid grow gap-2">
                                                            <Label htmlFor={String(category.id)} className="capitalize">
                                                                {category.name}
                                                            </Label>
                                                            <p
                                                                id={`${category.id}-description`}
                                                                className="text-muted-foreground text-xs"
                                                            >
                                                                {category.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        ) : (
                                            <div className="text-muted-foreground text-xs">Kategori kost tidak tersedia.</div>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="general_facilies"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-base mb-4">Fasilitas Umum</FormLabel>
                                        <FormMessage />
                                        {isLoadingGeneralFacilities &&
                                            Array.from({ length: 2 }).map((_, index) => (
                                                <React.Fragment key={index}>
                                                    <Skeleton className="rounded-lg h-4" />
                                                </React.Fragment>
                                            ))}
                                        {isErrorGeneralFacilities && (
                                            <div role="alert" className="rounded-md border px-4 py-3">
                                                <p className="text-sm">
                                                    <CircleAlert
                                                        className="me-3 -mt-0.5 inline-flex text-red-500"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                    Terjadi Error Dalam Pengambilan Data. Coba lagi dalam beberapa saat atau hubungi admin 🙏
                                                </p>
                                            </div>
                                        )}
                                        {generalFacilities && (
                                            <>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {generalFacilities.map(item => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="general_facilies"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={item.id}
                                                                        className="flex items-center space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(String(item.id))}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, String(item.id)])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value !== String(item.id)
                                                                                            )
                                                                                        )
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal capitalize">
                                                                            {item.name}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mx-auto mt-8">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={() => { handleChange(); handleDialogType({ type: "UMUM", key: "/api/facilities?type=umum" }) }}
                                                                >
                                                                    <PlusCircle />Tambah Lainnya
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom" showArrow className="dark">
                                                                Tambah Jika Belum Ada
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kost_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormDescription>Tulis penjelasan ringkas yang menonjolkan kelebihan kost, seperti fasilitas, lingkungan, dan kenyamanan.</FormDescription>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Deskripsi Kost..."
                                                className="resize-none min-h-40"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <div className="flex justify-between items-end gap-2">
                                    <div>
                                        <FormLabel>
                                            Peraturan <span className="text-xs text-muted-foreground">(Opsional)</span>
                                        </FormLabel>
                                        <FormDescription>
                                            Tuliskan peraturan khusus yang berlaku di kost Anda
                                        </FormDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        className="mt-2"
                                        onClick={() => prepend({ value: "" })}
                                    >
                                        <PlusCircle />
                                    </Button>
                                </div>
                                {fields.map((field, index) => (
                                    <FormField
                                        control={form.control}
                                        key={field.id}
                                        name={`rules.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-end gap-2">
                                                    <FormControl>
                                                        <Input placeholder={rules_placeholder[index]} {...field} />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="mt-2"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <MinusCircle />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Lokasi</CardTitle>
                            <CardDescription>Lengkapi data penting mengenai properti kost Anda untuk menarik calon penyewa yang tepat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative flex items-center justify-center h-80 rounded-lg overflow-hidden border border-input border-dashed shadow-sm">
                                <div className="text-xl font-bold flex items-center gap-2"><Map /> Map Akan di taruh disini</div>
                            </div>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel>Alamat</FormLabel>
                                        <FormDescription>Tuliskan Alamat Kost Anda</FormDescription>
                                        <FormControl>
                                            <Input
                                                placeholder="Jl. Ahmad Yani,. ..."
                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormLabel>Provinsi</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="w-full justify-between bg-gray-50 capitalize"
                                                        >
                                                            {isLoadingProvinces
                                                                ? "Loading..."
                                                                : provinces.find((province) => province.id === field.value)?.name.toLocaleLowerCase() || "Aceh"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="popover-content-width-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Cari Provinsi..." />
                                                        <CommandEmpty>Provinsi tidak ditemukan</CommandEmpty>
                                                        <CommandGroup>
                                                            {provinces.map((province) => (
                                                                <CommandItem
                                                                    key={province.id}
                                                                    value={province.id}
                                                                    className="capitalize"
                                                                    onSelect={() => {
                                                                        form.setValue("province", province.id);
                                                                        form.setValue("latitude", Number(province.latitude));
                                                                        form.setValue("longitude", Number(province.longitude));
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            province.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {province.name.toLocaleLowerCase()}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* City Selection - Limited to Banda Aceh and Aceh Besar */}
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kabupaten / Kota</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between capitalize",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                            disabled={isLoadingCities}
                                                        >
                                                            {isLoadingCities
                                                                ? "Loading Kota..."
                                                                : field.value
                                                                    ? cities.find((city) => city.id === field.value)?.name.toLocaleLowerCase()
                                                                    : "Pilih Kabupaten / kota"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="popover-content-width-full p-0">
                                                    <Command
                                                        filter={(value, search) => {
                                                            const name = value.split('@')[1].toLowerCase().trim();
                                                            if (name.includes(search)) return 1
                                                            return 0
                                                        }}
                                                    >
                                                        <CommandInput placeholder="Cari Kabupaten..." />
                                                        <CommandEmpty>Kabupaten / kota tidak ditemukan</CommandEmpty>
                                                        <CommandGroup>
                                                            {cities.map((city) => (
                                                                <CommandItem
                                                                    key={city.id}
                                                                    value={city.id + "@" + city.name}
                                                                    className="capitalize"
                                                                    onSelect={() => {
                                                                        form.setValue("city", city.id);
                                                                        form.setValue("latitude", Number(city.latitude));
                                                                        form.setValue("longitude", Number(city.longitude));
                                                                        // Clear district when city changes
                                                                        form.setValue("district", "");
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            city.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {city.name.toLocaleLowerCase()}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* District Selection */}
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kecamatan</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                            disabled={!watchCity || isLoadingDistricts}
                                                        >
                                                            {!watchCity
                                                                ? "Pilih Kabupaten / Kota dulu"
                                                                : isLoadingDistricts
                                                                    ? "Loading Kecamatan..."
                                                                    : field.value
                                                                        ? districts.find((district) => district.id === field.value)?.name
                                                                        : "Pilih kecamatan"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="popover-content-width-full p-0">
                                                    <Command
                                                        filter={(value, search) => {
                                                            const name = value.split('@')[1].toLowerCase().trim();
                                                            if (name.includes(search)) return 1
                                                            return 0
                                                        }}
                                                    >
                                                        <CommandInput placeholder="Search district..." />
                                                        <CommandEmpty>Kecamatan tidak ditemukan</CommandEmpty>
                                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                                            {districts.map((district) => (
                                                                <CommandItem
                                                                    key={district.id}
                                                                    value={district.id + "@" + district.name}
                                                                    onSelect={() => {
                                                                        form.setValue("district", district.id);
                                                                        form.setValue("latitude", Number(district.latitude));
                                                                        form.setValue("longitude", Number(district.longitude));
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            district.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {district.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="village"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Desa</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                            disabled={!watchDistrict || isLoadingVillages}
                                                        >
                                                            {!watchDistrict
                                                                ? "Pilih Kecamatan dulu"
                                                                : isLoadingVillages
                                                                    ? "Loading Desa..."
                                                                    : field.value
                                                                        ? villages.find((village) => village.id === field.value)?.name
                                                                        : "Pilih Desa"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="popover-content-width-full p-0">
                                                    <Command
                                                        filter={(value, search) => {
                                                            const name = value.split('@')[1].toLowerCase().trim();
                                                            if (name.includes(search)) return 1
                                                            return 0
                                                        }}
                                                    >
                                                        <CommandInput placeholder="Search Desa..." />
                                                        <CommandEmpty>Desa tidak ditemukan</CommandEmpty>
                                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                                            {villages.map((village) => (
                                                                <CommandItem
                                                                    key={village.id}
                                                                    value={village.id + "@" + village.name}
                                                                    onSelect={() => {
                                                                        form.setValue("village", village.id);
                                                                        form.setValue("latitude", Number(village.latitude));
                                                                        form.setValue("longitude", Number(village.longitude));
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            village.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {village.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="latitude dari gmap..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="longitude dari gmap..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Gambar</CardTitle>
                            <CardDescription>Unggah minimal satu foto tampak depan atau bagian dalam kost. Tampilan yang bersih dan terang akan menarik lebih banyak penyewa.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid gap-2">
                                <Label htmlFor="kost_img_featured">Upload Gambar Utama</Label>
                                <p className="text-muted-foreground text-xs italic">
                                    Gambar ini akan menjadi <strong>Gambar Utama</strong> yang pertama kali dilihat calon penyewa di halaman pencarian
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    📌 <i>Tips</i>:
                                </p>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    <li>Ambil dari sudut terbaik (misalnya dari depan gerbang atau jalan)</li>
                                    <li>Sertakan tampak lantai jika kos bertingkat</li>
                                    <li>Disarankan tanpa filter agar terlihat realistis</li>
                                </ul>
                                <div className="flex flex-col gap-2">
                                    <div className="relative">
                                        {/* Drop area */}
                                        <div
                                            onDragEnter={handleDragEnterFeatured}
                                            onDragLeave={handleDragLeaveFeatured}
                                            onDragOver={handleDragOverFeatured}
                                            onDrop={handleDropFeatured}
                                            data-dragging={isDraggingFeatured || undefined}
                                            className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
                                        >
                                            <input
                                                id="kost_img_featured"
                                                {...getInputPropsFeatured()}
                                                className="sr-only"
                                                aria-label="Upload image file"
                                            />
                                            {previewUrlFeatured ? (
                                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={previewUrlFeatured}
                                                        alt={filesFeatured[0]?.file?.name || "Uploaded image"}
                                                        className="mx-auto w-full max-h-full rounded object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                                    <div
                                                        className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                                        aria-hidden="true"
                                                    >
                                                        <ImageIcon className="size-4 opacity-60" />
                                                    </div>
                                                    <p className="mb-1.5 text-sm font-medium">Tarik Gambar Kemari</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        SVG, PNG, JPG or WEBP (max. {maxSizeMB}MB)
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mt-4"
                                                        onClick={openFileDialogFeatured}
                                                    >
                                                        <UploadIcon
                                                            className="-ms-1 size-4 opacity-60"
                                                            aria-hidden="true"
                                                        />
                                                        Pilih Gambar Utama
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {previewUrlFeatured && (
                                            <div className="absolute top-4 right-4">
                                                <button
                                                    type="button"
                                                    className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                                                    onClick={() => removeFileFeatured(filesFeatured[0]?.id)}
                                                    aria-label="Remove image"
                                                >
                                                    <XIcon className="size-4" aria-hidden="true" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {errorsFeatured.length > 0 && (
                                        <div
                                            className="text-destructive flex items-center gap-1 text-xs"
                                            role="alert"
                                        >
                                            <AlertCircleIcon className="size-3 shrink-0" />
                                            <span>{errorsFeatured[0]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kost_img_multiple">Upload Gambar Kost</Label>
                                <p className="text-muted-foreground text-xs italic">
                                    Unggah foto-foto detail dari bagian dalam dan fasilitas kos, seperti: <strong>kamar tidur, kamar mandi, dapur, ruang bersama, halaman, parkiran, dan fasilitas tambahan lainnya.</strong> Semakin lengkap dan jernih fotonya, semakin besar peluang kos Anda dilirik
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    📌 <i>Tips</i>:
                                </p>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    <li>Ambil foto siang hari dengan pencahayaan natural</li>
                                    <li>Gunakan rasio horizontal (landscape) agar tampilan maksimal</li>
                                    <li>Hindari sudut sempit yang membuat ruangan terlihat kecil</li>
                                </ul>
                                <div className="flex flex-col gap-2">
                                    {/* Drop area */}
                                    <div
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        data-dragging={isDragging || undefined}
                                        data-files={files.length > 0 || undefined}
                                        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
                                    >
                                        <input
                                            id="kost_img_multiple"
                                            {...getInputProps()}
                                            className="sr-only"
                                            aria-label="Upload image file"
                                        />
                                        {files.length > 0 ? (
                                            <div className="flex w-full flex-col gap-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="truncate text-sm font-medium">
                                                        ({files.length}) Gambar Di-Upload
                                                    </h3>
                                                    <div className="space-x-2">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => files.forEach(file => removeFile(file.id))}
                                                            disabled={files.length === 0}
                                                        >
                                                            <Trash2 className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                                                            Hapus Semua
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={openFileDialog}
                                                            disabled={files.length >= maxFiles}
                                                        >
                                                            <UploadIcon
                                                                className="-ms-0.5 size-3.5 opacity-60"
                                                                aria-hidden="true"
                                                            />
                                                            Tambah Lagi
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                                    {files.map((file) => (
                                                        <div
                                                            key={file.id}
                                                            className="bg-accent relative aspect-square rounded-md"
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={file.preview}
                                                                alt={file.file.name}
                                                                className="size-full rounded-[inherit] object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => removeFile(file.id)}
                                                                size="icon"
                                                                className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                                                aria-label="Remove image"
                                                            >
                                                                <XIcon className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                                <div
                                                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                                    aria-hidden="true"
                                                >
                                                    <ImageIcon className="size-4 opacity-60" />
                                                </div>
                                                <p className="mb-1.5 text-sm font-medium">Tarik Gambar Kemari</p>
                                                <p className="text-muted-foreground text-xs">
                                                    SVG, PNG, JPG or WEBP (max. {maxSizeMB}MB)
                                                </p>
                                                <Button type="button" variant="outline" className="mt-4" onClick={openFileDialog}>
                                                    <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                                                    Pilih Gambar
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {errors.length > 0 && (
                                        <div
                                            className="text-destructive flex items-center gap-1 text-xs"
                                            role="alert"
                                        >
                                            <AlertCircleIcon className="size-3 shrink-0" />
                                            <span>{errors[0]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Kamar</CardTitle>
                            <CardDescription>Lengkapi data penting mengenai properti kost Anda untuk menarik calon penyewa yang tepat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="room_name"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Nama Kamar</FormLabel>
                                        <FormDescription>Tuliskan nama kamar anda ( opsional dan bisa di edit lagi nanti )</FormDescription>
                                        <FormControl>
                                            <Input
                                                placeholder="Kamar Melati..."
                                                {...field} />
                                        </FormControl>
                                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                                            <span className="mb-1 block"><strong>Catatan:</strong></span>
                                            <li>
                                                Jika Nama Kamar diisi dengan contoh &quot;Kamar Melati&quot;, maka sistem akan men-generate kamar sebanyak jumlah kamar dengan nama kamar melati-1, kamar melati 2, dst...
                                            </li>
                                            <li>
                                                Jika Nama Kamar tidak diisi, maka sistem akan men-generate kamar sebanyak jumlah kamar dan memberikan nama kamar tersebut nama generik yaitu kamar-1, kamar-2, dst...
                                            </li>
                                        </ul>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="room_type"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 sm:col-span-3">
                                        <FormLabel>Tipe Kamar</FormLabel>
                                        {isLoadingkostCategories ? (
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        ) : isErrorkostCategories ? (
                                            <div role="alert" className="rounded-md border px-4 py-3">
                                                <p className="text-sm flex items-center gap-2">
                                                    <CircleAlert className="text-red-500" size={16} />
                                                    Terjadi Error Dalam Pengambilan Data Kategori Kamar. Coba lagi dalam beberapa saat atau hubungi admin 🙏
                                                </p>
                                            </div>
                                        ) : kostCategories && kostCategories.length > 0 ? (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full capitalize">
                                                        <SelectValue placeholder="Kategori" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {kostCategories.map((category) => (
                                                        <SelectItem key={category.id} className="capitalize" value={String(category.id)}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="text-muted-foreground text-xs">Kategori kamar tidak tersedia.</div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="room_size"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Ukuran Kamar</FormLabel>
                                        <FormDescription>Panjang dan lebar kamar dalam meter</FormDescription>
                                        <FormControl>
                                            <Input
                                                placeholder="6 x 6..."
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="private_facilies"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="mb-4">Fasilitas Pribadi</FormLabel>
                                        <FormMessage />
                                        {isLoadingPersonalFacilities &&
                                            Array.from({ length: 2 }).map((_, index) => (
                                                <React.Fragment key={index}>
                                                    <Skeleton className="rounded-lg h-4" />
                                                </React.Fragment>
                                            ))}
                                        {isErrorPersonalFacilities && (
                                            <div role="alert" className="rounded-md border px-4 py-3">
                                                <p className="text-sm">
                                                    <CircleAlert
                                                        className="me-3 -mt-0.5 inline-flex text-red-500"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                    Terjadi Error Dalam Pengambilan Data. Coba lagi dalam beberapa saat atau hubungi admin 🙏
                                                </p>
                                            </div>
                                        )}
                                        {personalFacilities && (
                                            <>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {personalFacilities.map(item => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="private_facilies"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={item.id}
                                                                        className="flex items-center space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(String(item.id))}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, String(item.id)])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value !== String(item.id)
                                                                                            )
                                                                                        )
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="capitalize">
                                                                            {item.name}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mx-auto mt-8">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={() => { handleChange(); handleDialogType({ type: "PRIBADI", key: "/api/facilities?type=pribadi" }) }}
                                                                >
                                                                    <PlusCircle />Tambah Lainnya
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom" showArrow className="dark">
                                                                Tambah Jika Belum Ada
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="min_stay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Format Pembayaran</FormLabel>
                                        <FormMessage />
                                        <div className="px-6 py-2 border-l-4 border-l-primary">
                                            <FormDescription>Berapa lama minimal sewa kost ini</FormDescription>
                                            <span className="text-xs text-muted-foreground">Cara Mengisi: <br />
                                                <ul className="list-disc list-inside">
                                                    <li>per bulan -&gt; 1</li>
                                                    <li>per 6 bulan -&gt; 6</li>
                                                    <li>per tahun -&gt; 12</li>
                                                    <li>dst...</li>
                                                </ul>
                                            </span>
                                            <div className="grid grid-cols-[4rem_1fr] items-end gap-4">
                                                <FormControl>
                                                    <Input
                                                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mt-4 bg-transparent dark:bg-transparent border-0 border-b rounded-none focus-visible:border-ring focus-visible:ring-0" placeholder="12..."
                                                        type="number"
                                                        {...field} />
                                                </FormControl>
                                                <p className="text-sm">/ Bulan</p>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="room_price"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1 mt-4">
                                                        <FormLabel>
                                                            <FormDescription>Harga sewa kamar per {duration} bulan</FormDescription>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                placeholder="1.000.000..."
                                                                {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="max_occupants"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jumlah Penghuni</FormLabel>
                                        <FormDescription>Berapa orang maksimal dalam 1 kamar</FormDescription>
                                        <FormControl>
                                            <RadioGroup
                                                className="flex flex-wrap gap-2"
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <div
                                                    className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                id="1"
                                                                value="1"
                                                                className="after:absolute after:inset-0"
                                                            />
                                                        </FormControl>
                                                        <Label htmlFor="1">1 Orang</Label>
                                                    </div>
                                                </div>
                                                <div
                                                    className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                id="2"
                                                                value="2"
                                                                className="after:absolute after:inset-0"
                                                            />
                                                        </FormControl>
                                                        <Label htmlFor="2">2 Orang</Label>
                                                    </div>
                                                </div>
                                                <div
                                                    className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                id="3"
                                                                value="3"
                                                                className="after:absolute after:inset-0"
                                                            />
                                                        </FormControl>
                                                        <Label htmlFor="3">3 Orang</Label>
                                                    </div>
                                                </div>
                                                <div
                                                    className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                id="bebas"
                                                                value="bebas"
                                                                className="after:absolute after:inset-0"
                                                            />
                                                        </FormControl>
                                                        <Label htmlFor="bebas">Bebas</Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="deposit"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Biaya Deposit / Uang Jaminan</FormLabel>
                                        <FormDescription>Uang jaminan yang dibayar di awal, untuk memastikan tanda jadi sewa</FormDescription>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="100.000..."
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <FormField
                        control={form.control}
                        name="isPublish"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-1 rounded-md border p-4 bg-card">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="mb-2">
                                        Apakah Kost Ini Siap di Publish ?
                                    </FormLabel>
                                    <FormDescription>
                                        Jika tidak di-centang maka posting kost anda ini ber-status sebagai draft dan tidak akan di perlihatkan ke khalayak ramai. Anda juga bisa mem-publish kost ini nanti dari halaman list kost
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={form.formState.isSubmitting}
                            aria-disabled={form.formState.isSubmitting}
                            type="submit"
                            size="lg"
                        >
                            {form.formState.isSubmitting ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Save />
                            )}
                            Simpan
                        </Button>
                    </div>
                </form>
            </Form>
            <ModalInsert open={openDialog} onOpenChange={handleChange} dataClient={dialogType} swrKey={swrKey} />
        </>
    )
}