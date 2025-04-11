"use server"

type emailAction = {
    to: string,
    subject: string,
    link: string,
}

export const sendEmail = async ({ to, link, subject }: emailAction) => {
    if (!to && !link && !subject)
        return {
            status: 400,
            message: "Parameter tidak terisi dengan sesuai",
        };

    try {
        const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_ACCESS_TOKEN,
                template_params: {
                    app_name: process.env.APP_NAME,
                    subject: subject,
                    email: to,
                    link: link,
                },
            }),
        });

        if (res.ok) {
            return {
                status: res.status,
                message: "Email Berhasil Dikirim",
            };
        }
        return {
            status: 500,
            message: "Terjadi kesalahan pada server",
        };
    } catch (error) {
        return {
            status: 500,
            message: "terjadi kesalahan pada server/n" + error,
        };
    }
}