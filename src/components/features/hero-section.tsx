import { Button } from "@/components/ui/button";
import { HouseIcon, ScanSearch } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      <section className="overflow-hidden">
        <div className="relative py-28 lg:py-20">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
              <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">Production Ready Digital Marketing blocks</h1>
              <p className="mt-8">Error totam sit illum. Voluptas doloribus asperiores quaerat aperiam. Quidem harum omnis beatae ipsum soluta!</p>

              <div>
                <form action="" className="mx-auto my-10 lg:my-12 lg:ml-0 lg:mr-auto">
                  <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                    <HouseIcon className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                    <input placeholder="Cari Kost yang anda butuhkan" className="h-14 w-full bg-transparent pl-12 focus:outline-none" type="email" />

                    <div className="md:pr-1.5 lg:pr-0">
                      <Button aria-label="submit" className="rounded-(--radius)">
                        <span className="hidden md:block">Get Started</span>
                        <ScanSearch className="relative mx-auto size-5 md:hidden" strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                </form>

                <ul className="list-inside list-disc space-y-2">
                  <li>Faster</li>
                  <li>Modern</li>
                  <li>100% Customizable</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
            <div className="relative">
              <div className="bg-radial-[at_65%_25%] to-background z-1 -inset-17 absolute from-transparent to-40%"></div>
              <Image priority className="hidden dark:block" src="/image/placeholder/bg-dark.png" alt="app illustration" width={2796} height={2008} />
              <Image priority className="dark:hidden" src="/image/placeholder/bg-light.png" alt="app illustration" width={2796} height={2008} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
