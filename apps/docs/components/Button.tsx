import { cva } from "@/lib/cva"

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
}

export const Button = ({ variant = "primary", className, ...props }: ButtonProps) => {
  const buttonStyles = cva({
    base: ["px-4 py-2 rounded cursor-pointer font-mono", className],
    variants: {
      variant: {
        primary: "bg-fn-50 border border-fn-50 text-fn-950 hover:bg-fn-100",
        secondary: "bg-fn-900 hover:bg-fn-950 border border-fn-800",
        outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
        ghost: "text-gray-800 hover:bg-gray-100",
      },
    },
  })

  return <button {...props} className={buttonStyles({ variant })} />
}
