import { FileBrowser } from "@/components/FileBrowser"

export default function Page() {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h1 className="text-5xl mb-4">File Browser</h1>
          <p>
            This is a complete example of Filenest. <br />
            Filenest lets you view your external files and folders. You can also upload
            new files or update existing ones.
          </p>
        </div>
        <div className="p-6 bg-zinc-950/25 rounded-lg">
          <h3 className="text-2xl mb-4">Tips:</h3>
          <ul>
            <li>
              Use <kbd>CTRL/CMD + LMB</kbd> or <kbd>Shift + LMB</kbd>
              to select multiple files.
            </li>
            <li>
              Use <kbd>CTRL/CMD + Double Click</kbd> to deselect all files.
            </li>
          </ul>
        </div>
      </div>
      <FileBrowser />

      <div className="size-128 absolute top-0 bg-cyan-500 blur-[100px] z-[-1] opacity-25" />
      <div className="size-128 absolute top-32 left-64 bg-emerald-500 blur-[100px] z-[-1] opacity-25" />
      <div className="size-128 absolute top-0 left-128 bg-purple-500 blur-[100px] z-[-1] opacity-25" />
    </div>
  )
}
