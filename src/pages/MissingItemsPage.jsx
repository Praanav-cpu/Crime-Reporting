"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for missing items
const mockMissingItems = [
  {
    id: 1,
    title: "Lost Black Wallet",
    description: "Lost my black leather wallet near Central Park on Saturday evening. Contains ID and credit cards.",
    category: "personal",
    location: "Central Park",
    date: "2023-04-15",
    status: "missing",
    contact: "john@example.com",
    phone: "(123) 456-7890",
    image: "/placeholder.svg?height=200&width=300",
    userId: 1,
    createdAt: "2023-04-16T10:30:00Z",
  },
  {
    id: 2,
    title: "Missing Golden Retriever",
    description:
      "My dog went missing from Westside neighborhood. He is a golden retriever, 3 years old, wearing a blue collar with tags.",
    category: "pet",
    location: "Westside",
    date: "2023-04-17",
    status: "missing",
    contact: "sarah@example.com",
    phone: "(123) 456-7891",
    image: "/placeholder.svg?height=200&width=300",
    userId: 2,
    createdAt: "2023-04-17T14:20:00Z",
  },
  {
    id: 3,
    title: "Found Keys",
    description: "Found a set of keys on Main Street near the library. Has a distinctive keychain with a blue fish.",
    category: "personal",
    location: "Main Street",
    date: "2023-04-16",
    status: "found",
    contact: "mike@example.com",
    phone: "(123) 456-7892",
    image: "/placeholder.svg?height=200&width=300",
    userId: 3,
    createdAt: "2023-04-16T16:45:00Z",
  },
  {
    id: 4,
    title: "Found iPhone",
    description:
      "Found an iPhone with a red case at Downtown Coffee Shop. The phone is locked. Please contact to identify.",
    category: "electronics",
    location: "Downtown",
    date: "2023-04-18",
    status: "found",
    contact: "lisa@example.com",
    phone: "(123) 456-7893",
    image: "/placeholder.svg?height=200&width=300",
    userId: 4,
    createdAt: "2023-04-18T09:15:00Z",
  },
]

const MissingItemsPage = () => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    status: "missing",
    contact: "",
    phone: "",
    image: null,
  })
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch missing items
    const fetchItems = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setItems(mockMissingItems)
      setLoading(false)
    }

    fetchItems()
  }, [])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would send the data to the server
    const newItem = {
      id: items.length + 1,
      ...formData,
      userId: user?.id || 1,
      createdAt: new Date().toISOString(),
      image: formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg?height=200&width=300",
    }

    setItems((prev) => [newItem, ...prev])
    setShowForm(false)
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      date: "",
      status: "missing",
      contact: "",
      phone: "",
      image: null,
    })
  }

  // Filter items based on search query, tab, and filters
  const filteredItems = items.filter((item) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !item.title.toLowerCase().includes(query) &&
        !item.description.toLowerCase().includes(query) &&
        !item.location.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Filter by tab
    if (activeTab === "missing" && item.status !== "missing") return false
    if (activeTab === "found" && item.status !== "found") return false

    // Filter by category
    if (filters.category && item.category !== filters.category) return false

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      if (new Date(item.date) < fromDate) return false
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      if (new Date(item.date) > toDate) return false
    }

    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Missing & Found Items</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "Report Item"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Report Missing or Found Item</CardTitle>
            <CardDescription>Provide details about the item you've lost or found</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Brief title of the item"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Items</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="pet">Pets</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="missing">Missing</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Where was the item lost or found?"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the item"
                  rows={4}
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Email</Label>
                  <Input
                    id="contact"
                    name="contact"
                    type="email"
                    placeholder="Your email address"
                    value={formData.contact}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image (Optional)</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Submit Report</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Browse Items</CardTitle>
              <CardDescription>Search for missing or found items</CardDescription>
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
                placeholder="Search by title, description or location"
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {showFilters && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Filter Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="personal">Personal Items</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="pet">Pets</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="From Date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="To Date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="ghost" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="missing">Missing</TabsTrigger>
                <TabsTrigger value="found">Found</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {renderItemsList(filteredItems)}
              </TabsContent>

              <TabsContent value="missing" className="mt-4">
                {renderItemsList(filteredItems)}
              </TabsContent>

              <TabsContent value="found" className="mt-4">
                {renderItemsList(filteredItems)}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  function renderItemsList(items) {
    if (loading) {
      return (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">No items found</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Report an Item
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-48 w-full object-cover" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium truncate">{item.title}</h3>
                <Badge
                  className={item.status === "missing" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                >
                  {item.status === "missing" ? "Missing" : "Found"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{item.category}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/missing/${item.id}`}>View Details</Link>
              </Button>
              <Button variant="ghost" size="sm">
                Contact
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}

export default MissingItemsPage


