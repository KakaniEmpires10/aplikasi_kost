"use client"

import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Input
} from "@/components/ui/input"
import { LoaderCircle, PenLine, Save } from "lucide-react"
import { availableIcons, facilitiesSchema, propsDialogInsert } from "../facitity.constant"
import { z } from "zod"
import toast from "react-hot-toast"
import { createFacility, updateFacilities } from "@/action/facilities-action"
import { mutate } from "swr"

export default function FormFacility({ open, onOpenChange, data, dataClient, swrKey }: propsDialogInsert) {
    const form = useForm<z.infer<typeof facilitiesSchema>>({
        resolver: zodResolver(facilitiesSchema),
        defaultValues: {
            icon: data?.icon ? data.icon :"",
            category: data?.category ? data.category : (dataClient ? dataClient : ''),
            name: data?.name ? data.name :""
        }
    })

    async function onSubmit(values: z.infer<typeof facilitiesSchema>) {
        try {
            let res;

            if (data) {
                const id = data.id
                res = await updateFacilities({ id, values })
            } else {
                res = await createFacility(values);
            }

            if (!res) {
                toast.error("Terjadi kesalahan, hubungi admin 🙏");
                return;
            }

            if (!res.success) {
                toast.error(res.message)
                return;
            }

            if (swrKey) {
                mutate(swrKey)
            }
            
            mutate("/api/facilities");

            toast.success(res.message);

            onOpenChange(!open)
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan, hubungi admin 🙏");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-4">
                <div className="grid gap-4 grid-cols-4">
                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-1">
                                <FormLabel>Icon</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Icon" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {availableIcons.map(item => (
                                            <SelectItem key={item.value} value={item.value}><item.component /></SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-3">
                                <FormLabel>Kategori</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!!dataClient}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Kategori" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="UMUM">Umum</SelectItem>
                                        <SelectItem value="PRIBADI">Pribadi</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-4">
                                <FormLabel>Nama Fasilitas</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nama Fasilitas..."
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    disabled={form.formState.isSubmitting}
                    aria-disabled={form.formState.isSubmitting}
                    className="w-full mt-5"
                    type="submit"
                >
                    {form.formState.isSubmitting ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        data ? <PenLine /> : <Save />
                    )}
                    { data ? "Update" : "Simpan" }
                </Button>
            </form>
        </Form>
    )
}