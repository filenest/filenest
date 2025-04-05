import Link from "next/link"
import { Button } from "@/components/Button"
import { FolderOpen, FolderTree, Palette, SquareFunction, Upload } from "lucide-react"
import {
  CloudinaryIcon,
  NextjsIcon,
  ReactIcon,
  TrpcIcon,
  UploadThingIcon,
} from "@/components/Icon"
import { Logo } from "@/components/Logo"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

export default function HomePage() {
  return (
    <div>
      <Opener />
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <Cards />
        <Integrations />
        <CodeExample />
      </div>
      <div className="flex justify-center pt-32 mask-b-from-50% mask-b-to-98%">
        <Logo className="h-92 fill-fn-300" />
      </div>
    </div>
  )
}

const Opener = () => {
  return (
    <div className="bg-(image:--background-grid)">
      <div className="px-4 sm:px-8 bg-gradient-to-b from-transparent from-50% to-fn-950">
        <div className="relative overflow-hidden pb-32 pt-40 border-x border-b border-fn-800 bg-fn-950 max-w-7xl mx-auto">
          <div className="size-128 bg-white rounded-full blur-[100px] absolute opacity-10 top-0 -translate-y-3/4 left-1/2 -translate-x-1/2" />
          <div className="flex flex-col items-center justify-center text-center relative z-1 px-8">
            <h1 className="text-7xl mb-6 text-balance">
              More than just file uploads{" "}
              <FolderOpen className="inline-block size-18 align-bottom" />
            </h1>
            <p className="max-w-3xl text-balance">
              Connect your S3, Uploadthing, Cloudinary, and manage your files within your
              own custom UI. Perfect for custom admin dashboards that need advanced file
              management.
            </p>
            <div className="flex gap-2 mt-6">
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
      </div>
    </div>
  )
}

const Cards = () => {
  return (
    <div className="border-x border-fn-800 px-16 grid grid-cols-3 gap-4">
      <div className="px-8 py-16 border-x border-fn-800 bg-gradient-to-tl from-fn-900 to-fn-950">
        <Upload className="size-8 mb-4 text-fn-300" />
        <h3 className="text-2xl mb-2">File Uploads</h3>
        <p className="text-fn-100">
          Client-side uploads directly to your favorite provider via presigned URLs.
          Supports S3, Uploadthing, Cloudinary, and more to come.
        </p>
      </div>
      <div className="px-8 py-16 border-x border-fn-800 bg-gradient-to-tl from-fn-900 to-fn-950">
        <FolderTree className="size-8 mb-4 text-fn-300" />
        <h3 className="text-2xl mb-2">File Management</h3>
        <p className="text-fn-100">
          For when you need more than just uploads. Easily add folder and file management
          to your dashboard.
        </p>
      </div>
      <div className="px-8 py-16 border-x border-fn-800 bg-gradient-to-tl from-fn-900 to-fn-950">
        <Palette className="size-8 mb-4 text-fn-300" />
        <h3 className="text-2xl mb-2">Build your own UI</h3>
        <p className="text-fn-100">
          Custom admin UI using unstyled React components. Filenest ships just the logic,
          giving you full control over your markup and styling.
        </p>
      </div>
    </div>
  )
}

const Integrations = () => {
  return (
    <div className="relative overflow-hidden p-16 border border-fn-800">
      <div className="size-128 bg-white rounded-full blur-[100px] absolute opacity-10 bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2" />

      <div className="relative z-1">
        <div className="text-center mb-8">
          <h3 className="text-3xl">Filenest works with these tools</h3>
        </div>
        <div className="flex gap-12 justify-center items-center flex-wrap">
          <div className="flex flex-col gap-2 items-center justify-center">
            <ReactIcon className="w-16 fill-fn-50" />
            <div className="font-mono text-fn-300">React</div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <NextjsIcon className="w-16 fill-fn-50" />
            <div className="font-mono text-fn-300">Next.js</div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <TrpcIcon className="w-16 fill-fn-50" />
            <div className="font-mono text-fn-300">tRPC</div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <CloudinaryIcon className="w-16 fill-fn-50" />
            <div className="font-mono text-fn-300">Cloudinary</div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <UploadThingIcon className="w-32 h-16 fill-fn-50" />
            <div className="font-mono text-fn-300">uploadthing</div>
          </div>
        </div>
        <div className="mt-8 text-center text-fn-500">
          And more coming soon<span className="align-super ml-1">™</span>
        </div>
      </div>
    </div>
  )
}

const CodeExample = () => {
  const code = `<Filenest.FileList
  children={({ files }) =>
    files.map((File, index) => (
      <File.Root
        key={index}
        children={({ file }) => (
          <div>
            <span>{file.name}</span>
            <File.Delete
              children={({ trigger }) => (
                <button onClick={trigger}>Delete</button>
              )}
            />
          </div>
        )}
      />
    ))
  }
/>`

  return (
    <div className="grid grid-cols-2 border-b border-fn-800">
      <div className="py-16 px-8 border-x border-fn-800">
      <SquareFunction className="size-8 mb-4 text-fn-300" />
        <h3 className="text-3xl mb-2">Simple API. Powerful UI.</h3>
        <p className="text-fn-100 mb-4">
          Filenest leverages render props to enable to you build your UI the way you
          desire. Want to add dialogs or custom state on top? No problem!
        </p>
        <Link href="/docs/getting-started">
          <Button>Get Started</Button>
        </Link>
      </div>
      <div className="pt-16 pl-8 border-r border-fn-800">
        <div className="max-h-76 overflow-hidden">
          <DynamicCodeBlock lang="tsx" code={code} />
        </div>
      </div>
    </div>
  )
}
