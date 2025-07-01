"use client"

import { useAuth } from "../contexts/authContext"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useState, useRef } from "react"
import { Toaster, toast } from "sonner"
import { Loader2, Trash, Edit, X, Upload } from "lucide-react"
import TiptapEditor from "./TiptapEditor"
import { uploadFile } from "../server/uploadImg"
import { baseApi } from "../utils/constant"

const CreatePackeges = () => {
  const {
    createCategoryFormData,
    handleChangeCraeteCategory,
    handleSubmitCreateCategory,
    categoryData,
    handleDeletecategory,
    uploadingHero,
  } = useAuth()

  // New state for edit modal and rich text editors
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editFormData, setEditFormData] = useState({
    categoryName: "",
    image: "",
    Slug: "",
    headline: "",
    detail: "",
    subcategoryFAQ: "",
    metaTitle: "",
    metaDiscription: "",
    metaKeywords: "",
  })
  const [editDetailContent, setEditDetailContent] = useState("")
  const [editSubcategoryFAQContent, setEditSubcategoryFAQContent] = useState("")

  // New states for image editing
  const [imageEditMode, setImageEditMode] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // File input ref
  const imageInputRef = useRef(null)

  // Custom onChange handlers for TiptapEditor in create form
  const handleDetailChange = (content) => {
    handleChangeCraeteCategory({
      target: { name: "detail", value: content },
    })
  }

  const handleSubcategoryFAQChange = (content) => {
    handleChangeCraeteCategory({
      target: { name: "subcategoryFAQ", value: content },
    })
  }

  // New handlers for edit functionality
  const handleEditClick = (category) => {
    setEditingCategory(category)
    setEditFormData({
      categoryName: category.categoryName || "",
      image: category.image || "",
      Slug: category.Slug || "",
      headline: category.headline || "",
      detail: category.detail || "",
      subcategoryFAQ: category.subcategoryFAQ || "",
      metaTitle: category.metaTitle || "",
      metaDiscription: category.metaDiscription || "",
      metaKeywords: category.metaKeywords || "",
    })
    setEditDetailContent(category.detail || "")
    setEditSubcategoryFAQContent(category.subcategoryFAQ || "")
    setIsEditModalOpen(true)
    setImageEditMode(false) // Reset image edit mode
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle image upload for edit modal
  const handleImageUpload = async (file) => {
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

    setUploadingImage(true)

    try {
      // Upload to Cloudinary using your uploadFile function
      const cloudinaryUrl = await uploadFile(file)

      if (cloudinaryUrl) {
        setEditFormData((prev) => ({
          ...prev,
          image: cloudinaryUrl,
        }))
        toast.success("Image uploaded successfully to Cloudinary")
      } else {
        throw new Error("Failed to upload to Cloudinary")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image to Cloudinary")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const updatedData = {
      ...editFormData,
      detail: editDetailContent,
      subcategoryFAQ: editSubcategoryFAQContent,
    }

    try {
      const response = await fetch(`${baseApi}/v1/api/update-category/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingCategory._id,
          ...updatedData,
        }),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        toast.success("Category updated successfully!")
        // Refresh the category data or show success message
        console.log("Category updated successfully")
      } else {
        throw new Error("Failed to update category")
      }
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    }
  }

  // Delete confirmation handler
  const handleDeleteWithConfirmation = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this category? This action cannot be undone.")

    if (isConfirmed) {
      handleDeletecategory(id)
    }
  }

  return (
    <div>
      <section className="my-4">
        <Toaster position="top-center" />

        <div className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b pb-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold border-neutral-200">Create Category</h2>
          </div>

          <form
            className="space-y-3 my-4 flex flex-wrap justify-between items-center"
            onSubmit={handleSubmitCreateCategory}
          >
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500 ">Headline </label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Headline"
                name="headline"
                value={createCategoryFormData.headline}
                onChange={handleChangeCraeteCategory}
              />
            </div>
            <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-0">
              <label className="font-semibold text-xs text-gray-500 ">Category Name</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Category Name"
                name="categoryName"
                value={createCategoryFormData.categoryName}
                onChange={handleChangeCraeteCategory}
              />
            </div>
            <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-0">
              <label className="font-semibold text-xs text-gray-500 ">Slug</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Slug"
                name="Slug"
                value={createCategoryFormData.Slug}
                onChange={handleChangeCraeteCategory}
              />
            </div>
            <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-0">
              <label className="font-semibold text-xs text-gray-500 ">Meta Title</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Meta Title"
                name="metaTitle"
                value={createCategoryFormData.metaTitle}
                onChange={handleChangeCraeteCategory}
              />
            </div>
            <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-0">
              <label className="font-semibold text-xs text-gray-500 ">Meta Description</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Meta Description"
                name="metaDiscription"
                value={createCategoryFormData.metaDiscription}
                onChange={handleChangeCraeteCategory}
              />
            </div>
            <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-0">
              <label className="font-semibold text-xs text-gray-500 ">Meta Keywords</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Meta Keywords"
                name="metaKeywords"
                value={createCategoryFormData.metaKeywords}
                onChange={handleChangeCraeteCategory}
              />
            </div>

            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500 ">Upload Image</label>
              {uploadingHero ? (
                <>
                  <Loader2 className="w-8 h-8 mb-4 text-[#ce3c3d] animate-spin" />
                  <p className="mb-2 text-sm text-[#ce3c3d] font-semibold">Uploading ...</p>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                    placeholder="Enter the URL"
                    name="image"
                    onChange={handleChangeCraeteCategory}
                  />
                </>
              )}
            </div>

            {/* Rich Text Editor Fields */}
            <div className="w-full flex flex-col gap-2 !mt-4">
              <label className="font-semibold text-xs text-gray-500">Detail</label>
              <TiptapEditor
                value={createCategoryFormData.detail || ""}
                onChange={handleDetailChange}
                placeholder="Enter detailed description..."
                className="max-h-[300px] overflow-y-auto"
              />
            </div>

            <div className="w-full flex flex-col gap-2 !mt-4">
              <label className="font-semibold text-xs text-gray-500">Subcategory FAQ</label>
              <TiptapEditor
                value={createCategoryFormData.subcategoryFAQ || ""}
                onChange={handleSubcategoryFAQChange}
                placeholder="Enter FAQ content..."
                className="max-h-[300px] overflow-y-auto"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-[#ce3c3d] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-yellow-500  text-white p-2 px-5 rounded-lg font-semibold text-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>

        <div className="customContainer mt-10">
          <Card className=" overflow-hidden w-full">
            <CardHeader>
              <CardTitle>Category History</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-scroll w-[500px] md:w-full">
              <div className="rounded-md border ">
                <div className="flex justify-around bg-muted p-4 font-medium ">
                  <div>Headline</div>
                  <div>Category name</div>
                  <div>Slug</div>
                  <div>Image</div>
                  <div>Actions</div>
                </div>
                {categoryData.length > 0 ? (
                  categoryData.map((institues) => (
                    <div key={institues._id} className="flex justify-between gap-10 p-4 border-t items-center">
                      <div className="w-[20%] text-center overflow-auto">{institues.headline}</div>
                      <div className="w-[20%]   text-center overflow-auto">{institues.categoryName}</div>
                      <div className="w-[20%] text-center overflow-auto">{institues.Slug}</div>
                      <div className="w-[20%] text-center  flex justify-center">
                        <img src={institues.image || "/placeholder.svg"} className="w-10 h-10 md:ml-20" />
                      </div>
                      <div className="w-[20%] text-center overflow-auto flex justify-center gap-2">
                        <button
                          className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 hover:bg-blue-200"
                          onClick={() => handleEditClick(institues)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 hover:bg-red-200"
                          onClick={() => handleDeleteWithConfirmation(institues._id)}
                        >
                          <Trash className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No categoryData found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Edit Modal with Image Upload */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-semibold">Edit Category</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Headline</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Headline"
                      name="headline"
                      value={editFormData.headline}
                      onChange={handleEditFormChange}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Category Name</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Category Name"
                      name="categoryName"
                      value={editFormData.categoryName}
                      onChange={handleEditFormChange}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Slug</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Slug"
                      name="Slug"
                      value={editFormData.Slug}
                      onChange={handleEditFormChange}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Meta Title</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Meta Title"
                      name="metaTitle"
                      value={editFormData.metaTitle}
                      onChange={handleEditFormChange}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Meta Description</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Meta Description"
                      name="metaDiscription"
                      value={editFormData.metaDiscription}
                      onChange={handleEditFormChange}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Meta Keywords</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Meta Keywords"
                      name="metaKeywords"
                      value={editFormData.metaKeywords}
                      onChange={handleEditFormChange}
                    />
                  </div>
                </div>

                {/* Enhanced Image Upload Section */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500">Category Image</label>
                  <div className="space-y-3">
                    {editFormData.image && (
                      <div className="relative group">
                        <img
                          src={editFormData.image || "/placeholder.svg?height=200&width=300"}
                          alt="Category"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm shadow-lg hover:bg-gray-50"
                              disabled={uploadingImage}
                            >
                              {uploadingImage ? "Uploading..." : "Change"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center bg-white"
                        disabled={uploadingImage}
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        {uploadingImage
                          ? "Uploading to Cloudinary..."
                          : editFormData.image
                            ? "Change Category Image"
                            : "Upload Category Image"}
                      </button>

                      {!imageEditMode && (
                        <button
                          type="button"
                          onClick={() => setImageEditMode(true)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          URL
                        </button>
                      )}
                    </div>

                    {imageEditMode && (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none border-gray-200 bg-gray-100"
                          value={editFormData.image}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, image: e.target.value }))}
                          placeholder="Enter image URL"
                        />
                        <button
                          type="button"
                          onClick={() => setImageEditMode(false)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file)
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-semibold text-xs text-gray-500">Detail</label>
                  <TiptapEditor
                    value={editDetailContent}
                    onChange={setEditDetailContent}
                    placeholder="Enter detailed description..."
                    className="max-h-[300px] overflow-y-auto"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500">Subcategory FAQ</label>
                  <TiptapEditor
                    value={editSubcategoryFAQContent}
                    onChange={setEditSubcategoryFAQContent}
                    placeholder="Enter FAQ content..."
                    className="max-h-[300px] overflow-y-auto"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#ce3c3d] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Uploading..." : "Update Category"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-8 py-3 bg-gray-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default CreatePackeges
