"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircleIcon, Check, ChevronsUpDown, CircleAlert, ImageIcon, LoaderCircle, Map, PlusCircle, Save, Trash2, UploadIcon, XIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import ModalInsert from '../../facilities/modal/modal-insert'
import React, { useEffect, useState } from 'react'
import { useFileUpload } from '@/hooks/use-file-upload'
import useSWR from 'swr'
import { District, Facility, PropertyCategory, Province, Regency, Village } from '@/db/schema'
import { cn, fetcher } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { UploadedImage } from '@/lib/image-uploader'
import { rollbackUploadsClient, uploadToCloudinaryClient } from '@/lib/image-uploader-client'
import { useRouter } from 'next/navigation'
import { rentSchema } from '../rent.constant'
import { createRent } from '@/action/rent-action'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import Image from 'next/image'

const FormRent = () => {
    const [provinces, setProvinces] = useState<Province[]>([])
    const [cities, setCities] = useState<Regency[]>([])
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

    const form = useForm<z.infer<typeof rentSchema>>({
        resolver: zodResolver(rentSchema),
        defaultValues: {
            name: "",
            size: "",
            price: "",
            gender: "male",
            facilities: [],
            description: "",
            total_bathrooms: 0,
            total_rooms: 0,
            type: "3",
            address: "",
            province: "11",
            city: "1171",
            district: "",
            village: "",
            latitude: 5.5587044039,
            longitude: 95.3277134583,
            isPublish: false,
            floor_level: 1,
            min_stay: "",
        }
    })

    const previewUrlFeatured = filesFeatured[0]?.preview || null

    const watchProvince = form.watch('province')
    const watchCity = form.watch('city')
    const watchDistrict = form.watch('district')
    const duration = form.watch("min_stay");

    const { data: personalFacilities, isLoading: isLoadingPersonalFacilities, error: isErrorPersonalFacilities } = useSWR<Facility[]>('/api/facilities?type=pribadi', fetcher, { revalidateOnFocus: false })

    const { data: rentCategories, isLoading: isLoadingRentCategories, error: isErrorRentCategories } = useSWR<PropertyCategory[]>('/api/property-categories?type=rent', fetcher, { revalidateOnFocus: false })

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

    const onSubmit = async (values: z.infer<typeof rentSchema>) => {
        const uploadToastId = toast.loading("Memulai proses upload...");
        const uploadedFiles: UploadedImage[] = [];

        let featuredImageUrl = "";
        const imageUrls: string[] = [];

        // Upload featured image
        if (filesFeatured[0]?.file) {
            toast.loading("Mengupload gambar utama...", { id: uploadToastId });

            const featuredUploadResult = await uploadToCloudinaryClient(
                filesFeatured[0].file as File,
                "room-featured"
            );

            if (!featuredUploadResult.success || !featuredUploadResult.result) {
                await rollbackUploadsClient(uploadedFiles);
                toast.error("Gagal mengupload gambar utama", { id: uploadToastId });
                return;
            }

            featuredImageUrl = featuredUploadResult.result.secure_url;
            uploadedFiles.push({
                url: featuredImageUrl,
                publicId: featuredUploadResult.result.public_id,
            });
        }

        // Upload additional images
        if (files.length > 0) {
            toast.loading(`Mengupload gambar rumah (0/${files.length})...`, { id: uploadToastId });

            for (let i = 0; i < files.length; i++) {
                const imageFile = files[i];
                toast.loading(`Mengupload gambar rumah (${i + 1}/${files.length})`, { id: uploadToastId });

                const uploadResult = await uploadToCloudinaryClient(
                    imageFile.file as File,
                    "room-images"
                );

                if (!uploadResult.success || !uploadResult.result) {
                    await rollbackUploadsClient(uploadedFiles);
                    toast.error("Gagal mengupload salah satu gambar rumah", { id: uploadToastId });
                    return;
                }

                const imageUrl = uploadResult.result.secure_url;
                const publicId = uploadResult.result.public_id;

                imageUrls.push(imageUrl);
                uploadedFiles.push({ url: imageUrl, publicId });
            }
        }

        // Create room with uploaded images
        const dataToSubmit = {
            ...values,
            featured_image: featuredImageUrl,
            images: imageUrls,
        };

        toast.loading("Menambah Rumah...", { id: uploadToastId });

        const res = await createRent(dataToSubmit);

        if (!res) {
            await rollbackUploadsClient(uploadedFiles);
            toast.error("Terjadi kesalahan, silahkan coba lagi atau hubungi admin 🙏", { id: uploadToastId });
            return;
        }

        if (!res.success) {
            await rollbackUploadsClient(uploadedFiles);
            toast.error(res.message, { id: uploadToastId });
            return;
        }

        // Success - show success message and redirect
        toast.success(res.message, { id: uploadToastId });
        form.reset();
        router.push('/dashboard/rent')
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Rumah Sewa</CardTitle>
                            <CardDescription>Isi detail Rumah Sewa yang ingin Anda tambahkan di bawah ini.</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-8'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Nama Rumah</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="nama rumah..."
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
                            <div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-4'>
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            <FormLabel>Ukuran rumah</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="12 x 8..."
                                                    {...field} />
                                            </FormControl>
                                            <FormDescription>Panjang dan lebar Rumah dalam meter</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="total_rooms"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            <FormLabel>Jumlah Kamar</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="100.000..."
                                                    {...field} />
                                            </FormControl>
                                            <FormDescription>Panjang dan lebar kamar dalam meter</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="total_bathrooms"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            <FormLabel>Jumlah Kamar Mandi</FormLabel>
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
                            </div>
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-2">Tipe Rumah</FormLabel>
                                        <FormMessage />
                                        {isLoadingRentCategories ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Array.from({ length: 2 }).map((_, idx) => (
                                                    <Skeleton key={idx} className="h-24 rounded-md" />
                                                ))}
                                            </div>
                                        ) : isErrorRentCategories ? (
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
                                        ) : rentCategories && rentCategories.length > 0 ? (
                                            <RadioGroup
                                                className="grid grid-cols-1 md:grid-cols-2"
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                {rentCategories.map((category) => (
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
                                            <div className="text-muted-foreground text-xs">Kategori Rumah tidak tersedia.</div>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="facilities"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="mb-4">Fasilitas Rumah</FormLabel>
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
                                                            name="facilities"
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi <span className='text-xs text-muted-foreground'>(opsional)</span></FormLabel>
                                        <FormDescription>Tulis penjelasan ringkas tentang kamar, seperti fasilitas, lingkungan, dan kenyamanan.</FormDescription>
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
                                                name="price"
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
                            <CardDescription>Unggah minimal satu foto tampak depan atau bagian dalam rumah. Tampilan yang bersih dan terang akan menarik lebih banyak penyewa.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid gap-2">
                                <Label htmlFor="rent_img_featured">Upload Gambar Utama</Label>
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
                                                id="rent_img_featured"
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
                                <Label htmlFor="kost_img_multiple">Upload Gambar Rumah</Label>
                                <p className="text-muted-foreground text-xs italic">
                                    Unggah foto-foto detail dari bagian dalam dan fasilitas rumah, seperti: <strong>kamar tidur, kamar mandi, dapur, ruang bersama, halaman, parkiran, dan fasilitas tambahan lainnya.</strong> Semakin lengkap dan jernih fotonya, semakin besar peluang rumah Anda dilirik
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
                                        Apakah Rumah Sewa Ini Siap di Publish ?
                                    </FormLabel>
                                    <FormDescription>
                                        Jika tidak di-centang maka posting rumah sewa anda ini ber-status sebagai draft dan tidak akan di perlihatkan ke khalayak ramai. Anda juga bisa mem-publish rumah sewa ini nanti dari halaman list rumah sewa
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

export default FormRent