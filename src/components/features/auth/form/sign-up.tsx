"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signUpSchema } from "../auth.constant"
import { useForm } from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { LoaderCircle, Save } from "lucide-react"
import toast from "react-hot-toast"

const SignUpForm = ({ tab }: { tab: boolean }) => {

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confPassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        try {
            await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
            }, {
                onSuccess() {
                    form.reset()
                    toast.success("User berhasil dibuat. Silahkan cek email anda terlebih dahulu untuk verifikasi email.")
                },
                onError(ctx) {
                    console.log(ctx.error.message);
                    toast.error("User gagal dibuat. Silahkan coba lagi.")
                },
            })
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("User Gagal dibuat. Silahkan coba lagi.");
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    tabIndex={tab ? 0 : -1}
                                    placeholder="Bobby..."
                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    tabIndex={tab ? 0 : -1}
                                    placeholder="me@gmail.com"
                                    type="email"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput tabIndex={tab ? 0 : -1} placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="confPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Konfirmasi Password</FormLabel>
                            <FormControl>
                                <PasswordInput tabIndex={tab ? 0 : -1} placeholder="******" {...field} />
                            </FormControl>
                            <FormDescription>Konfirmasi ulang password anda</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button 
                    disabled={form.formState.isSubmitting}
                    aria-disabled={form.formState.isSubmitting}
                    tabIndex={tab ? 0 : -1} 
                    className="w-full" 
                    type="submit"
                >
                    {form.formState.isSubmitting ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <Save />
                    )}
                    Submit
                </Button>
            </form>
        </Form>
    )
}

export default SignUpForm