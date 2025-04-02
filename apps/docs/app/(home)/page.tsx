import { Button } from "@/components/Button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div>
      <Opener />
    </div>
  )
}

const Opener = () => {
  return (
    <div className="relative overflow-hidden py-32 border border-fn-900 rounded-lg">
      <div className="size-128 bg-white rounded-full blur-[100px] absolute opacity-10 top-0 -translate-y-3/4 left-1/2 -translate-x-1/2" />
      <div className="flex flex-col items-center justify-center text-center relative z-1">
        <h1 className="text-7xl mb-6">More than just file uploads</h1>
        <p className="max-w-3xl text-balance">
          Connect your S3, Uploadthing, Cloudinary, and manage your files within your own
          custom UI. Perfect for custom admin dashboards that need advanced file
          management.
        </p>
        <div className="flex gap-2 mt-6 font-mono">
          <Link href="/docs/getting-started">
            <Button>Get Started</Button>
          </Link>
          <Link href="/docs/introduction">
            <Button variant="secondary">Introduction</Button>
          </Link>
        </div>
      </div>
      <div className="size-64 bg-green-600 rounded-full blur-[100px] absolute opacity-50 right-1/2" />
      <div className="size-64 bg-cyan-600 rounded-full blur-[100px] absolute opacity-50 left-1/2 -translate-x-1/2" />
      <div className="size-64 bg-purple-600 rounded-full blur-[100px] absolute opacity-50 left-1/2" />
    </div>
  )
}
