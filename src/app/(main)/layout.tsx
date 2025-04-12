import Footer from "@/components/layouts/main/footer";
import Navbar from "@/components/layouts/main/navbar";
import ScrollButton from "@/components/layouts/main/scroll-button";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen max-w-5xl px-6 mx-auto">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <ScrollButton />
            <Footer />
        </div>
    );
}