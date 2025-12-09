"use client"

import {
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
    PasswordInput
} from "@/components/ui/password-input"
import { updatePasswordSchema } from "../setting.constant"
import { Separator } from "@/components/ui/separator"
import { LoaderCircle } from "lucide-react"
import { IconPencilCog } from "@tabler/icons-react"
import { authClient } from "@/lib/auth-client"
import toast from "react-hot-toast"

function FormUpdatePassword() {

    const form = useForm<z.infer<typeof updatePasswordSchema>>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            password_lama: "",
            password_baru: "",
            konfirmasi_password: "",
        }
    })

    async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
        await authClient.changePassword({
            newPassword: values.password_baru,
            currentPassword: values.password_lama,
            revokeOtherSessions: true,
        },
        {
            onSuccess: () => {
                toast.success("Berhasil memperbarui Password")
                form.reset()
            },
            onError: (error) => {
                toast.error(error.error.message)
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField
                    control={form.control}
                    name="password_lama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-card-foreground">Password Lama</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="******" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Separator className="mt-6" />

                <FormField
                    control={form.control}
                    name="password_baru"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-card-foreground">Password Baru</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="******" {...field} />
                            </FormControl>
                            <FormDescription>Masukkan Password yang baru</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="konfirmasi_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-card-foreground">Konfirmasi Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="******" {...field} />
                            </FormControl>
                            <FormDescription>Konfirmasi ulang password anda</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    aria-disabled={form.formState.isSubmitting}
                    className="flex ml-auto"
                    type="submit"
                >
                    {form.formState.isSubmitting ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <IconPencilCog />
                    )}
                    Submit
                </Button>
            </form>
        </Form>
    )
}

export default FormUpdatePassword;