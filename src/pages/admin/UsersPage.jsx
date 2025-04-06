"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreHorizontal, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "citizen",
    status: "active",
    phone: "(123) 456-7890",
    createdAt: "2023-01-15T10:30:00Z",
    reports: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "police",
    status: "active",
    phone: "(123) 456-7891",
    createdAt: "2023-02-20T14:45:00Z",
    reports: 0,
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    phone: "(123) 456-7892",
    createdAt: "2022-11-10T09:15:00Z",
    reports: 0,
  },
  {
    id: 4,
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "citizen",
    status: "inactive",
    phone: "(123) 456-7893",
    createdAt: "2023-03-05T16:20:00Z",
    reports: 2,
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "police",
    status: "active",
    phone: "(123) 456-7894",
    createdAt: "2023-03-15T11:10:00Z",
    reports: 0,
  },
]

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "citizen",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUsers(mockUsers)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      role: "",
      status: "",
    })
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUserData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRoleChange = (value) => {
    setNewUserData((prev) => ({ ...prev, role: value }))
  }

  const validateForm = () => {
    const errors = {}
    if (!newUserData.name) errors.name = "Name is required"
    if (!newUserData.email) errors.email = "Email is required"
    if (!newUserData.phone) errors.phone = "Phone is required"
    if (!newUserData.password) errors.password = "Password is required"
    if (newUserData.password.length < 8) errors.password = "Password must be at least 8 characters"
    if (newUserData.password !== newUserData.confirmPassword) errors.confirmPassword = "Passwords do not match"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddUser = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // In a real app, this would send the data to the server
    const newUser = {
      id: users.length + 1,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: "active",
      phone: newUserData.phone,
      createdAt: new Date().toISOString(),
      reports: 0,
    }

    setUsers((prev) => [...prev, newUser])
    setShowAddUserDialog(false)
    setNewUserData({
      name: "",
      email: "",
      role: "citizen",
      phone: "",
      password: "",
      confirmPassword: "",
    })
  }

  const handleUpdateUserStatus = (userId, newStatus) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  const handleUpdateUserRole = (userId, newRole) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !user.name.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query) &&
        !user.phone.includes(query)
      ) {
        return false
      }
    }

    // Filter by role
    if (filters.role && user.role !== filters.role) return false

    // Filter by status
    if (filters.status && user.status !== filters.status) return false

    return true
  })

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "police":
        return "bg-blue-100 text-blue-800"
      case "citizen":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button onClick={() => setShowAddUserDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage system users and their permissions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email or phone"
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {showFilters && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Filter Users</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="police">Police</SelectItem>
                        <SelectItem value="citizen">Citizen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="ghost" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Email</th>
                        <th className="py-3 px-4 text-left font-medium">Role</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Reports</th>
                        <th className="py-3 px-4 text-left font-medium">Joined</th>
                        <th className="py-3 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadgeColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{user.reports}</td>
                          <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Change Role
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="ml-auto">
                                      <span className="sr-only">Change Role</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onClick={() => handleUpdateUserRole(user.id, "admin")}
                                        disabled={user.role === "admin"}
                                      >
                                        Admin
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleUpdateUserRole(user.id, "police")}
                                        disabled={user.role === "police"}
                                      >
                                        Police
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleUpdateUserRole(user.id, "citizen")}
                                        disabled={user.role === "citizen"}
                                      >
                                        Citizen
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "active" ? (
                                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, "inactive")}>
                                    Deactivate User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, "active")}>
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account in the system</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={newUserData.name}
                onChange={handleNewUserChange}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={newUserData.email}
                onChange={handleNewUserChange}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                value={newUserData.phone}
                onChange={handleNewUserChange}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUserData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="citizen">Citizen</SelectItem>
                  <SelectItem value="police">Police</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={newUserData.password}
                onChange={handleNewUserChange}
                className={formErrors.password ? "border-red-500" : ""}
              />
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={newUserData.confirmPassword}
                onChange={handleNewUserChange}
                className={formErrors.confirmPassword ? "border-red-500" : ""}
              />
              {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UsersPage

