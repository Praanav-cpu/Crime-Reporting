import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Footer from "./Footer"

const PageContainer = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default PageContainer

