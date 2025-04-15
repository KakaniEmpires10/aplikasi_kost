"use client"

import {
    useState
} from "react"
import {
    toast
} from "sonner"
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
    Paperclip
} from "lucide-react"
import {
    Input
} from "@/components/ui/input"
import { updateProfileSchema } from "../setting.constant"
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-input"
import { IconPencilCog, IconUserCircle } from "@tabler/icons-react"
import { Session } from "@/lib/auth"

function FormUpdateProfile({ session }: { session: Session['user'] | null | undefined }) {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxSize: 1024 * 1024 * 4,
        reSelect: true,
    };
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            username: session?.name
        }
    })

    function onSubmit(values: z.infer<typeof updateProfileSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
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
                                    <FileUploader
                                        value={files}
                                        onValueChange={setFiles}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-card w-fit p-1 mx-auto"
                                    >
                                        <FileInput
                                            id="fileInput"
                                            className="outline-dashed w-48 h-48 outline-1 outline-slate-500"
                                        >
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <IconUserCircle className='text-gray-500 w-25 h-15' />
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                    <span className="font-semibold">Click to upload</span>
                                                    &nbsp; or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SVG, PNG, JPG or GIF
                                                </p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {files &&
                                                files.length > 0 &&
                                                files.map((file, i) => (
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current" />
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
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