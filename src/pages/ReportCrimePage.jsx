"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { submitCrimeReport } from "../services/crime"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, MapPin, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const crimeTypes = [
  { value: "theft", label: "Theft" },
  { value: "burglary", label: "Burglary" },
  { value: "assault", label: "Assault" },
  { value: "vandalism", label: "Vandalism" },
  { value: "fraud", label: "Fraud" },
  { value: "harassment", label: "Harassment" },
  { value: "suspicious", label: "Suspicious Activity" },
  { value: "other", label: "Other" },
]

const ReportCrimePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    type: "",
    date: "",
    time: "",
    images: [],
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const getCurrentLocation = () => {
    setUseCurrentLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            location: "Current Location",
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
          setFormErrors((prev) => ({
            ...prev,
            location: "Failed to get your location. Please enter manually.",
          }))
          setUseCurrentLocation(false)
        },
      )
    } else {
      setFormErrors((prev) => ({
        ...prev,
        location: "Geolocation is not supported by your browser. Please enter location manually.",
      }))
      setUseCurrentLocation(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title) errors.title = "Title is required"
    if (!formData.description) errors.description = "Description is required"
    if (!formData.location && !useCurrentLocation) errors.location = "Location is required"
    if (!formData.type) errors.type = "Crime type is required"
    if (!formData.date) errors.date = "Date is required"
    if (!formData.time) errors.time = "Time is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      await submitCrimeReport(formData)
      navigate("/cases", { state: { success: true } })
    } catch (err) {
      setError(err.message || "Failed to submit report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report a Crime</h1>

      <Card>
        <CardHeader>
          <CardTitle>Crime Report Form</CardTitle>
          <CardDescription>Please provide as much detail as possible about the incident</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief title of the incident"
                  value={formData.title}
                  onChange={handleChange}
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Crime Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.type && <p className="text-sm text-red-500">{formErrors.type}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date of Incident</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={formErrors.date ? "border-red-500" : ""}
                  />
                  {formErrors.date && <p className="text-sm text-red-500">{formErrors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time of Incident</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={formErrors.time ? "border-red-500" : ""}
                  />
                  {formErrors.time && <p className="text-sm text-red-500">{formErrors.time}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    name="location"
                    placeholder="Address or description of location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={useCurrentLocation}
                    className={`flex-1 ${formErrors.location ? "border-red-500" : ""}`}
                  />
                  <Button type="button" variant="outline" onClick={getCurrentLocation} className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {useCurrentLocation ? "Getting Location..." : "Use Current"}
                  </Button>
                </div>
                {formErrors.location && <p className="text-sm text-red-500">{formErrors.location}</p>}

                {useCurrentLocation && formData.latitude && (
                  <div className="text-xs text-gray-500 mt-1">
                    Coordinates: {formData.latitude}, {formData.longitude}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of what happened"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Evidence Images (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="images" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </Label>
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Evidence ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ReportCrimePage

