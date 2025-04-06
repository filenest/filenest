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
        title: "Get Started",
        path: "/docs/get-started",
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
    type: "group"
  },
  {
    title: "Frontend",
    icon: <Blocks />,
    children: [],
    type: "group"
  },
]

export const defaultOpenGroups = navigation
  .filter((group) => group.defaultOpen)
  .map((group) => group.title)
