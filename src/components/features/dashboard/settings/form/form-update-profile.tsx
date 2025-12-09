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
    LoaderCircle,
} from "lucide-react"
import {
    Input
} from "@/components/ui/input"
import { updateProfileSchema } from "../setting.constant"
import { IconPencilCog } from "@tabler/icons-react"
import { Session } from "@/lib/auth"
import AvatarUpload from "@/components/ui/avatar-upload"

function FormUpdateProfile({ session }: { session: Session['user'] | null | undefined }) {
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            username: session?.name
        }
    })

    function onSubmit(values: z.infer<typeof updateProfileSchema>) {
        try {
            console.log(values);
        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField
                    control={form.control}
                    name="profile_image"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field }) => (
                        <div className="flex justify-center">
                            <FormItem>
                                <FormLabel className="mx-auto text-card-foreground">Foto Profile</FormLabel>
                                <FormDescription>Ini akan menjadi foto profile-mu di aplikasi ini</FormDescription>
                                <FormControl>
                                    <AvatarUpload />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-card-foreground">Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Username Anda...."
                                    type="text"
                                    {...field} />
                            </FormControl>

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

export default FormUpdateProfile;