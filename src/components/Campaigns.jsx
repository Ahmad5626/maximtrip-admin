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
  Save,
  Eye,
  ImageIcon,
  Plus,
  Minus,
  Camera,
  Upload,
} from "lucide-react"
import { useAuth } from "../contexts/authContext"
import { toast, Toaster } from "sonner"
import { uploadFile } from "../server/uploadImg"

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
  const heroImageInputRef = useRef(null)
  const galleryImageInputRef = useRef(null)

  // Define visible columns based on ALL your form fields
  const [visibleColumns, setVisibleColumns] = useState({
    headline: true,
    days: true,
    address: true,
    overview: true,
    heroImage: true,
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
          item.address,
          item.overview,
          item.category,
          item.days,
          item.price?.toString(),
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
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:7000/v1/api/delete-packeges/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Delete failed")
      }

      toast.success("Package deleted successfully")

      // Update local state
      const newData = data.filter((item) => (item._id || item.id) !== id)
      setData(newData)

      setActionMenuOpen(null)

      // Refresh data from backend
      if (fetchPackegesData) {
        fetchPackegesData()
      }
    } catch (error) {
      toast.error(`Failed to delete package: ${error.message}`)
      console.error("Error deleting package:", error)
    }
  }

  // Handle input change in edit modal
  const handleInputChange = (field, value) => {
    setEditedItem((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [field]: value,
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

    const uploadKey = type === "hero" ? "hero" : `gallery-${index || Date.now()}`
    setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }))

    try {
      // Upload to Cloudinary using your uploadFile function
      const cloudinaryUrl = await uploadFile(file)

      if (cloudinaryUrl) {
        if (type === "hero") {
          handleInputChange("heroImage", cloudinaryUrl)
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

    if (field === "heroImage") {
      handleInputChange("heroImage", value)
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
    if (!editedItem.price || Number(editedItem.price) <= 0) {
      toast.error("Valid price is required")
      return
    }

    try {
      const packageId = editedItem._id || editedItem.id

      // Prepare complete data object with all fields
      const updateData = {
        headline: editedItem.headline,
        days: editedItem.days,
        address: editedItem.address,
        overview: editedItem.overview,
        heroImage: editedItem.heroImage,
        multipleImages: editedItem.multipleImages || [],
        price: Number(editedItem.price),
        originalPrice: editedItem.originalPrice ? Number(editedItem.originalPrice) : undefined,
        category: editedItem.category,
        itinerary: editedItem.itinerary || [],
        inclusions: editedItem.inclusions?.filter((item) => item.trim() !== "") || [],
        exclusions: editedItem.exclusions?.filter((item) => item.trim() !== "") || [],
        termsAndConditions: editedItem.termsAndConditions?.filter((item) => item.trim() !== "") || [],
      }

      console.log("Updating package with data:", updateData)

      const response = await fetch(`http://localhost:7000/v1/api/update-packeges/${packageId}`, {
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

  // Utility functions
  const truncateText = (text, maxLength = 50) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
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
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">Destination</th>
                  )}

                  {visibleColumns.category && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[120px]">Category</th>
                  )}

                  {visibleColumns.price && (
                    <th
                      className="px-6 py-4 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors min-w-[120px]"
                      onClick={() => requestSort("price")}
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

                  {visibleColumns.heroImage && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[120px]">Hero Image</th>
                  )}

                  {visibleColumns.multipleImages && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[120px]">Gallery</th>
                  )}

                  {visibleColumns.overview && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[200px]">Overview</th>
                  )}

                  {visibleColumns.originalPrice && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[120px]">Original Price</th>
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

                  {visibleColumns.termsAndConditions && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">
                      Terms & Conditions
                    </th>
                  )}

                  {visibleColumns.createdAt && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[120px]">Created</th>
                  )}

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
                          <div className="max-w-[150px] truncate" title={item.address}>
                            {item.address}
                          </div>
                        </td>
                      )}

                      {visibleColumns.category && (
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.category}
                          </span>
                        </td>
                      )}

                      {visibleColumns.price && (
                        <td className="px-6 py-4">
                          <div className="font-bold text-green-600 text-sm">{formatPrice(item.price)}</div>
                        </td>
                      )}

                      {visibleColumns.heroImage && (
                        <td className="px-6 py-4">
                          {item.heroImage ? (
                            <div className="relative group">
                              <img
                                src={item.heroImage || "/placeholder.svg?height=60&width=60"}
                                alt="Hero"
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

                      {visibleColumns.multipleImages && (
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {item.multipleImages?.slice(0, 3).map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={image || "/placeholder.svg?height=40&width=40"}
                                alt={`Gallery ${imgIndex + 1}`}
                                className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=40&width=40"
                                }}
                              />
                            ))}
                            {item.multipleImages && item.multipleImages.length > 3 && (
                              <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  +{item.multipleImages.length - 3}
                                </span>
                              </div>
                            )}
                            {(!item.multipleImages || item.multipleImages.length === 0) && (
                              <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {visibleColumns.overview && (
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="max-w-[200px] truncate" title={item.overview}>
                            {truncateText(item.overview, 60)}
                          </div>
                        </td>
                      )}

                      {visibleColumns.originalPrice && (
                        <td className="px-6 py-4">
                          {item.originalPrice ? (
                            <div className="font-medium text-gray-600 text-sm line-through">
                              {formatPrice(item.originalPrice)}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
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

                      {visibleColumns.termsAndConditions && (
                        <td className="px-6 py-4">
                          {item.termsAndConditions && item.termsAndConditions.length > 0 ? (
                            <div className="text-sm text-gray-600">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {item.termsAndConditions.length} terms
                              </span>
                              <div className="mt-1 text-xs text-gray-500 truncate max-w-[120px]">
                                {item.termsAndConditions[0]}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No terms</span>
                          )}
                        </td>
                      )}

                      {visibleColumns.createdAt && (
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                      )}

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
                              onClick={() => handleDeleteItem(item._id || item.id || "")}
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

        {/* Enhanced Edit Modal with Cloudinary Image Upload - Keep existing modal code */}
        {showEditModal && editedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Package</h3>
                  <p className="text-sm text-gray-600 mt-1">Update package information and images</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditedItem(null)
                    setSelectedItem(null)
                    setImageEditMode({})
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Edit className="h-5 w-5 mr-2 text-blue-600" />
                        Basic Information
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Package Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editedItem.headline || ""}
                            onChange={(e) => handleInputChange("headline", e.target.value)}
                            placeholder="Enter package title"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={editedItem.days || ""}
                              onChange={(e) => handleInputChange("days", e.target.value)}
                              placeholder="e.g., 4 days / 3 nights"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={editedItem.category || ""}
                              onChange={(e) => handleInputChange("category", e.target.value)}
                              placeholder="Enter category"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={
                                typeof editedItem.price === "number"
                                  ? editedItem.price
                                  : editedItem.price?.toString().replace(/[₹,]/g, "") || ""
                              }
                              onChange={(e) => handleInputChange("price", Number(e.target.value) || 0)}
                              placeholder="Enter price"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                            <input
                              type="number"
                              min="0"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={
                                typeof editedItem.originalPrice === "number"
                                  ? editedItem.originalPrice
                                  : editedItem.originalPrice?.toString().replace(/[₹,]/g, "") || ""
                              }
                              onChange={(e) => handleInputChange("originalPrice", Number(e.target.value) || 0)}
                              placeholder="Enter original price"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            value={editedItem.address || ""}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter destination address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            value={editedItem.overview || ""}
                            onChange={(e) => handleInputChange("overview", e.target.value)}
                            placeholder="Enter package overview"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Itinerary Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {editedItem.itinerary?.map((day, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-sm text-gray-900">Day {day.day}</span>
                              <button
                                onClick={() => {
                                  const newItinerary = editedItem.itinerary.filter((_, i) => i !== index)
                                  handleInputChange("itinerary", newItinerary)
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
                              value={day.title || ""}
                              onChange={(e) => {
                                const newItinerary = [...editedItem.itinerary]
                                newItinerary[index] = { ...newItinerary[index], title: e.target.value }
                                handleInputChange("itinerary", newItinerary)
                              }}
                              placeholder="Day title"
                            />
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                              rows={2}
                              value={day.description || ""}
                              onChange={(e) => {
                                const newItinerary = [...editedItem.itinerary]
                                newItinerary[index] = { ...newItinerary[index], description: e.target.value }
                                handleInputChange("itinerary", newItinerary)
                              }}
                              placeholder="Day description"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newDay = {
                              day: (editedItem.itinerary?.length || 0) + 1,
                              title: "",
                              description: "",
                              accommodation: "",
                            }
                            handleInputChange("itinerary", [...(editedItem.itinerary || []), newDay])
                          }}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Day
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Images and Lists */}
                  <div className="space-y-6">
                    {/* Image Management */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Camera className="h-5 w-5 mr-2 text-blue-600" />
                        Image Management
                      </h4>

                      {/* Hero Image */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Hero Image</label>
                        <div className="space-y-3">
                          {editedItem.heroImage && (
                            <div className="relative group">
                              <img
                                src={editedItem.heroImage || "/placeholder.svg?height=200&width=300"}
                                alt="Hero"
                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=200&width=300"
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => heroImageInputRef.current?.click()}
                                    className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm shadow-lg hover:bg-gray-50"
                                    disabled={uploadingImages.hero}
                                  >
                                    {uploadingImages.hero ? "Uploading..." : "Change"}
                                  </button>
                                  <button
                                    onClick={() => handleInputChange("heroImage", "")}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md text-sm shadow-lg hover:bg-red-600"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => heroImageInputRef.current?.click()}
                              className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center bg-white"
                              disabled={uploadingImages.hero}
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              {uploadingImages.hero
                                ? "Uploading to Cloudinary..."
                                : editedItem.heroImage
                                  ? "Change Hero Image"
                                  : "Upload Hero Image"}
                            </button>

                            {!imageEditMode.heroImage && (
                              <button
                                onClick={() => setImageEditMode({ ...imageEditMode, heroImage: true })}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                URL
                              </button>
                            )}
                          </div>

                          {imageEditMode.heroImage && (
                            <div className="flex gap-2">
                              <input
                                type="url"
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={editedItem.heroImage || ""}
                                onChange={(e) => handleImageEdit("heroImage", e.target.value)}
                                placeholder="Enter hero image URL"
                              />
                              <button
                                onClick={() => setImageEditMode({ ...imageEditMode, heroImage: false })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          <input
                            ref={heroImageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleImageUpload(file, "hero")
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Multiple Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Gallery Images</label>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {editedItem.multipleImages?.map((image, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-white"
                            >
                              <img
                                src={image || "/placeholder.svg?height=60&width=60"}
                                alt={`Gallery ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=60&width=60"
                                }}
                              />

                              {imageEditMode[`gallery-${index}`] ? (
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="url"
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={image}
                                    onChange={(e) => handleImageEdit("multipleImages", e.target.value, index)}
                                    placeholder="Image URL"
                                  />
                                  <button
                                    onClick={() => setImageEditMode({ ...imageEditMode, [`gallery-${index}`]: false })}
                                    className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-center justify-between">
                                  <span className="text-sm text-gray-600 truncate">Image {index + 1}</span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        galleryImageInputRef.current?.click()
                                        galleryImageInputRef.current?.setAttribute("data-index", index.toString())
                                      }}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                      disabled={uploadingImages[`gallery-${index}`]}
                                    >
                                      {uploadingImages[`gallery-${index}`] ? "..." : "Change"}
                                    </button>
                                    <button
                                      onClick={() => setImageEditMode({ ...imageEditMode, [`gallery-${index}`]: true })}
                                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                    >
                                      URL
                                    </button>
                                  </div>
                                </div>
                              )}

                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </div>
                          ))}

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                galleryImageInputRef.current?.click()
                                galleryImageInputRef.current?.removeAttribute("data-index")
                              }}
                              className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center bg-white"
                            >
                              <Plus className="h-5 w-5 mr-2" />
                              Upload New Image
                            </button>

                            <button
                              onClick={() => handleImageEdit("multipleImages", "")}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Add URL
                            </button>
                          </div>

                          <input
                            ref={galleryImageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              const indexAttr = e.target.getAttribute("data-index")
                              const index = indexAttr ? Number.parseInt(indexAttr) : null
                              if (file) {
                                handleImageUpload(file, "gallery", index)
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Inclusions</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editedItem.inclusions?.map((inclusion, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 p-2 border border-gray-300 rounded text-sm"
                              value={inclusion}
                              onChange={(e) => {
                                const newInclusions = [...editedItem.inclusions]
                                newInclusions[index] = e.target.value
                                handleInputChange("inclusions", newInclusions)
                              }}
                              placeholder="Enter inclusion"
                            />
                            <button
                              onClick={() => {
                                const newInclusions = editedItem.inclusions.filter((_, i) => i !== index)
                                handleInputChange("inclusions", newInclusions)
                              }}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            handleInputChange("inclusions", [...(editedItem.inclusions || []), ""])
                          }}
                          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center text-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Inclusion
                        </button>
                      </div>
                    </div>

                    {/* Exclusions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Exclusions</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editedItem.exclusions?.map((exclusion, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 p-2 border border-gray-300 rounded text-sm"
                              value={exclusion}
                              onChange={(e) => {
                                const newExclusions = [...editedItem.exclusions]
                                newExclusions[index] = e.target.value
                                handleInputChange("exclusions", newExclusions)
                              }}
                              placeholder="Enter exclusion"
                            />
                            <button
                              onClick={() => {
                                const newExclusions = editedItem.exclusions.filter((_, i) => i !== index)
                                handleInputChange("exclusions", newExclusions)
                              }}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            handleInputChange("exclusions", [...(editedItem.exclusions || []), ""])
                          }}
                          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-red-400 hover:text-red-600 transition-colors flex items-center justify-center text-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Exclusion
                        </button>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editedItem.termsAndConditions?.map((term, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 p-2 border border-gray-300 rounded text-sm"
                              value={term}
                              onChange={(e) => {
                                const newTerms = [...editedItem.termsAndConditions]
                                newTerms[index] = e.target.value
                                handleInputChange("termsAndConditions", newTerms)
                              }}
                              placeholder="Enter term or condition"
                            />
                            <button
                              onClick={() => {
                                const newTerms = editedItem.termsAndConditions.filter((_, i) => i !== index)
                                handleInputChange("termsAndConditions", newTerms)
                              }}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            handleInputChange("termsAndConditions", [...(editedItem.termsAndConditions || []), ""])
                          }}
                          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-yellow-400 hover:text-yellow-600 transition-colors flex items-center justify-center text-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Term
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditedItem(null)
                    setSelectedItem(null)
                    setImageEditMode({})
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSaveEdit}
                  disabled={!editedItem?.headline?.trim() || !editedItem?.price || Number(editedItem.price) <= 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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
