"use client"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { getAllReports, updateReportStatus } from "../services/crime"
import { useAuth } from "../hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileText, Filter, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const CasesPage = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Check if we have a success message from report submission
    if (location.state?.success) {
      setShowSuccess(true)
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        // If user is citizen, only fetch their reports
        const userId = user?.role === "citizen" ? user.id : null
        const data = await getAllReports(userId, filters)
        setReports(data)
      } catch (err) {
        setError("Failed to load reports. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [user, filters])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      type: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    })
  }

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus)
      // Update the report in the local state
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date().toISOString() } : report,
        ),
      )
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Investigating":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCrimeTypeLabel = (type) => {
    const types = {
      theft: "Theft",
      burglary: "Burglary",
      assault: "Assault",
      vandalism: "Vandalism",
      fraud: "Fraud",
      harassment: "Harassment",
      suspicious: "Suspicious Activity",
      other: "Other",
    }
    return types[type] || type
  }

  const filteredReports = reports.filter((report) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        report.title.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.location.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
        <Button asChild>
          <Link to="/report-crime">
            <FileText className="mr-2 h-4 w-4" />
            Report Crime
          </Link>
        </Button>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            Your crime report has been submitted successfully.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Cases</CardTitle>
              <CardDescription>
                {user?.role === "citizen"
                  ? "View and manage your submitted reports"
                  : "View and manage all crime reports"}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Filter Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Investigating">Investigating</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Crime Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="burglary">Burglary</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="suspicious">Suspicious Activity</SelectItem>
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
              <div className="flex items-center mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by title, description or location"
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
                <Button variant="ghost" onClick={resetFilters} className="ml-2">
                  Reset
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reports found</p>
              <Button asChild className="mt-4">
                <Link to="/report-crime">Report a Crime</Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="investigating">Investigating</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {renderReportList(filteredReports)}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {renderReportList(filteredReports.filter((r) => r.status === "Pending"))}
              </TabsContent>

              <TabsContent value="investigating" className="space-y-4">
                {renderReportList(filteredReports.filter((r) => r.status === "Investigating"))}
              </TabsContent>

              <TabsContent value="resolved" className="space-y-4">
                {renderReportList(filteredReports.filter((r) => r.status === "Resolved"))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )

  function renderReportList(reports) {
    return reports.length === 0 ? (
      <p className="text-center py-4 text-gray-500">No reports in this category</p>
    ) : (
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{report.title}</h3>
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{report.description.substring(0, 100)}...</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{getCrimeTypeLabel(report.type)}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{report.location}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {new Date(report.date).toLocaleDateString()} at {report.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/cases/${report.id}`}>View Details</Link>
                </Button>

                {(user?.role === "admin" || user?.role === "police") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(report.id, "Pending")}
                        disabled={report.status === "Pending"}
                      >
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(report.id, "Investigating")}
                        disabled={report.status === "Investigating"}
                      >
                        Mark as Investigating
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(report.id, "Resolved")}
                        disabled={report.status === "Resolved"}
                      >
                        Mark as Resolved
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default CasesPage

