export function Card({ className = "", children }) {
  return <div className={`border rounded shadow p-4 ${className}`}>{children}</div>
}

export function CardHeader({ className = "", children }) {
  return <div className={`mb-2 ${className}`}>{children}</div>
}

export function CardContent({ className = "", children }) {
  return <div className={`mb-2 ${className}`}>{children}</div>
}

export function CardTitle({ className = "", children }) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
}

export function CardDescription({ className = "", children }) {
  return <p className={`text-gray-600 ${className}`}>{children}</p>
}
