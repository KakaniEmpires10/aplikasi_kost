"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { roomSchema } from '../room.constant'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircleIcon, CircleAlert, ImageIcon, LoaderCircle, PlusCircle, Save, Trash2, TriangleAlert, UploadIcon, XIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import ModalInsert from '../../facilities/modal/modal-insert'
import React, { useState } from 'react'
import { useFileUpload } from '@/hooks/use-file-upload'
import useSWR from 'swr'
import { Facility, PropertyCategory } from '@/db/schema'
import { fetcher } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { UploadedImage } from '@/lib/image-uploader'
import { rollbackUploadsClient, uploadToCloudinaryClient } from '@/lib/image-uploader-client'
import { createRoom } from '@/action/room-action'
import { useRouter } from 'next/navigation'

const FormRoom = ({ kostId }: { kostId: string | null | undefined }) => {
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

    const form = useForm<z.infer<typeof roomSchema>>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            kostId: kostId || '',
            name: "",
            size: "",
            type: "",
            price: "",
            private_facilies: [],
            max_occupants: "bebas",
            deposit: "",
        }
    })

    const previewUrlFeatured = filesFeatured[0]?.preview || null

    const { data: personalFacilities, isLoading: isLoadingPersonalFacilities, error: isErrorPersonalFacilities } = useSWR<Facility[]>('/api/facilities?type=pribadi', fetcher, { revalidateOnFocus: false })

    const { data: kosts, isLoading: isLoadingKost, error: isErrorKost } = useSWR<{ id: string, name: string }[]>(`/api/kost/get-all`, fetcher, { revalidateOnFocus: false })

    const { data: kostCategories, isLoading: isLoadingkostCategories, error: isErrorkostCategories } = useSWR<PropertyCategory[]>('/api/property-categories?type=kost', fetcher, { revalidateOnFocus: false })

    const onSubmit = async (values: z.infer<typeof roomSchema>) => {
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
            toast.loading(`Mengupload gambar kost (0/${files.length})...`, { id: uploadToastId });

            for (let i = 0; i < files.length; i++) {
                const imageFile = files[i];
                toast.loading(`Mengupload gambar kost (${i + 1}/${files.length})`, { id: uploadToastId });

                const uploadResult = await uploadToCloudinaryClient(
                    imageFile.file as File,
                    "room-images"
                );

                if (!uploadResult.success || !uploadResult.result) {
                    await rollbackUploadsClient(uploadedFiles);
                    toast.error("Gagal mengupload salah satu gambar kost", { id: uploadToastId });
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

        toast.loading("Menambah Kamar...", { id: uploadToastId });

        const res = await createRoom(dataToSubmit);

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
        router.push("/dashboard/kost");
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Kamar</CardTitle>
                            <CardDescription>Isi detail kamar kost yang ingin Anda tambahkan di bawah ini.</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-8'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
                                <FormField
                                    control={form.control}
                                    name="kostId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kost Terkait</FormLabel>
                                            {isLoadingKost ? (
                                                <Skeleton className="h-10 w-full rounded-md" />
                                            ) : isErrorKost ? (
                                                <div role="alert" className="rounded-md border px-4 py-3">
                                                    <p className="text-sm flex items-center gap-2">
                                                        <CircleAlert className="text-red-500" size={16} />
                                                        Terjadi Error Dalam Pengambilan Data Kost. Coba lagi dalam beberapa saat atau hubungi admin 🙏
                                                    </p>
                                                </div>
                                            ) : kosts && kosts.length > 0 ? (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full capitalize">
                                                            <SelectValue placeholder="Kategori" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {kosts.map((kost) => (
                                                            <SelectItem key={kost.id} className="capitalize" value={String(kost.id)}>
                                                                {kost.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="rounded-lg border px-4 py-2.5">
                                                    <p className="text-xs">
                                                        <TriangleAlert
                                                            className="me-3 -mt-0.5 inline-flex text-amber-500"
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                        Kost Tidak Tersedia, Harap <strong>Buat Kost</strong> Terlebih Dahulu
                                                    </p>
                                                </div>
                                            )}
                                            <FormDescription>Kamar Ini adalah milik kost yang mana</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
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
                                                <div className="text-muted-foreground text-xs">Tipe kamar tidak tersedia.</div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 items-start gap-4'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Nama Kamar</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Kamar Melati..."
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            <FormLabel>Ukuran Kamar</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="6 x 6..."
                                                    {...field} />
                                            </FormControl>
                                            <FormDescription>Panjang dan lebar kamar dalam meter</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="private_facilies"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="mb-4">Fasilitas Kamar</FormLabel>
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
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            <FormLabel>Biaya Kamar</FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="deposit"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            <FormLabel>Biaya Deposit / Uang Jaminan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="100.000..."
                                                    {...field} />
                                            </FormControl>
                                            <FormDescription>Uang jaminan yang dibayar di awal, untuk memastikan tanda jadi sewa</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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

export default FormRoom