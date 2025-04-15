"use server"

import { updateProfileSchema } from "@/components/features/dashboard/settings/setting.constant"
import { auth } from "@/lib/auth";
import { z } from "zod"

export const updateAccount = async (data: z.infer<typeof updateProfileSchema>) => {
    const { profile_image, username } = data;

    const result = await auth.api.updateUser({
        body: {
            image: profile_image,
            name: username,
        }
    })

    if (!result) {
        return {
            status: "error",
            message: "Gagal memperbarui data akun",
        }
    }

    return {
        status: "success",
        message: "Berhasil memperbarui data akun",
    }
}