import type { IButton } from "../../types/button";
import "./button.scss"

export const Button = ({
  className,
  type,
  children,
  ...props
}: IButton) => {
  return (
    <button
      type={type}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}
