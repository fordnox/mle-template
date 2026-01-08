import { Outlet } from "react-router-dom"
import { Header } from "@/layouts/header.tsx"
import { Footer } from "@/layouts/footer.tsx"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
