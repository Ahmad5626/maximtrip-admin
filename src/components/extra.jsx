"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft ,
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
} from "lucide-react"
import CampaignDetails from "../components/CampaignDetails/CampaignDetails"
import { useAuth } from "../contexts/authContext"
import { toast, Toaster } from "sonner"
import { Button } from "./ui/button"
import { initailGivenAmount } from "../config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

function App() {
  // Get real data from your backend via useAuth hook
  const { packegesData } = useAuth()
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
  const [activeTab, setActiveTab] = useState("basic")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [viewingCampaign, setViewingCampaign] = useState(null)
  const [givenAmountFormdata, setGivenAmountFormdata] = useState(initailGivenAmount)
  const [imageEditMode, setImageEditMode] = useState({})

  // Define all columns from the MongoDB schema
  const [visibleColumns, setVisibleColumns] = useState({
    headline: true,
    days: true,
    address: true,
    category: true,
    price: true,
    heroImage: true,
    multipleImages: true,
    overview: true,
  })

  // Initialize data with packegesData from your backend
  useEffect(() => {
    if (packegesData && Array.isArray(packegesData)) {
      setData(packegesData)
      setFilteredData(packegesData)
    }
  }, [packegesData])

  // Filter data based on search term and status filter
  useEffect(() => {
    let filtered = [...data]

    // Apply status filter first
    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply search filter only if there's a search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) => {
        return Object.entries(item).some(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return Object.values(value).some((nestedValue) =>
              String(nestedValue).toLowerCase().includes(searchTerm.toLowerCase()),
            )
          }
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
    }

    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [searchTerm, statusFilter, data])

  // Sort data
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  useEffect(() => {
    if (sortConfig.key && filteredData.length > 0) {
      const sortableItems = [...filteredData]
      sortableItems.sort((a, b) => {
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
      setFilteredData(sortableItems)
    }
  }, [sortConfig])

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Generate page numbers for pagination
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

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200"
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Reject":
        return "bg-red-50 text-red-700 border-red-200"
      case "Terminate":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-IN")
  }

  // Format Price
  const formatPrice = (amount) => {
    if (typeof amount === "number") {
      return `₹${amount.toLocaleString("en-IN")}`
    }
    if (typeof amount === "string" && amount.startsWith("₹")) {
      return amount
    }
    return `₹${amount}`
  }

  // Handle view/edit/delete actions
  const handleViewItem = (item) => {
    setViewingCampaign(item)
    setActionMenuOpen(null)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setEditedItem({ ...item })
    setShowEditModal(true)
    setActionMenuOpen(null)
    setActiveTab("basic")
  }

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/v1/api/delete-packeges/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete campaign")
      }

      toast.success("Package deleted successfully")
      setData(data.filter((item) => (item._id || item.id) !== id))
      setFilteredData(filteredData.filter((item) => (item._id || item.id) !== id))
      setActionMenuOpen(null)
    } catch (error) {
      toast.error("Failed to delete package")
      console.error("Error deleting package:", error)
    }
  }

  // Handle input change in edit modal
  const handleInputChange = (field, value) => {
    setEditedItem((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null,
    )
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

  // Save edited item
  const handleSaveEdit = async () => {
    if (!editedItem) return

    try {
      const campaignId = editedItem._id || editedItem.id

      const response = await fetch(`http://localhost:7000/v1/api/update-campaigns/${campaignId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedItem,
          status: editedItem.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update campaign")
      }

      const updatedCampaign = await response.json()
      const updatedData = updatedCampaign.data || updatedCampaign

      setData(
        data.map((item) => {
          if ((item._id || item.id) === campaignId) {
            return updatedData
          }
          return item
        }),
      )

      setFilteredData(
        filteredData.map((item) => {
          if ((item._id || item.id) === campaignId) {
            return updatedData
          }
          return item
        }),
      )

      setShowEditModal(false)
      setSelectedItem(null)
      setEditedItem(null)
      toast.success("Package updated successfully!")
    } catch (error) {
      console.error("Error updating package:", error)
      toast.error("Failed to update package")
    }
  }

  // Utility functions
  const stripHtmlTags = (html) => {
    if (!html) return ""
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Show loading state if packegesData is not yet loaded
  if (!packegesData) {
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
    <div className="min-h-screen bg-gray-50">
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
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {filteredData.length} packages
                    </span>
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
                      Delete Selected
                    </button>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Export Selected
                    </button>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                {filteredData.length} results
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
                        Campaign Title
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
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[100px]">Days</th>
                  )}

                  {visibleColumns.address && (
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[150px]">Address</th>
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
                            {item.days} days
                            {item.nights && <span className="ml-1">/{item.nights} nights</span>}
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
                        <p className="text-sm text-gray-500">Try adjusting your search criteria or add new packages</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Page {currentPage} of {totalPages} ({filteredData.length} total results)
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
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
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                    onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
                  onClick={() => setCurrentPage(totalPages)}
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

        {/* Enhanced Edit Modal */}
        {showEditModal && editedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[100vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Package</h3>
                  <p className="text-sm text-gray-600 mt-1">Update package information and images</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors"
                  onClick={() => setShowEditModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Edit className="h-5 w-5 mr-2 text-blue-600" />
                        Basic Information
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editedItem.headline || ""}
                            onChange={(e) => handleInputChange("headline", e.target.value)}
                            placeholder="Enter campaign title"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                            <input
                              type="number"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={editedItem.days || ""}
                              onChange={(e) => handleInputChange("days", Number.parseInt(e.target.value))}
                              placeholder="Number of days"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <input
                              type="number"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={
                                typeof editedItem.price === "number"
                                  ? editedItem.price
                                  : editedItem.price?.toString().replace(/[₹,]/g, "") || ""
                              }
                              onChange={(e) => handleInputChange("price", Number.parseInt(e.target.value))}
                              placeholder="Enter price"
                            />
                          </div>
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            value={editedItem.address || ""}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            value={editedItem.overview || ""}
                            onChange={(e) => handleInputChange("overview", e.target.value)}
                            placeholder="Enter overview"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Management */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
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
                                <button
                                  onClick={() =>
                                    setImageEditMode({ ...imageEditMode, heroImage: !imageEditMode.heroImage })
                                  }
                                  className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  Edit URL
                                </button>
                              </div>
                            </div>
                          )}

                          {(imageEditMode.heroImage || !editedItem.heroImage) && (
                            <input
                              type="url"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={editedItem.heroImage || ""}
                              onChange={(e) => handleImageEdit("heroImage", e.target.value)}
                              placeholder="Enter hero image URL"
                            />
                          )}
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
                              <input
                                type="url"
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={image}
                                onChange={(e) => handleImageEdit("multipleImages", e.target.value, index)}
                                placeholder="Image URL"
                              />
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() => handleImageEdit("multipleImages", "")}
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center bg-white"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  onClick={handleSaveEdit}
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
