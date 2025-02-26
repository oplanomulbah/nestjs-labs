import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} />
            <h1 className="text-xl font-bold">ASL Translator</h1>
          </div>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/" className="font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Real-Time ASL to Text Translation
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Our application uses advanced machine learning to translate American Sign Language into text in
                real-time. Start using the translator by clicking the button below.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/translator">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Start Translator
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                    Learn ASL
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="ASL Translation Demo"
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-6 lg:gap-12">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
              <p className="text-muted-foreground md:text-xl">
                Our application uses cutting-edge technology to translate sign language in real-time.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Image src="/placeholder.svg?height=32&width=32" alt="Webcam" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold">Webcam Capture</h3>
                <p className="text-muted-foreground">
                  The application captures your hand movements through your device's webcam.
                </p>
              </div>
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Image src="/placeholder.svg?height=32&width=32" alt="AI" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold">AI Processing</h3>
                <p className="text-muted-foreground">
                  TensorFlow.js analyzes the hand gestures and identifies the corresponding signs.
                </p>
              </div>
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Image src="/placeholder.svg?height=32&width=32" alt="Text" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold">Text Translation</h3>
                <p className="text-muted-foreground">
                  The recognized signs are converted to text and displayed on your screen in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 ASL Translator. All rights reserved.</p>
          <nav>
            <ul className="flex items-center gap-4 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground underline-offset-4 hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground underline-offset-4 hover:underline">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}

