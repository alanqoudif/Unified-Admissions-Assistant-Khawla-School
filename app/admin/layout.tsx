import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-teal-700 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center">
          <h1 className="text-2xl font-bold">لوحة إدارة دليل القبول الموحد</h1>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-slate-100 text-slate-600 py-3 px-6 text-center text-sm border-t">
        <p>© {new Date().getFullYear()} مدرسة خولة - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}
