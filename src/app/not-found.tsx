"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, ArrowRight, Search } from "lucide-react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const [score, setScore] = useState(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [showTip, setShowTip] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle animation and game initialization
  useEffect(() => {
    setMounted(true)

    // Show tip after 5 seconds
    const tipTimer = setTimeout(() => {
      setShowTip(true)
    }, 5000)

    // Canvas animation
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio

        const particles: Array<{
          x: number
          y: number
          radius: number
          color: string
          speedX: number
          speedY: number
        }> = []

        // Create particles
        for (let i = 0; i < 40; i++) {
          const radius = Math.random() * 2 + 0.5
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius,
            color: `rgba(37, 99, 235, ${Math.random() * 0.15})`,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
          })
        }

        // Animation function
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          particles.forEach((particle) => {
            // Move particles
            particle.x += particle.speedX
            particle.y += particle.speedY

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width
            if (particle.x > canvas.width) particle.x = 0
            if (particle.y < 0) particle.y = canvas.height
            if (particle.y > canvas.height) particle.y = 0

            // Draw particle
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()
          })

          requestAnimationFrame(animate)
        }

        animate()
      }
    }

    return () => {
      clearTimeout(tipTimer)
    }
  }, [])

  // Handle window resize for canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle character click (mini-game)
  const handleCharacterClick = () => {
    setScore(score + 1)

    // Move character to random position
    const newX = Math.floor(Math.random() * 80) + 10
    const newY = Math.floor(Math.random() * 60) + 20
    setPosition({ x: newX, y: newY })
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-white text-gray-800">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4 py-8 mx-auto">
        {/* Stylish 404 text */}
        <div className="relative text-center mb-10">
          {/* Main 404 text */}
          <h1 className="text-[100px] font-black text-gray-100 leading-none">404</h1>

          {/* Gradient overlay for style */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`${mounted ? "animate-in zoom-in-50 duration-700" : "opacity-0"}`}>
              <span className="text-[100px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                404
              </span>
            </div>
          </div>

          <div className={`mt-4 ${mounted ? "animate-in fade-in-50 duration-700 delay-300" : "opacity-0"}`}>
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-gray-800">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Halaman yang Anda cari sepertinya sedang bermain petak umpet.
            </p>
          </div>
        </div>

        {/* Interactive animation area */}
        <div className="relative h-72 w-full rounded-xl mb-8 overflow-hidden group transition-all duration-500 bg-gray-50 border border-gray-100 shadow-sm">
          {/* Grid lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(37, 99, 235, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 99, 235, 0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Interactive character */}
          <div
            className={`absolute cursor-pointer transition-all duration-500 ease-out ${mounted ? "scale-100" : "scale-0"}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `translate(-50%, -50%) ${score > 0 ? "rotate(" + ((score * 10) % 360) + "deg)" : ""}`,
              filter: "drop-shadow(0 0 10px rgba(37, 99, 235, 0.3))",
            }}
            onClick={handleCharacterClick}
          >
            <div className="relative">
              {/* Character body */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                <div className="text-white text-xl font-bold">404</div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-30 scale-0 group-hover:scale-150 transition-transform duration-700"></div>
              </div>

              {/* Eyes */}
              <div className="absolute top-4 left-3 w-2 h-3 bg-white rounded-full"></div>
              <div className="absolute top-4 right-3 w-2 h-3 bg-white rounded-full"></div>

              {/* Mouth */}
              <div className="absolute bottom-5 left-1/2 w-6 h-2 bg-white rounded-full -translate-x-1/2"></div>

              {/* Orbit ring */}
              <div className="absolute -inset-4 border border-blue-200 rounded-full animate-[spin_10s_linear_infinite]"></div>

              {/* Small orbiting dot */}
              <div className="absolute -top-4 left-1/2 w-3 h-3 -translate-x-1/2 bg-blue-400 rounded-full shadow-lg shadow-blue-200/50 animate-[spin_5s_linear_infinite]"></div>
            </div>
          </div>

          {/* Score display */}
          {score > 0 && (
            <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-medium text-blue-600 border border-gray-100 shadow-sm">
              Skor: {score}
            </div>
          )}

          {/* Game tip */}
          {showTip && score === 0 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-gray-700 text-xs px-4 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
              <span className="animate-pulse text-blue-500">
                <Search className="h-3 w-3" />
              </span>
              Klik karakter untuk bermain!
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 justify-center ${mounted ? "animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-500" : "opacity-0"}`}
        >
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 group"
            onClick={() => window.history.back()}
          >
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-45 text-blue-600" />
            <span>Coba Lagi</span>
          </Button>
        </div>

        {/* Fun suggestions */}
        <div className="mt-10 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Atau coba halaman populer ini:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { name: "Tentang Kami", path: "/tentang-kami" },
              { name: "Layanan", path: "/layanan" },
              { name: "Testimoni", path: "/testimoni" },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="text-xs px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-1 group border border-gray-200 shadow-sm"
              >
                <span className="flex items-center gap-1">
                  {item.name}{" "}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 text-blue-600" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} KOST • Dibuat dengan teknologi modern</p>
        </div>
      </div>
    </div>
  )
}
