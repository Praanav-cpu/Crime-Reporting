// This is a mock service for crime reports
// In a real application, this would communicate with your backend API

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data for crime reports
const mockCrimeReports = [
  {
    id: 1,
    title: "Stolen Bicycle",
    description: "My bicycle was stolen from outside the library on Main Street.",
    location: "123 Main St",
    latitude: "40.7128",
    longitude: "-74.0060",
    type: "theft",
    date: "2023-04-15",
    time: "14:30",
    status: "Investigating",
    userId: 1,
    createdAt: "2023-04-15T14:45:00Z",
    updatedAt: "2023-04-16T09:30:00Z",
  },
  {
    id: 2,
    title: "Vandalism at Park",
    description: "Graffiti on playground equipment at Central Park.",
    location: "Central Park",
    latitude: "40.7812",
    longitude: "-73.9665",
    type: "vandalism",
    date: "2023-04-14",
    time: "23:15",
    status: "Pending",
    userId: 1,
    createdAt: "2023-04-15T10:20:00Z",
    updatedAt: "2023-04-15T10:20:00Z",
  },
  {
    id: 3,
    title: "Suspicious Activity",
    description: "Person looking into car windows in the mall parking lot.",
    location: "Westfield Mall",
    latitude: "40.7489",
    longitude: "-73.9680",
    type: "suspicious",
    date: "2023-04-16",
    time: "19:45",
    status: "Resolved",
    userId: 2,
    createdAt: "2023-04-16T20:00:00Z",
    updatedAt: "2023-04-18T14:30:00Z",
  },
]

export const getCrimeStats = async () => {
  await delay(800)

  return {
    totalReports: mockCrimeReports.length,
    pendingReports: mockCrimeReports.filter((report) => report.status === "Pending").length,
    resolvedReports: mockCrimeReports.filter((report) => report.status === "Resolved").length,
    byType: {
      theft: mockCrimeReports.filter((report) => report.type === "theft").length,
      vandalism: mockCrimeReports.filter((report) => report.type === "vandalism").length,
      suspicious: mockCrimeReports.filter((report) => report.type === "suspicious").length,
    },
  }
}

export const getRecentReports = async (userId = null) => {
  await delay(1000)

  let reports = [...mockCrimeReports]

  // If userId is provided, filter reports by user
  if (userId) {
    reports = reports.filter((report) => report.userId === userId)
  }

  // Sort by creation date (newest first)
  reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Return only the first 5 reports
  return reports.slice(0, 5)
}

export const getAllReports = async (userId = null, filters = {}) => {
  await delay(1200)

  let reports = [...mockCrimeReports]

  // If userId is provided, filter reports by user
  if (userId) {
    reports = reports.filter((report) => report.userId === userId)
  }

  // Apply filters
  if (filters.status) {
    reports = reports.filter((report) => report.status === filters.status)
  }

  if (filters.type) {
    reports = reports.filter((report) => report.type === filters.type)
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    reports = reports.filter((report) => new Date(report.date) >= fromDate)
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    reports = reports.filter((report) => new Date(report.date) <= toDate)
  }

  // Sort by creation date (newest first)
  reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return reports
}

export const getReportById = async (id) => {
  await delay(800)

  const report = mockCrimeReports.find((report) => report.id === Number.parseInt(id))

  if (!report) {
    throw new Error("Report not found")
  }

  return report
}

export const submitCrimeReport = async (reportData) => {
  await delay(1500)

  // Create a new report
  const newReport = {
    id: mockCrimeReports.length + 1,
    ...reportData,
    status: "Pending",
    userId: 1, // In a real app, this would be the current user's ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Add to mock data
  mockCrimeReports.push(newReport)

  return newReport
}

export const updateReportStatus = async (id, status) => {
  await delay(1000)

  const reportIndex = mockCrimeReports.findIndex((report) => report.id === Number.parseInt(id))

  if (reportIndex === -1) {
    throw new Error("Report not found")
  }

  // Update the report
  mockCrimeReports[reportIndex] = {
    ...mockCrimeReports[reportIndex],
    status,
    updatedAt: new Date().toISOString(),
  }

  return mockCrimeReports[reportIndex]
}

