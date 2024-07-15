"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"

export interface SearchBarProps extends React.ComponentPropsWithoutRef<"input"> {
    asChild?: boolean
    location: "current" | "global"
}

export const SearchBar = ({ asChild, location, ...props }: SearchBarProps) => {
    const { handleSearch } = useGlobalContext()

    const Comp = asChild ? Slot : "input"

    const minLength = Number(props.minLength) || Number(props.min) || 1

    return (
        <Comp
            {...props}
            onChange={(e) => {
                if (e.target.value.length >= minLength || e.target.value === "") {
                    handleSearch(e.target.value, location)
                }
            }}
        />
    )
}
