import { FileBrowser } from "@/components/FileBrowser"

export default function Page() {
    return (
        <div className="relative">
            <div className="mb-12 pb-8 border-b border-zinc-600 max-w-128">
                <h1 className="text-5xl mb-4">File Browser</h1>
                <p>
                    This is a complete example of Filenest. <br />
                    Filenest lets you view your external files and folders.
                    You can also upload new files or update existing ones.
                </p>
            </div>
            <FileBrowser />

            <div className="size-128 absolute top-0 bg-cyan-500 blur-[100px] z-[-1] opacity-25"/>
            <div className="size-128 absolute top-32 left-64 bg-emerald-500 blur-[100px] z-[-1] opacity-25"/>
            <div className="size-128 absolute top-0 left-128 bg-purple-500 blur-[100px] z-[-1] opacity-25"/>
        </div>
    )
}
