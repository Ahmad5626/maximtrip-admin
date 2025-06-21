"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { useAuth } from "../contexts/authContext"
import { uploadFile } from "../server/uploadImg"
import { toast, Toaster } from "sonner"
import { createPackeges } from "../server/createPackeges"

const PackageForm = ({ initialData = null, onSubmit, categories = [] }) => {
  const { categoryData, handleSubmitCreatePackeges, formData, setFormData ,uploadingHero, setUploadingHero} = useAuth()

  const [activeTab, setActiveTab] = useState("basic")
  const [heroImagePreview, setHeroImagePreview] = useState("")
  const [multipleImagePreviews, setMultipleImagePreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [uploadingMultiple, setUploadingMultiple] = useState(false)
console.log(formData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // Set image previews if editing
      if (initialData.heroImage) {
        setHeroImagePreview(initialData.heroImage)
      }
      if (initialData.multipleImages) {
        setMultipleImagePreviews(initialData.multipleImages)
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

  // Handle hero image upload with Cloudinary
  const handleHeroImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    // Validate file size (10MB limit for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB")
      return
    }

    try {
      setUploadingHero(true)

      // Create preview immediately for better UX
      const reader = new FileReader()
      reader.onload = (e) => {
        setHeroImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Upload file  using your uploadFile function
      const cloudinaryUrl = await uploadFile(file)

      if (cloudinaryUrl) {
        // Update form data with Cloudinary URL
        setFormData((prev) => ({
          ...prev,
          heroImage: cloudinaryUrl,
        }))

        // Update preview with Cloudinary URL for consistency
        setHeroImagePreview(cloudinaryUrl)

        console.log("Hero image uploaded :", cloudinaryUrl)
      } else {
        throw new Error("Failed to upload image ")
      }
    } catch (error) {
      console.error("Error uploading hero image:", error)
      alert("Failed to upload hero image . Please try again.")

      // Reset preview on error
      setHeroImagePreview("")
      setFormData((prev) => ({
        ...prev,
        heroImage: "",
      }))
    } finally {
      setUploadingHero(false)
    }
  }

  // Handle multiple images upload with Cloudinary
  const handleMultipleImagesChange = async (e) => {
    const files = Array.from(e.target.files)

    if (files.length === 0) return

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Please select images under 10MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    try {
      setUploadingMultiple(true)

      // Create previews immediately for better UX
      const newPreviews = []
      const previewPromises = validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            newPreviews.push(e.target.result)
            resolve()
          }
          reader.readAsDataURL(file)
        })
      })

      await Promise.all(previewPromises)
      setMultipleImagePreviews((prev) => [...prev, ...newPreviews])

      // Upload files  using your uploadFile function
      const uploadPromises = validFiles.map(async (file, index) => {
        try {
          const cloudinaryUrl = await uploadFile(file)
          console.log(`Image ${index + 1} uploaded :`, cloudinaryUrl)
          return cloudinaryUrl
        } catch (error) {
          console.error(`Error uploading image ${index + 1}:`, error)
          return null
        }
      })

      const cloudinaryUrls = await Promise.all(uploadPromises)

      // Filter out any failed uploads
      const successfulUploads = cloudinaryUrls.filter((url) => url !== null && url !== undefined)

      if (successfulUploads.length > 0) {
        // Update form data with Cloudinary URLs
        setFormData((prev) => ({
          ...prev,
          multipleImages: [...(prev.multipleImages || []), ...successfulUploads],
        }))

        // Update previews with Cloudinary URLs
        setMultipleImagePreviews((prev) => {
          const existingPreviews = prev.slice(0, prev.length - newPreviews.length)
          return [...existingPreviews, ...successfulUploads]
        })

        console.log("Multiple images uploaded :", successfulUploads)
      }

      if (successfulUploads.length < validFiles.length) {
        const failedCount = validFiles.length - successfulUploads.length
        alert(`${failedCount} image(s) failed to upload . Please try again.`)
      }
    } catch (error) {
      console.error("Error uploading multiple images:", error)
      alert("Failed to upload some images . Please try again.")
    } finally {
      setUploadingMultiple(false)
    }
  }

  // Remove hero image
  const removeHeroImage = () => {
    setHeroImagePreview("")
    setFormData((prev) => ({
      ...prev,
      heroImage: "",
    }))
  }

  // Remove multiple image
  const removeMultipleImage = (index) => {
    setMultipleImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      multipleImages: prev.multipleImages.filter((_, i) => i !== index),
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
      address: "",
      overview: "",
      heroImage: "",
      multipleImages: [],
      price: "",
      originalPrice: "",
      category: "",
      
     
      duration: {
        days: "",
        nights: "",
      },
      groupSize: {
        min: 1,
        max: 20,
      },
      highlights: [""],
      tags: [""],
      itinerary: [],
      inclusions: [""],
      exclusions: [""],
      termsAndConditions: [""],
      location: {
        country: "",
        state: "",
        city: "",
        coordinates: {
          latitude: "",
          longitude: "",
        },
      },
      
    })
    setHeroImagePreview("")
    setMultipleImagePreviews([])
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
        !formData.address ||
        !formData.overview ||
        !formData.price ||
        !formData.category
      ) {
        alert("Please fill in all required fields")
        return
      }

      if (!formData.heroImage) {
        alert("Please upload a hero image")
        return
      }

      // Check if any uploads are still in progress
      if (uploadingHero || uploadingMultiple) {
        alert("Please wait for image uploads to complete")
        return
      }

      // Since images are already uploaded , we can send the form data directly
      const result = await createPackeges(formData)

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
   
    { id: "itinerary", label: "Itinerary" },
    { id: "inclusions", label: "Inclusions/Exclusions" },
   
  ]

  return (
   <>
   <Toaster position="top-center" />
     <div className=" p-6 rounded-lg shadow-sm max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-2 border-b pb-3 mb-6">
        <h2 className="text-2xl font-semibold">{initialData ? "Edit Package" : "Create Package"}</h2>
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
                  ? "border-blue-500 text-blue-600"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Headline *</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter package headline"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
              <input
                type="text"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5 Days 4 Nights"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter destination address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter original price (if discounted)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categoryData?.map((category, index) => (
                  <option key={index} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

           


            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Overview *</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter package overview"
                required
              />
            </div>

            {/* Hero Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image *</label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingHero ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
                          <p className="mb-2 text-sm text-blue-600 font-semibold">Uploading ...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> hero image
                          </p>
                        </>
                      )}
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleHeroImageChange}
                      disabled={uploadingHero}
                    />
                  </label>
                </div>

                {heroImagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={heroImagePreview || "/placeholder.svg"}
                      alt="Hero preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeHeroImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={uploadingHero}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingMultiple ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
                          <p className="mb-2 text-sm text-blue-600 font-semibold">Uploading ...</p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> multiple images
                          </p>
                        </>
                      )}
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImagesChange}
                      disabled={uploadingMultiple}
                    />
                  </label>
                </div>

                {multipleImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {multipleImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Gallery preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeMultipleImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          disabled={uploadingMultiple}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-6">
          

            {/* Highlights */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Highlights</label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayChange("highlights", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter highlight"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("highlights", index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("highlights")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Add Highlight
              </button>
            </div> */}

            {/* Tags */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tag"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("tags", index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("tags")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Add Tag
              </button>
            </div> */}
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Add Day
              </button>
            </div>

            {formData.itinerary.map((day, index) => (
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter day title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={day.description}
                      onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter day description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                    <input
                      type="text"
                      value={day.accommodation}
                      onChange={(e) => handleItineraryChange(index, "accommodation", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => handleArrayChange("inclusions", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
                Add Inclusion
              </button>
            </div>

            {/* Exclusions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => handleArrayChange("exclusions", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {formData.termsAndConditions.map((term, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleArrayChange("termsAndConditions", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Add Term
              </button>
            </div>
          </div>
        )}

      

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting || uploadingHero || uploadingMultiple}
            className={`px-8 py-3 bg-[#ce3c3d] text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 ${
              isSubmitting || uploadingHero || uploadingMultiple ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Creating Package..."
              : uploadingHero || uploadingMultiple
                ? "Uploading ..."
                : initialData
                  ? "Update Package"
                  : "Create Package"}
          </button>
        </div>
      </form>
    </div>
   </>
  )
}

export default PackageForm
