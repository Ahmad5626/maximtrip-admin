"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash,
  X,
  Eye,
  ImageIcon,
  Upload,
} from "lucide-react"
import { useAuth } from "../contexts/authContext"
import { toast, Toaster } from "sonner"
import { uploadFile } from "../server/uploadImg"
import TiptapEditor from "./TiptapEditor"
import { baseApi } from "../utils/constant"

function App() {
  // Get real data from your backend via useAuth hook
  const { packegesData, fetchPackegesData } = useAuth()

  // State management
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editedItem, setEditedItem] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState(null)
  const [imageEditMode, setImageEditMode] = useState({})
  const [uploadingImages, setUploadingImages] = useState({})
  const [loading, setLoading] = useState(true)

  // File input refs
  const featureImageInputRef = useRef(null)

  // Define visible columns based on ALL your form fields
  const [visibleColumns, setVisibleColumns] = useState({
    headline: true,
    days: true,
    address: true,
    overview: true,
    featureImage: true,
    multipleImages: true,
    price: true,
    originalPrice: true,
    category: true,
    itinerary: true,
    inclusions: true,
    exclusions: true,
    termsAndConditions: true,
    createdAt: true,
  })

  // Initialize data with packegesData from your backend
  useEffect(() => {
    if (packegesData && Array.isArray(packegesData)) {
      console.log("Packages data loaded:", packegesData)
      setData(packegesData)
      setFilteredData(packegesData)
      setLoading(false)
    } else if (packegesData === null) {
      // Still loading
      setLoading(true)
    } else {
      // Empty array or no data
      setData([])
      setFilteredData([])
      setLoading(false)
    }
  }, [packegesData])

  // Fetch data on component mount if not already loaded
  useEffect(() => {
    if (fetchPackegesData && (!packegesData || packegesData.length === 0)) {
      fetchPackegesData()
    }
  }, [fetchPackegesData, packegesData])

  // Filter and sort data
  useEffect(() => {
    let filtered = [...data]

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) => {
        const searchFields = [
          item.headline,
          item.location,
          item.overview,
          item.packageCategory,
          item.days,
          item.bestPrice?.toString(),
        ]

        return searchFields.some((field) => field?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      })
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], a)
          : a[sortConfig.key]
        const bValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], b)
          : b[sortConfig.key]

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredData(filtered)
    // Reset to first page when data changes
    setCurrentPage(1)
  }, [searchTerm, data, sortConfig])

  // Sort data
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Pagination calculations - Fixed
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  // Ensure current page is valid when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  // Generate page numbers for pagination - Fixed
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // Handle page change - Fixed
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectedRows.length === currentItems.length && currentItems.length > 0) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentItems.map((item) => item._id || item.id || ""))
    }
  }

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    })
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format Price
  const formatPrice = (amount) => {
    if (typeof amount === "number") {
      return `₹${amount.toLocaleString("en-IN")}`
    }
    if (typeof amount === "string" && amount.startsWith("₹")) {
      return amount
    }
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`
  }

  // Handle edit item
  const handleEditItem = (item) => {
    setSelectedItem(item)
    setEditedItem({ ...item })
    setShowEditModal(true)
    setActionMenuOpen(null)
    setImageEditMode({}) // Reset image edit mode
  }

  // Handle delete item - Fixed API endpoint
  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      return // If the user cancels the deletion, exit the function
    }

    try {
      const packageId = item._id || item.id
      const response = await fetch(`${baseApi}/v1/api/delete-packeges/${packageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Deletion failed")
      }

      // Update local state
      const newData = data.filter((i) => (i._id || i.id) !== packageId)
      setData(newData)

      toast.success("Package deleted successfully!")
    } catch (error) {
      console.error("Error deleting package:", error)
      toast.error(`Failed to delete package: ${error.message}`)
    }
  }

  // Fixed handleInputChange function
  const handleInputChange = (name, value) => {
    setEditedItem((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  // Handle image upload for images
  const handleImageUpload = async (file, type, index = null) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (max 10MB for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB")
      return
    }

    const uploadKey = type === "featureImage" ? "featureImage" : `gallery-${index || Date.now()}`
    setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }))

    try {
      // Upload to Cloudinary using your uploadFile function
      const cloudinaryUrl = await uploadFile(file)

      if (cloudinaryUrl) {
        if (type === "featureImage") {
          handleInputChange("featureImage", cloudinaryUrl)
        } else if (type === "gallery") {
          const currentImages = editedItem?.multipleImages || []
          if (index !== null) {
            const newImages = [...currentImages]
            newImages[index] = cloudinaryUrl
            handleInputChange("multipleImages", newImages)
          } else {
            handleInputChange("multipleImages", [...currentImages, cloudinaryUrl])
          }
        }

        toast.success("Image uploaded successfully to Cloudinary")
      } else {
        throw new Error("Failed to upload to Cloudinary")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image to Cloudinary")
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }))
    }
  }

  // Handle image editing
  const handleImageEdit = (field, value, index) => {
    if (!editedItem) return

    if (field === "featureImage") {
      handleInputChange("featureImage", value)
    } else if (field === "multipleImages") {
      const newImages = [...(editedItem.multipleImages || [])]
      if (index !== undefined) {
        newImages[index] = value
      } else {
        newImages.push(value)
      }
      handleInputChange("multipleImages", newImages)
    }
  }

  const handleRemoveImage = (index) => {
    if (!editedItem) return
    const newImages = editedItem.multipleImages?.filter((_, i) => i !== index) || []
    handleInputChange("multipleImages", newImages)
  }

  // Save edited item - Fixed API endpoint
  const handleSaveEdit = async () => {
    if (!editedItem) return

    // Validate required fields
    if (!editedItem.headline?.trim()) {
      toast.error("Package headline is required")
      return
    }
    if (!editedItem.bestPrice || Number(editedItem.bestPrice) <= 0) {
      toast.error("Valid bestPrice is required")
      return
    }

    try {
      const packageId = editedItem._id || editedItem.id

      // Prepare complete data object with all fields
      const updateData = {
        headline: editedItem.headline,
        days: editedItem.days,
        location: editedItem.location, // Fixed: was mapping to 'address'
        overview: editedItem.overview,
        featureImage: editedItem.featureImage,
        bestPrice: Number(editedItem.bestPrice),
        maxPrice: editedItem.maxPrice ? Number(editedItem.maxPrice) : undefined,
        slug: editedItem.slug, // Added slug
        rating: editedItem.rating, // Added rating
        cityRoute: editedItem.cityRoute, // Added cityRoute
        showInSlider: editedItem.showInSlider, // Added showInSlider

        packageCategory: editedItem.packageCategory,
        highlights: editedItem.highlights, // Added highlights
        meals: editedItem.meals, // Added meals
        transfer: editedItem.transfer, // Added transfer
        hotel: editedItem.hotel, // Added hotel
        sightseeing: editedItem.sightseeing, // Added sightseeing
        shortDescription: editedItem.shortDescription, // Added shortDescription
        longDescription: editedItem.longDescription, // Added longDescription
        cancellationPolicies: editedItem.cancellationPolicies, // Added cancellationPolicies
        extraTitle: editedItem.extraTitle, // Added extraTitle
        metaDescription: editedItem.metaDescription, // Added metaDescription
        metaKeywords: editedItem.metaKeywords, // Added metaKeywords
        itinerary: editedItem.itinerary || [],
        inclusions: editedItem.inclusions?.filter((item) => item.trim() !== "") || [],
        exclusions: editedItem.exclusions?.filter((item) => item.trim() !== "") || [],
        termsAndConditions: editedItem.termsAndConditions
      }

      console.log("Updating package with data:", updateData)

      const response = await fetch(`${baseApi}/v1/api/update-packeges/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Update response:", result)

      if (!result.success) {
        throw new Error(result.message || "Update failed")
      }

      const updatedData = result.data

      // Update local state
      const newData = data.map((item) => {
        if ((item._id || item.id) === packageId) {
          return updatedData
        }
        return item
      })

      setData(newData)

      setShowEditModal(false)
      setSelectedItem(null)
      setEditedItem(null)
      setImageEditMode({})
      toast.success("Package updated successfully!")

      // Refresh data from backend
      if (fetchPackegesData) {
        fetchPackegesData()
      }
    } catch (error) {
      console.error("Error updating package:", error)
      toast.error(`Failed to update package: ${error.message}`)
    }
  }

  // Show loading state if data is still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <div className="text-gray-600">Loading package data...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
                  <p className="text-gray-600 mt-2">Manage your travel packages and campaigns</p>
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{totalItems} packages</span>
                    {selectedRows.length > 0 && (
                      <span className="ml-3 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {selectedRows.length} selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search packages..."
                      className="pl-10 pr-4 py-3 w-full sm:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Columns Filter */}
                  <div className="relative">
                    <button
                      className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[120px]"
                      onClick={() => setColumnsOpen(!columnsOpen)}
                    >
                      <span className="text-sm font-medium text-gray-700">Columns</span>
                      <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                    </button>

                    {columnsOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Toggle Columns</h4>
                          {Object.keys(visibleColumns).map((column) => (
                            <div key={column} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                              <input
                                type="checkbox"
                                id={`column-${column}`}
                                checked={visibleColumns[column]}
                                onChange={() => toggleColumn(column)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <label htmlFor={`column-${column}`} className="ml-3 text-sm text-gray-700 capitalize">
                                {column.replace(/([A-Z])/g, " $1").trim()}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Controls */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                {selectedRows.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                      Delete Selected ({selectedRows.length})
                    </button>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                Showing {Math.min(indexOfFirstItem + 1, totalItems)} to {Math.min(indexOfLastItem, totalItems)} of{" "}
                {totalItems} results
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>

                  {visibleColumns.headline && (
                    <th
                      className="px-6 py-4 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors min-w-[200px]"
                      onClick={() => requestSort("headline")}
                    >
                      <div className="flex items-center">
                        Package Title
                        {sortConfig.key === "headline" ? (
                          sortConfig.direction === "ascending" ? (
                            <ChevronUp className="h-4 w-4 ml-1 text-blue-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1 text-blue-600" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1 text-gray-300" />
                        )}
                      </div>
                    </th>
                  )}

                  {visibleColumns.days && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[100px]">Duration</th>
                  )}

                  {visibleColumns.address && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">location</th>
                  )}

                  {visibleColumns.category && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[120px]">Category</th>
                  )}

                  {visibleColumns.bestPrice && (
                    <th
                      className="px-6 py-4 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors min-w-[120px]"
                      onClick={() => requestSort("bestPrice")}
                    >
                      <div className="flex items-center">
                        Price
                        {sortConfig.key === "price" ? (
                          sortConfig.direction === "ascending" ? (
                            <ChevronUp className="h-4 w-4 ml-1 text-blue-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1 text-blue-600" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1 text-gray-300" />
                        )}
                      </div>
                    </th>
                  )}

                  {visibleColumns.featureImage && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[120px]">
                      featureImage Image
                    </th>
                  )}

                  {visibleColumns.itinerary && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">Itinerary</th>
                  )}

                  {visibleColumns.inclusions && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">Inclusions</th>
                  )}

                  {visibleColumns.exclusions && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">Exclusions</th>
                  )}
{/* 
                  {visibleColumns.termsAndConditions && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">
                      Terms & Conditions
                    </th>
                  )} */}

                  <th className="px-6 py-4 text-right font-semibold text-gray-900 w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item._id || item.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item._id || item.id || "")}
                          onChange={() => handleSelectRow(item._id || item.id || "")}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>

                      {visibleColumns.headline && (
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 text-sm">{item.headline}</div>
                        </td>
                      )}

                      {visibleColumns.days && (
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.days}
                          </span>
                        </td>
                      )}

                      {visibleColumns.address && (
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="max-w-[150px] truncate" title={item.location}>
                            {item.location}
                          </div>
                        </td>
                      )}

                      {visibleColumns.category && (
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.packageCategory}
                          </span>
                        </td>
                      )}

                      {visibleColumns.bestPrice && (
                        <td className="px-6 py-4">
                          <div className="font-bold text-green-600 text-sm">{formatPrice(item.bestPrice)}</div>
                        </td>
                      )}

                      {visibleColumns.featureImage && (
                        <td className="px-6 py-4">
                          {item.featureImage ? (
                            <div className="relative group">
                              <img
                                src={item.featureImage || "/placeholder.svg?height=60&width=60"}
                                alt="featureImage"
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=60&width=60"
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                      )}

                      {visibleColumns.itinerary && (
                        <td className="px-6 py-4">
                          {item.itinerary && item.itinerary.length > 0 ? (
                            <div className="text-sm text-gray-600">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {item.itinerary.length} days planned
                              </span>
                              <div className="mt-1 text-xs text-gray-500 truncate max-w-[120px]">
                                {item.itinerary[0]?.title}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No itinerary</span>
                          )}
                        </td>
                      )}

                      {visibleColumns.inclusions && (
                        <td className="px-6 py-4">
                          {item.inclusions && item.inclusions.length > 0 ? (
                            <div className="text-sm text-gray-600">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.inclusions.length} items
                              </span>
                              <div className="mt-1 text-xs text-gray-500 truncate max-w-[120px]">
                                {item.inclusions[0]}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No inclusions</span>
                          )}
                        </td>
                      )}

                      {visibleColumns.exclusions && (
                        <td className="px-6 py-4">
                          {item.exclusions && item.exclusions.length > 0 ? (
                            <div className="text-sm text-gray-600">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {item.exclusions.length} items
                              </span>
                              <div className="mt-1 text-xs text-gray-500 truncate max-w-[120px]">
                                {item.exclusions[0]}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No exclusions</span>
                          )}
                        </td>
                      )}

                      {/* {visibleColumns.termsAndConditions && (
                        <td className="px-6 py-4">
                          {item.termsAndConditions && item.termsAndConditions.length > 0 ? (
                            <div className="text-sm text-gray-600">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {item.termsAndConditions.length} terms
                              </span>
                              <div className="mt-1 text-xs text-gray-500 truncate max-w-[120px]">
                                {item.termsAndConditions}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No terms</span>
                          )}
                        </td>
                      )} */}

                      <td className="px-6 py-4 text-right relative">
                        <button
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === (item._id || item.id) ? null : item._id || item.id || "",
                            )
                          }
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {actionMenuOpen === (item._id || item.id) && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 py-1">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-4 w-4 mr-3 text-blue-500" />
                              Edit Package
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash className="h-4 w-4 mr-3" />
                              Delete Package
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Object.values(visibleColumns).filter(Boolean).length + 2}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Search className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-xl font-medium text-gray-900 mb-2">No packages found</p>
                        <p className="text-sm text-gray-500">
                          {searchTerm ? "Try adjusting your search criteria" : "No packages available yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Fixed Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Page {currentPage} of {totalPages} ({totalItems} total results)
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300"
                  }`}
                >
                  First
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>

                {getPageNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
                    disabled={pageNum === "..."}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white shadow-sm"
                        : pageNum === "..."
                          ? "text-gray-400 cursor-default"
                          : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300"
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300"
                  }`}
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full left-20">
            <div className="relative top-20 mx-auto p-5 border w-[70%] shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Package</h3>
              <div className="mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.headline || ""}
                    onChange={(e) => handleInputChange("headline", e.target.value)}
                    placeholder="Enter package headline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.days || ""}
                    onChange={(e) => handleInputChange("days", e.target.value)}
                    placeholder="Enter days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Category</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.packageCategory || ""}
                    onChange={(e) => handleInputChange("packageCategory", e.target.value)}
                    placeholder="Enter package category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Best Price</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.bestPrice || ""}
                    onChange={(e) => handleInputChange("bestPrice", e.target.value)}
                    placeholder="Enter best price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.maxPrice || ""}
                    onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                    placeholder="Enter max price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.slug || ""}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="Enter Slug"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.rating || ""}
                    onChange={(e) => handleInputChange("rating", e.target.value)}
                    placeholder="Enter rating"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City Route</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.cityRoute || ""}
                    onChange={(e) => handleInputChange("cityRoute", e.target.value)}
                    placeholder="Enter city route"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">showInSlider</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.showInSlider }
                    onChange={(e) => handleInputChange("showInSlider", e.target.value )}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                  <TiptapEditor
                    className="max-h-[300px] overflow-y-auto w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.overview || ""}
                    onChange={(content) => handleInputChange("overview", content)}
                    placeholder="Enter package overview"
                   
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                  <TiptapEditor
                    className="max-h-[300px] overflow-y-auto w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.highlights || ""}
                    onChange={(content) => handleInputChange("highlights", content)}
                    placeholder="Enter package highlights"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meals</label>
                  <TiptapEditor
                    className="max-h-[300px] overflow-y-auto w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.meals || ""}
                    onChange={(content) => handleInputChange("meals", content)}
                    placeholder="Enter package meals"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transfer</label>
                  <TiptapEditor
                    className="max-h-[300px] overflow-y-auto w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.transfer || ""}
                    onChange={(content) => handleInputChange("transfer", content)}
                    placeholder="Enter package transfer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hotel</label>
                  <TiptapEditor
                    className="max-h-[300px] overflow-y-auto w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.hotel || ""}
                    onChange={(content) => handleInputChange("hotel", content)}
                    placeholder="Enter package hotel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sightseeing</label>
                  <TiptapEditor
                    className="max-h-[300px] overflow-y-auto w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.sightseeing || ""}
                    onChange={(content) => handleInputChange("sightseeing", content)}
                    placeholder="Enter package sightseeing"
                  />
                </div>

                {/* Feature Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Feature Image</label>
                  <div className="space-y-3">
                    {editedItem?.featureImage && (
                      <div className="relative group">
                        <img
                          src={editedItem.featureImage || "/placeholder.svg?height=200&width=300"}
                          alt="feature"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => featureImageInputRef.current?.click()}
                              className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm shadow-lg hover:bg-gray-50"
                              disabled={uploadingImages.featureImage}
                            >
                              {uploadingImages.featureImage ? "Uploading..." : "Change"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => featureImageInputRef.current?.click()}
                        className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center bg-white"
                        disabled={uploadingImages.featureImage}
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        {uploadingImages.featureImage
                          ? "Uploading to Cloudinary..."
                          : editedItem?.featureImage
                            ? "Change Feature Image"
                            : "Upload Feature Image"}
                      </button>

                      {!imageEditMode.featureImage && (
                        <button
                          onClick={() => setImageEditMode({ ...imageEditMode, featureImage: true })}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          URL
                        </button>
                      )}
                    </div>

                    {imageEditMode.featureImage && (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editedItem?.featureImage || ""}
                          onChange={(e) => handleImageEdit("featureImage", e.target.value)}
                          placeholder="Enter feature image URL"
                        />
                        <button
                          onClick={() => setImageEditMode({ ...imageEditMode, featureImage: false })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <input
                      ref={featureImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file, "featureImage")
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.extraTitle || ""}
                    onChange={(e) => handleInputChange("extraTitle", e.target.value)}
                    placeholder="Enter extra title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.metaDescription || ""}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    placeholder="Enter meta description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedItem?.metaKeywords || ""}
                    onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                    placeholder="Enter meta keywords"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Itinerary (JSON)</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={JSON.stringify(editedItem?.itinerary || []) || "[]"}
                    onChange={(e) => {
                      try {
                        const parsedValue = JSON.parse(e.target.value)
                        handleInputChange("itinerary", parsedValue)
                      } catch (error) {
                        console.error("Failed to parse itinerary JSON:", error)
                        toast.error("Invalid JSON format for itinerary")
                      }
                    }}
                    placeholder="Enter itinerary as JSON array"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions (Comma Separated)</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={(editedItem?.inclusions || []).join(", ")}
                    onChange={(e) =>
                      handleInputChange(
                        "inclusions",
                        e.target.value.split(",").map((item) => item.trim()),
                      )
                    }
                    placeholder="Enter inclusions, separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions (Comma Separated)</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={(editedItem?.exclusions || []).join(", ")}
                    onChange={(e) =>
                      handleInputChange(
                        "exclusions",
                        e.target.value.split(",").map((item) => item.trim()),
                      )
                    }
                    placeholder="Enter exclusions, separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms and Conditions 
                  </label>
                  <TiptapEditor
                    className="max-h-[300px] overflow-y-auto w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={editedItem?.termsAndConditions || ""}
                    onChange={(content) => handleInputChange("termsAndConditions", content)}
                    placeholder="Enter package hotel"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedItem(null)
                    setEditedItem(null)
                    setImageEditMode({})
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
