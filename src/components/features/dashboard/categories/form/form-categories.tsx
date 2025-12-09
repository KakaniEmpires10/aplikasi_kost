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
    Input
} from "@/components/ui/input"
import { LoaderCircle, PenLine, Save } from "lucide-react"
import { categoriesSchema, propsDialogInsert } from "../categories.constant"
import { z } from "zod"
import toast from "react-hot-toast"
import { createPropertyCategories, updatePropertyCategories } from "@/action/categories-action"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FormCategories({ open, onOpenChange, data }: propsDialogInsert) {
    const form = useForm<z.infer<typeof categoriesSchema>>({
        resolver: zodResolver(categoriesSchema),
        defaultValues: {
            description: data?.description ? data.description : '',
            name: data?.name ? data.name : "",
            type: data?.type ? data.type : "KOST"
        }
    })

    async function onSubmit(values: z.infer<typeof categoriesSchema>) {
        try {
            let res;

            if (data) {
                const id = data.id
                res = await updatePropertyCategories({ id, values })
            } else {
                res = await createPropertyCategories(values);
            }

            if (!res) {
                toast.error("Terjadi kesalahan, hubungi admin 🙏");
                return;
            }

            if (!res.success) {
                toast.error(res.message)
                return;
            }

            toast.success(res.message);

            onOpenChange(!open)
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan, hubungi admin 🙏");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="col-span-4">
                            <FormLabel>Nama Tipe</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nama Tipe..."
                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipe</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Tipe Kategori..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="KOST">Kost</SelectItem>
                                    <SelectItem value="RENT">Rumah</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="col-span-4">
                            <FormLabel>Deskripsi Tipe</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Deskripsi Tipe..."
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={form.formState.isSubmitting}
                    aria-disabled={form.formState.isSubmitting}
                    className="w-full"
                    type="submit"
                >
                    {form.formState.isSubmitting ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        data ? <PenLine /> : <Save />
                    )}
                    {data ? "Update" : "Simpan"}
                </Button>
            </form>
        </Form>
    )
}