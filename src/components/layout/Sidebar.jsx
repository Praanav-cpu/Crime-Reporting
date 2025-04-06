"use client"

import React from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Home, FileText, List, BarChart2, Search, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const SidebarComponent = () => {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navItems = [
    { title: "Dashboard", path: "/dashboard", icon: Home },
    { title: "Report Crime", path: "/report-crime", icon: FileText },
    { title: "Cases", path: "/cases", icon: List },
    { title: "Analytics", path: "/analytics", icon: BarChart2 },
    { title: "Missing Items", path: "/missing", icon: Search },
  ]

  // Add admin routes if user is admin
  if (user?.role === "admin") {
    navItems.push({ title: "User Management", path: "/admin/users", icon: Users })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <SidebarProvider>
      <Sidebar variant="floating" className="border-r border-gray-200">
        <div className="md:hidden p-4">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        <SidebarContent className={`${isMobileMenuOpen ? "block" : "hidden"} md:block`}>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-md transition-colors ${
                        isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

export default SidebarComponent

