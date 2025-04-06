// This is a mock service for authentication
// In a real application, this would communicate with your backend API

const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "citizen",
      phone: "(123) 456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      role: "police",
      phone: "(123) 456-7891",
    },
    {
      id: 3,
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      phone: "(123) 456-7892",
    },
  ]
  
  // Simulate API delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  
  export const login = async (credentials) => {
    await delay(1000) // Simulate network delay
  
    const user = mockUsers.find((u) => u.email === credentials.email)
  
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password")
    }
  
    const { password, ...userWithoutPassword } = user
  
    return {
      user: userWithoutPassword,
      token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
    }
  }
  
  export const register = async (userData) => {
    await delay(1000) // Simulate network delay
  
    // Check if user already exists
    if (mockUsers.some((u) => u.email === userData.email)) {
      throw new Error("User with this email already exists")
    }
  
    // Create new user (in a real app, this would be saved to a database)
    const newUser = {
      id: mockUsers.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "citizen", // Default role for new users
      phone: userData.phone,
    }
  
    mockUsers.push(newUser)
  
    const { password, ...userWithoutPassword } = newUser
  
    return {
      user: userWithoutPassword,
      token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
    }
  }
  
  export const logout = async () => {
    await delay(500) // Simulate network delay
    return true
  }
  
  export const getCurrentUser = async () => {
    await delay(500) // Simulate network delay
  
    // In a real app, this would validate the JWT token and return the user
    // For this mock, we'll just return a hardcoded user
    return {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "citizen",
      phone: "(123) 456-7890",
    }
  }
  
  