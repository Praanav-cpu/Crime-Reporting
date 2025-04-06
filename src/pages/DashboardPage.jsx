"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { getCrimeStats, getRecentReports } from "../services/crime"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BadgeAlertIcon as Alert, FileText, Shield, Users, BadgeAlertIcon as Alert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    recentReports: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getCrimeStats()
        const recentReports = await getRecentReports()

        setStats({
          totalReports: statsData.totalReports,
          pendingReports: statsData.pendingReports,
          resolvedReports: statsData.resolvedReports,
          recentReports,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100"
      case "Investigating":
        return "text-blue-600 bg-blue-100"
      case "Resolved":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/report-crime">
            <FileText className="mr-2 h-4 w-4" />
            Report Crime
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-gray-500">
              {stats.totalReports > 0 ? "+12% from last month" : "No reports yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Alert className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-gray-500">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedReports}</div>
            <p className="text-xs text-gray-500">Cases closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "admin" ? "Total Users" : "Your Reports"}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role === "admin" ? "245" : stats.totalReports}</div>
            <p className="text-xs text-gray-500">{user?.role === "admin" ? "Active users" : "Reports submitted"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                {user?.role === "admin" ? "Latest crime reports from all users" : "Your latest submitted reports"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : stats.recentReports.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentReports.map((report) => (
                    <div key={report.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                      <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{report.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{report.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          <Link to={`/cases/${report.id}`} className="text-blue-600 hover:underline">
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No reports found</p>
                  <Button asChild className="mt-4">
                    <Link to="/report-crime">Report a Crime</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest activity on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Case #1234 status changed to <span className="font-medium text-blue-600">Investigating</span>
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Case #1230 status changed to <span className="font-medium text-green-600">Resolved</span>
                    </p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      New report submitted: <span className="font-medium">Suspicious activity</span>
                    </p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage

