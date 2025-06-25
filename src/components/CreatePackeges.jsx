"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Upload, X, Loader2 } from "lucide-react"
import { useAuth } from "../contexts/authContext"
import { uploadFile } from "../server/uploadImg"
import { toast, Toaster } from "sonner"
import { createPackeges } from "../server/createPackeges"
import TiptapEditor from "./TiptapEditor"

const PackageForm = ({ initialData = null, onSubmit, categories = [] }) => {
  const { categoryData, handleSubmitCreatePackeges, formData, setFormData, uploadingHero, setUploadingHero } = useAuth()

  const [activeTab, setActiveTab] = useState("basic")
  const [featureImagePreview, setFeatureImagePreview] = useState("")
  const [extraFilePreview, setExtraFilePreview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingExtra, setUploadingExtra] = useState(false)

  // Rich text content states
  const [richTextContent, setRichTextContent] = useState({
    highlights: "",
    meals: "",
    transfer: "",
    hotel: "",
    sightseeing: "",
    shortDescription: "",
    longDescription: "",
    cancellationPolicies: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // Set rich text content
      setRichTextContent({
        highlights: initialData.highlights || "",
        meals: initialData.meals || "",
        transfer: initialData.transfer || "",
        hotel: initialData.hotel || "",
        sightseeing: initialData.sightseeing || "",
        shortDescription: initialData.shortDescription || "",
        longDescription: initialData.longDescription || "",
        cancellationPolicies: initialData.cancellationPolicies || "",
      })
      // Set image previews if editing
      if (initialData.featureImage) {
        setFeatureImagePreview(initialData.featureImage)
      }
      if (initialData.extraFile) {
        setExtraFilePreview(initialData.extraFile)
      }
    }
  }, [initialData, setFormData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const keys = name.split(".")
      setFormData((prev) => {
        const newData = { ...prev }
        let current = newData

        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }

        current[keys[keys.length - 1]] = type === "checkbox" ? checked : value
        return newData
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  // Handle rich text editor changes
  const handleRichTextChange = (field, content) => {
    setRichTextContent((prev) => ({
      ...prev,
      [field]: content,
    }))

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [field]: content,
    }))
  }

  // Handle feature image upload
  const handleFeatureImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB")
      return
    }

    try {
      setUploadingHero(true)

      // Create preview immediately for better UX
      const reader = new FileReader()
      reader.onload = (e) => {
        setFeatureImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Upload file
      const cloudinaryUrl = await uploadFile(file)

      if (cloudinaryUrl) {
        // Update form data with Cloudinary URL
        setFormData((prev) => ({
          ...prev,
          featureImage: cloudinaryUrl,
        }))

        // Update preview with Cloudinary URL for consistency
        setFeatureImagePreview(cloudinaryUrl)

        console.log("Feature image uploaded:", cloudinaryUrl)
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading feature image:", error)
      alert("Failed to upload feature image. Please try again.")

      // Reset preview on error
      setFeatureImagePreview("")
      setFormData((prev) => ({
        ...prev,
        featureImage: "",
      }))
    } finally {
      setUploadingHero(false)
    }
  }

  // Handle extra file upload
  const handleExtraFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploadingExtra(true)

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setExtraFilePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      }

      // Upload file
      const cloudinaryUrl = await uploadFile(file)

      if (cloudinaryUrl) {
        // Update form data with Cloudinary URL
        setFormData((prev) => ({
          ...prev,
          extraFile: cloudinaryUrl,
        }))

        // Update preview with Cloudinary URL for consistency
        setExtraFilePreview(cloudinaryUrl)

        console.log("Extra file uploaded:", cloudinaryUrl)
      } else {
        throw new Error("Failed to upload file")
      }
    } catch (error) {
      console.error("Error uploading extra file:", error)
      alert("Failed to upload extra file. Please try again.")

      // Reset preview on error
      setExtraFilePreview("")
      setFormData((prev) => ({
        ...prev,
        extraFile: "",
      }))
    } finally {
      setUploadingExtra(false)
    }
  }

  // Remove feature image
  const removeFeatureImage = () => {
    setFeatureImagePreview("")
    setFormData((prev) => ({
      ...prev,
      featureImage: "",
    }))
  }

  // Remove extra file
  const removeExtraFile = () => {
    setExtraFilePreview("")
    setFormData((prev) => ({
      ...prev,
      extraFile: "",
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleItineraryChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: "",
          description: "",
          activities: [],
          meals: [],
          accommodation: "",
        },
      ],
    }))
  }

  const removeItineraryDay = (index) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }))
  }

  // Reset form after successful submission
  const resetForm = () => {
    setFormData({
      headline: "",
      days: "",
      bestPrice: "",
      maxPrice: "",
      slug: "",
      rating : "0 star",
      cityRoute: "",
      featureImage: "",
      location: "",
      featured: "No",
      showInSlider: "No",
      packageCategory: "",
      subCategory: "",
      extraTitle: "",
      extraFile: "",
      metaDescription: "",
      metaKeywords: "",
      highlights_array: [""],
      tags: [""],
      itinerary: [],
      inclusions: [""],
      exclusions: [""],
      termsAndConditions: [""],
    })
    setRichTextContent({
      highlights: "",
      meals: "",
      transfer: "",
      hotel: "",
      sightseeing: "",
      shortDescription: "",
      longDescription: "",
      cancellationPolicies: "",
    })
    setFeatureImagePreview("")
    setExtraFilePreview("")
    setActiveTab("basic")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (
        !formData.headline ||
        !formData.days ||
        !formData.bestPrice ||
        !formData.cityRoute ||
        !formData.packageCategory
      ) {
        alert("Please fill in all required fields")
        return
      }

      if (!formData.featureImage) {
        alert("Please upload a feature image")
        return
      }

      // Check if any uploads are still in progress
      if (uploadingHero || uploadingExtra) {
        alert("Please wait for file uploads to complete")
        return
      }

      // Prepare form data with rich text content
      const submitData = {
        ...formData,
        ...richTextContent,
      }

      // Since images are already uploaded, we can send the form data directly
      const result = await createPackeges(submitData)

      if (result && result.success) {
        toast.success("Package created successfully!")
        resetForm()
      } else {
        toast.error("Error creating package. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Error creating package. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "content", label: "Content & Details" },
    { id: "itinerary", label: "Itinerary" },
    { id: "inclusions", label: "Inclusions/Exclusions" },
    { id: "meta", label: "Meta & Extra" },
  ]

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-2 border-b pb-3 mb-6">
          <h2 className="text-2xl font-semibold ">{initialData ? "Edit Package" : "Add Package"}</h2>
          {/* <button className="bg-[#ce3c3d] text-white px-4 py-2 rounded-lg hover:bg-green-700">Package List</button>  */}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-[#ce3c3d] text-[#ce3c3d]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Headline *</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter package headline"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days *</label>
                <input
                  type="text"
                  name="days"
                  value={formData.days || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="e.g., 5 Days 4 Nights"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Best Price *</label>
                <input
                  type="number"
                  name="bestPrice"
                  value={formData.bestPrice || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter best price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter maximum price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
               <input 
                  type="text"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter slug "
               />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating </label>
               <select 
                  name="rating"
                  value={formData.rating  || " 0 Star"}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  
               >
                  <option value="0 Star">0 Star</option>
                  <option value="1 Star">1 Star</option>
                  <option value="2 Star">2 Star</option>
                  <option value="3 Star">3 Star</option>
                  <option value="4 Star">4 Star</option>
                  <option value="5 Star">5 Star</option>
               </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">City Route *</label>
                <input
                  type="text"
                  name="cityRoute"
                  value={formData.cityRoute || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter city route (e.g., Delhi - Agra - Jaipur - Delhi)"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Feature Image *</label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingHero ? (
                          <>
                            <Loader2 className="w-8 h-8 mb-4 text-[#ce3c3d] animate-spin" />
                            <p className="mb-2 text-sm text-[#ce3c3d] font-semibold">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Choose File</span> No file chosen
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFeatureImageChange}
                        disabled={uploadingHero}
                      />
                    </label>
                  </div>

                  {featureImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={featureImagePreview || "/placeholder.svg"}
                        alt="Feature preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeFeatureImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        disabled={uploadingHero}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
                <select
                  name="featured"
                  value={formData.featured || "No"}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show in slider</label>
                <select
                  name="showInSlider"
                  value={formData.showInSlider || "No"}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Category *</label>
                <select
                  name="packageCategory"
                  value={formData.packageCategory || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  required
                >
                  <option value="">select</option>
                  {categoryData?.map((category, index) => (
                    <option key={index} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter sub category"
                />
              </div> */}
            </div>
          )}

          {/* Content & Details Tab */}
          {activeTab === "content" && (
            <div className="space-y-6">
 {/* Overview */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                <TiptapEditor
                  value={richTextContent.overview}
                  onChange={(content) => handleRichTextChange("overview", content)}
                  placeholder="Enter package overview..."
                />
              </div>
              {/* Highlights */}


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                <TiptapEditor
                  value={richTextContent.highlights}
                  onChange={(content) => handleRichTextChange("highlights", content)}
                  placeholder="Enter package highlights..."
                />
              </div>

              {/* Meals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meals</label>
                <TiptapEditor
                  value={richTextContent.meals}
                  onChange={(content) => handleRichTextChange("meals", content)}
                  placeholder="Enter meal details..."
                />
              </div>

              {/* Transfer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer</label>
                <TiptapEditor
                  value={richTextContent.transfer}
                  onChange={(content) => handleRichTextChange("transfer", content)}
                  placeholder="Enter transfer details..."
                />
              </div>

              {/* Hotel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel</label>
                <TiptapEditor
                  value={richTextContent.hotel}
                  onChange={(content) => handleRichTextChange("hotel", content)}
                  placeholder="Enter hotel details..."
                />
              </div>

              {/* Sightseeing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tour</label>
                <TiptapEditor
                  value={richTextContent.sightseeing}
                  onChange={(content) => handleRichTextChange("sightseeing", content)}
                  placeholder="Enter sightseeing details..."
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <TiptapEditor
                  value={richTextContent.shortDescription}
                  onChange={(content) => handleRichTextChange("shortDescription", content)}
                  placeholder="Enter short description..."
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
                <TiptapEditor
                  value={richTextContent.longDescription}
                  onChange={(content) => handleRichTextChange("longDescription", content)}
                  placeholder="Enter detailed description..."
                />
              </div>

              {/* Cancellation Policies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policies</label>
                <TiptapEditor
                  value={richTextContent.cancellationPolicies}
                  onChange={(content) => handleRichTextChange("cancellationPolicies", content)}
                  placeholder="Enter cancellation policies..."
                />
              </div>
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === "itinerary" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Day-wise Itinerary</h3>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ce3c3d] text-white rounded-lg hover:bg-[#ce3c3d]"
                >
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              </div>

              {formData.itinerary?.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Day {day.day}</h4>
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day Title</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                        placeholder="Enter day title"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={day.description}
                        onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                        placeholder="Enter day description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => handleItineraryChange(index, "accommodation", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                        placeholder="Enter accommodation details"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inclusions/Exclusions Tab */}
          {activeTab === "inclusions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inclusions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
                {formData.inclusions?.map((inclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => handleArrayChange("inclusions", index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                      placeholder="Enter inclusion"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("inclusions", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("inclusions")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ce3c3d] text-white rounded-lg hover:bg-[#ce3c3d]"
                >
                  <Plus className="w-4 h-4" />
                  Add Inclusion
                </button>
              </div>

              {/* Exclusions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
                {formData.exclusions?.map((exclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) => handleArrayChange("exclusions", index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                      placeholder="Enter exclusion"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("exclusions", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("exclusions")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Exclusion
                </button>
              </div>

              {/* Terms and Conditions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                {formData.termsAndConditions?.map((term, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleArrayChange("termsAndConditions", index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                      placeholder="Enter term or condition"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("termsAndConditions", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("termsAndConditions")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ce3c3d] text-white rounded-lg hover:bg-[#ce3c3d]"
                >
                  <Plus className="w-4 h-4" />
                  Add Term
                </button>
              </div>
            </div>
          )}

          {/* Meta & Extra Tab */}
          {activeTab === "meta" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  name="extraTitle"
                  value={formData.extraTitle || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter Meta title"
                />
              </div>

              <div className="md:col-span-2">
                {/* <label className="block text-sm font-medium text-gray-700 mb-2">Extra File</label> */}
                <div className="space-y-4">
                  {/* <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingExtra ? (
                          <>
                            <Loader2 className="w-8 h-8 mb-4 text-[#ce3c3d] animate-spin" />
                            <p className="mb-2 text-sm text-[#ce3c3d] font-semibold">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Choose File</span> No file chosen
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleExtraFileChange}
                        disabled={uploadingExtra}
                      />
                    </label>
                  </div> */}

                  {/* {extraFilePreview && (
                    <div className="relative inline-block">
                      <img
                        src={extraFilePreview || "/placeholder.svg"}
                        alt="Extra file preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeExtraFile}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        disabled={uploadingExtra}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )} */}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter meta description for SEO"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce3c3d]"
                  placeholder="Enter meta keywords separated by commas"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting || uploadingHero || uploadingExtra}
              className={`px-8 py-3 bg-[#ce3c3d] text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:bg-green-700 ${
                isSubmitting || uploadingHero || uploadingExtra ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting
                ? "Creating Package..."
                : uploadingHero || uploadingExtra
                  ? "Uploading..."
                  : initialData
                    ? "Update Package"
                    : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default PackageForm
