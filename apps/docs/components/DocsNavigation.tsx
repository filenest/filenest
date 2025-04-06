"use client"

import React from "react"
import { cx } from "@/lib/cva"
import { defaultOpenGroups, DocsMenuChild, navigation } from "@/lib/docs-navigation"
import Link from "next/link"
import { Accordion } from "radix-ui"
import { ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"

export const DocsNavigation = () => {
  return (
    <Accordion.Root type="multiple" defaultValue={defaultOpenGroups}>
      {navigation.map((group, index) => (
        <Accordion.Item key={index} value={group.title}>
          <Accordion.Header asChild>
            <Accordion.Trigger
              className={cx(
                "accordion-trigger flex items-center justify-between gap-2 w-full",
                "px-6 py-4 border-b border-fn-800"
              )}
            >
              <div className="flex items-center gap-2">
                {React.isValidElement(group.icon) &&
                  React.cloneElement(group.icon as any, { className: "text-fn-300" })}
                <h4 className="font-mono">{group.title}</h4>
              </div>
              <div>
                <ChevronDown className="accordion-chevron text-fn-300" />
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="accordion-content overflow-hidden border-l border-fn-800 ml-4">
            {group.children.map((itemOrGroup, index) => (
              <NavigationItemChildren key={index} child={itemOrGroup} />
            ))}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const NavigationItemChildren = ({ child }: { child: DocsMenuChild }) => {
  const pathname = usePathname()

  if (child.type === "group")
    return (
      <div>
        <h5 className="font-mono">{child.title}</h5>
        {child.children.map((item) => (
          <NavigationItemChildren key={item.title} child={item} />
        ))}
      </div>
    )

  return (
    <Link
      href={child.path}
      className={cx(
        "block py-1 px-4 text-fn-200 hover:text-fn-50",
        pathname === child.path && "text-fn-50"
      )}
    >
      {child.title}
    </Link>
  )
}
