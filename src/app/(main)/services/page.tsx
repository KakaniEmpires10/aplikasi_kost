import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Services() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Put data to work and help everyone multiply their impact.
            </h1>
            <p className="text-lg text-muted-foreground">
              Move from basic charts and graphs to data experiences that fuel insight and action in the moments that
              matter.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">TRY FREE</Button>
              <Button variant="outline">WATCH DEMO</Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            {/* Circular collage container */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
              {/* Top-left quadrant - Small profile image */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Profile"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Top-right quadrant - Orange chart */}
              <div className="relative">
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full rounded-tr-full bg-amber-400 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex h-3/4 items-end space-x-1">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="w-2 bg-amber-200" style={{ height: `${Math.random() * 70 + 30}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom-left quadrant - Person with stats */}
              <div className="relative">
                <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-full rounded-bl-full bg-gray-100 overflow-hidden">
                    <div className="absolute bottom-10 left-10 z-10">
                      <p className="text-sm font-medium">
                        Secure delivery
                        <br />
                        <span className="text-lg font-bold">268 PB/s</span>
                      </p>
                      <div className="mt-1 h-4 w-20">
                        <svg viewBox="0 0 100 20" className="w-full h-full">
                          <path
                            d="M0,10 L10,15 L20,5 L30,10 L40,5 L50,15 L60,10 L70,5 L80,15 L90,5 L100,10"
                            fill="none"
                            stroke="#4F46E5"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Person with analytics"
                      width={200}
                      height={200}
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom-right quadrant - Business person */}
              <div className="relative">
                <div className="absolute bottom-0 right-0 w-full h-full overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-full h-full rounded-br-full bg-gray-200 overflow-hidden">
                    <div className="absolute bottom-5 right-5 w-12 h-12 rounded-full overflow-hidden z-10">
                      <Image
                        src="/placeholder.svg?height=48&width=48"
                        alt="Profile"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Business person"
                      width={200}
                      height={200}
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Business Apps Card */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Business Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View, create, filter dashboards and apps that deliver insights and drive action for business results.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                Learn More →
              </Link>
            </CardFooter>
          </Card>

          {/* BI and Analytics Card */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold">BI and Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use intuitive dashboards, reporting, and analytics to uncover hidden opportunities within your business
                and make the right decisions.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                Learn More →
              </Link>
            </CardFooter>
          </Card>

          {/* Data Foundation Card */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Data Foundation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build a comprehensive and secure, flexible foundation for your organization to extract value from data
                from anywhere.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                Learn More →
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}
