import { Blocks, CirclePlay, SquareFunction } from "lucide-react"

export type DocsMenuGroup = {
  title: string
  children: DocsMenuChild[]
  icon?: React.ReactNode
  defaultOpen?: boolean
  type: "group"
}

export type DocsMenuItem = {
  title: string
  path: string
  icon?: React.ReactNode
  type: "item"
}

export type DocsMenuChild = DocsMenuGroup | DocsMenuItem

export type DocsNavigation = DocsMenuGroup[]

export const navigation: DocsNavigation = [
  {
    title: "Start Here",
    icon: <CirclePlay />,
    children: [
      {
        title: "Introduction",
        path: "/docs/introduction",
        type: "item",
      },
      {
        title: "Concepts",
        path: "/docs/concepts",
        type: "item",
      },
      {
        title: "Getting Started",
        path: "/docs/getting-started",
        type: "item",
      },
    ],
    defaultOpen: true,
    type: "group",
  },
  {
    title: "Backend",
    icon: <SquareFunction />,
    children: [
      {
        title: "Adapters",
        type: "group",
        children: [
          {
            title: "Next.js",
            path: "/docs/adapters/nextjs",
            type: "item",
          },
          {
            title: "tRPC",
            path: "/docs/adapters/trpc",
            type: "item",
          },
        ]
      },
      {
        title: "Providers",
        type: "group",
        children: [
          {
            title: "Cloudinary",
            path: "/docs/providers/cloudinary",
            type: "item",
          },
          {
            title: "uploadthing",
            path: "/docs/providers/uploadthing",
            type: "item",
          },
        ]
      },
    ],
    defaultOpen: true,
    type: "group"
  },
  {
    title: "Frontend",
    icon: <Blocks />,
    children: [
      {
        title: "Minimal Setup",
        path: "/docs/frontend/minimal-setup",
        type: "item",
      },
      {
        title: "Components",
        type: "group",
        children: [
          {
            title: "Breadcrumbs",
            path: "/docs/frontend/components/breadcrumbs",
            type: "item",
          },
          {
            title: "FileList",
            path: "/docs/frontend/components/file-list",
            type: "item",
          },
          {
            title: "FolderList",
            path: "/docs/frontend/components/folder-list",
            type: "item",
          },
          {
            title: "FolderCreateAction",
            path: "/docs/frontend/components/folder-create-action",
            type: "item",
          },
          {
            title: "LoadMore",
            path: "/docs/frontend/components/load-more",
            type: "item",
          },
          {
            title: "Queue",
            path: "/docs/frontend/components/queue",
            type: "item",
          },
          {
            title: "Root",
            path: "/docs/frontend/components/root",
            type: "item",
          },
          {
            title: "Search",
            path: "/docs/frontend/components/search",
            type: "item",
          },
          {
            title: "Selection",
            path: "/docs/frontend/components/selection",
            type: "item",
          },
          {
            title: "Uploader",
            path: "/docs/frontend/components/uploader",
            type: "item",
          },
        ],
      }
    ],
    defaultOpen: true,
    type: "group"
  },
]

export const defaultOpenGroups = navigation
  .filter((group) => group.defaultOpen)
  .map((group) => group.title)
