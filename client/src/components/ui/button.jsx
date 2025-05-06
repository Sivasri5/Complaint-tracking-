export function Button({ variant = "primary", children, ...props }) {
  let className = "px-4 py-2 rounded text-white transition-colors"
  if (variant === "primary") {
    className += " bg-blue-600 hover:bg-blue-700"
  } else if (variant === "outline") {
    className += " border border-blue-600 text-blue-600 hover:bg-blue-50"
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}
