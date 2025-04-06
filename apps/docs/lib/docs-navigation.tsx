import { CirclePlay } from "lucide-react"

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
]

export const defaultOpenGroups = navigation
  .filter((group) => group.defaultOpen)
  .map((group) => group.title)
