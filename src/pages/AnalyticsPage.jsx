"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { BarChart2, LineChartIcon, PieChartIcon } from "lucide-react"

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("month")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    crimesByType: [],
    crimesByMonth: [],
    crimesByLocation: [],
  })

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchData = async () => {
      setLoading(true)

      // Mock data
      const mockCrimesByType = [
        { name: "Theft", value: 35 },
        { name: "Vandalism", value: 25 },
        { name: "Assault", value: 15 },
        { name: "Fraud", value: 10 },
        { name: "Suspicious", value: 8 },
        { name: "Other", value: 7 },
      ]

      const mockCrimesByMonth = [
        { name: "Jan", value: 12 },
        { name: "Feb", value: 15 },
        { name: "Mar", value: 18 },
        { name: "Apr", value: 14 },
        { name: "May", value: 22 },
        { name: "Jun", value: 19 },
        { name: "Jul", value: 23 },
        { name: "Aug", value: 25 },
        { name: "Sep", value: 17 },
        { name: "Oct", value: 21 },
        { name: "Nov", value: 16 },
        { name: "Dec", value: 14 },
      ]

      const mockCrimesByLocation = [
        { name: "Downtown", value: 45 },
        { name: "Westside", value: 28 },
        { name: "Northside", value: 32 },
        { name: "Eastside", value: 19 },
        { name: "Southside", value: 26 },
      ]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setData({
        crimesByType: mockCrimesByType,
        crimesByMonth: mockCrimesByMonth,
        crimesByLocation: mockCrimesByLocation,
      })

      setLoading(false)
    }

    fetchData()
  }, [timeRange])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-gray-500">+12% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <PieChartIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-gray-500">+5% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <LineChartIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 days</div>
            <p className="text-xs text-gray-500">-0.8 days from previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crime Types Distribution</CardTitle>
              <CardDescription>Breakdown of reported crimes by category</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <PieChart
                  data={data.crimesByType}
                  index="name"
                  categories={["value"]}
                  valueFormatter={(value) => `${value} reports`}
                  colors={["blue", "cyan", "indigo", "violet", "fuchsia", "pink"]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crime Reports Over Time</CardTitle>
              <CardDescription>Monthly trend of reported incidents</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <LineChart
                  data={data.crimesByMonth}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} reports`}
                  showLegend={false}
                  showYAxis={true}
                  showXAxis={true}
                  showGridLines={true}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crime Reports by Location</CardTitle>
              <CardDescription>Distribution of incidents across different areas</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <BarChart
                  data={data.crimesByLocation}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} reports`}
                  showLegend={false}
                  showYAxis={true}
                  showXAxis={true}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crime Map</CardTitle>
              <CardDescription>Geographic visualization of reported incidents</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center p-8">
                <p className="text-gray-500 mb-2">Map visualization would be displayed here</p>
                <p className="text-sm text-gray-400">Using Leaflet.js or Google Maps API to show crime locations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AnalyticsPage

