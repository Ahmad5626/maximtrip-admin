"use client"

import { useState, useRef } from "react"
import { useAuth } from "../contexts/authContext"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Toaster, toast } from "sonner"
import { Loader2, Trash, Edit, X, Save, Upload } from "lucide-react"
import TiptapEditor from "./TiptapEditor"
import { baseApi } from "../utils/constant"
import { uploadFile } from "../server/uploadImg"

const CreatePages = () => {
  const {
    createPageFormData,
    handleSubmitCreatePage,
    handleChangeCreatePage,
    pageData,
    handleDeletePage,
    uploadingHero,
  } = useAuth()

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    slug: "",
    shotDescription: "",
    description: "",
    image: "",
    status: "Active",
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    updatedBy: "",
  })
  const [editDescriptionContent, setEditDescriptionContent] = useState("")

  // Image upload states
  const [imageEditMode, setImageEditMode] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // File input ref
  const imageInputRef = useRef(null)

  // Handle content change from Tiptap editor for create form
  const handleContentChange = (content) => {
    handleChangeCreatePage({
      target: {
        name: "description",
        value: content,
      },
    })
  }

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (max 10MB)
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

  // Handle edit click
  const handleEditClick = (page) => {
    setEditingPage(page)
    setEditFormData({
      title: page.title || "",
      slug: page.slug || "",
      shotDescription: page.shotDescription || "",
      description: page.description || "",
      image: page.image || "",
      status: page.status || "Active",
      metaTitle: page.metaTitle || "",
      metaKeyword: page.metaKeyword || "",
      metaDescription: page.metaDescription || "",
      updatedBy: page.updatedBy || "",
    })
    setEditDescriptionContent(page.description || "")
    setImageEditMode(false)
    setShowEditModal(true)
  }

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle edit description change
  const handleEditDescriptionChange = (content) => {
    setEditDescriptionContent(content)
    setEditFormData((prev) => ({
      ...prev,
      description: content,
    }))
  }

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const updatedData = {
      ...editFormData,
      description: editDescriptionContent,
      updatedAt: new Date().toISOString(),
    }

    try {
      const response = await fetch(`${baseApi}/v1/api/update-page/${editingPage._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingPage._id,
          ...updatedData,
        }),
      })

      if (response.ok) {
        setShowEditModal(false)
        setEditingPage(null)
        setEditFormData({
          title: "",
          slug: "",
          shotDescription: "",
          description: "",
          image: "",
          status: "Active",
          metaTitle: "",
          metaKeyword: "",
          metaDescription: "",
          updatedBy: "",
        })
        setEditDescriptionContent("")
        setImageEditMode(false)
        toast.success("Page updated successfully!")
        console.log("Page updated successfully")
      }
    } catch (error) {
      console.error("Error updating Page:", error)
      toast.error("Failed to update Page")
    }
  }

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-")
  }

  // Handle title change and auto-generate slug
  const handleTitleChange = (e) => {
    const title = e.target.value
    handleChangeCreatePage(e)

    // Auto-generate slug
    const slug = generateSlug(title)
    handleChangeCreatePage({
      target: {
        name: "slug",
        value: slug,
      },
    })
  }

  return (
    <div>
      <section className="my-4">
        <Toaster position="top-center" />

        <div className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b pb-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold border-neutral-200">Create Page</h2>
          </div>

          <form className="space-y-4 my-4" onSubmit={handleSubmitCreatePage}>
            {/* Title and Slug Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Title *</label>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                  placeholder="Enter Page Title"
                  name="title"
                  value={createPageFormData.title}
                  onChange={handleTitleChange}
                  
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Slug *</label>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                  placeholder="Page-slug"
                  name="slug"
                  value={createPageFormData.slug}
                  onChange={handleChangeCreatePage}
                  
                />
              </div>
            </div>

            {/* Image and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Upload Image *</label>
                {uploadingHero ? (
                  <>
                    <Loader2 className="w-8 h-8 mb-4 text-[#ce3c3d] animate-spin" />
                    <p className="mb-2 text-sm text-[#ce3c3d] font-semibold">Uploading ...</p>
                  </>
                ) : (
                  <input
                    type="file"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                    placeholder="Choose image file"
                    name="image"
                    onChange={handleChangeCreatePage}
                    
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Status</label>
                <select
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                  name="status"
                  value={createPageFormData.status}
                  onChange={handleChangeCreatePage}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Short Description and Meta Title Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Short Description</label>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                  placeholder="Enter Short Description"
                  name="shotDescription"
                  value={createPageFormData.shotDescription}
                  onChange={handleChangeCreatePage}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Meta Title</label>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                  placeholder="Enter Meta Title"
                  name="metaTitle"
                  value={createPageFormData.metaTitle}
                  onChange={handleChangeCreatePage}
                />
              </div>
            </div>

            {/* Rich Text Editor for Description */}
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500">Page Content *</label>
              <TiptapEditor
                value={createPageFormData.description || ""}
                onChange={handleContentChange}
                placeholder="Write your Page content here..."
              />
            </div>

            {/* Meta Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Meta Keywords</label>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                  placeholder="Enter Meta Keywords (comma separated)"
                  name="metaKeyword"
                  value={createPageFormData.metaKeyword}
                  onChange={handleChangeCreatePage}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-500">Updated By</label>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                  placeholder="Enter Author Name"
                  name="updatedBy"
                  value={createPageFormData.updatedBy}
                  onChange={handleChangeCreatePage}
                />
              </div>
            </div>

            {/* Meta Description */}
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500">Meta Description</label>
              <textarea
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Meta Description"
                name="metaDescription"
                value={createPageFormData.metaDescription}
                onChange={handleChangeCreatePage}
                rows={3}
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-[#ce3c3d] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
              >
                Publish Page
              </button>
            </div>
          </form>
        </div>

        {/* Page History Table */}
        <div className="customContainer mt-10">
          <Card className="overflow-hidden w-full">
            <CardHeader>
              <CardTitle>Page History</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 gap-4 bg-muted p-4 font-medium">
                  <div>Title</div>
                  <div>Status</div>
                  <div>Short Description</div>
                  <div>Content Preview</div>
                  <div>Image</div>
                  <div>Actions</div>
                </div>
                {pageData.length > 0 ? (
                  pageData.map((page) => (
                    <div key={page._id} className="grid grid-cols-6 gap-4 p-4 border-t items-center">
                      <div className="text-sm font-medium truncate">{page.title}</div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            page.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : page.status === "Draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {page.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 truncate">{page.shotDescription}</div>
                      <div className="text-sm text-gray-600 max-h-20 overflow-hidden">
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: page.description?.substring(0, 100) + "...",
                          }}
                        />
                      </div>
                      <div className="flex justify-center">
                        {page.image && (
                          <img
                            src={page.image || "/placeholder.svg"}
                            alt={page.title}
                            className="w-16 h-16 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=64&width=64"
                            }}
                          />
                        )}
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 transition-colors"
                          onClick={() => handleEditClick(page)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-200 transition-colors"
                          onClick={() => handleDeletePage(page._id)}
                        >
                          <Trash className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <div className="text-gray-400 mb-2">📝</div>
                    <div>No pages found</div>
                    <div className="text-sm">Create your first page post above</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-semibold">Edit page</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                {/* Title and Slug Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Title</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Title"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Slug</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Slug"
                      name="slug"
                      value={editFormData.slug}
                      onChange={handleEditFormChange}
                    />
                  </div>
                </div>

                {/* Status and Meta Title Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Status</label>
                    <select
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
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
                </div>

                {/* Short Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500">Short Description</label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                    placeholder="Enter Short Description"
                    name="shotDescription"
                    value={editFormData.shotDescription}
                    onChange={handleEditFormChange}
                  />
                </div>

                {/* Enhanced Image Upload Section - Same as CreateDestinations */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">page Image</label>
                  <div className="space-y-3">
                    {editFormData.image && (
                      <div className="relative group">
                        <img
                          src={editFormData.image || "/placeholder.svg?height=200&width=300"}
                          alt="page"
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
                            ? "Change page Image"
                            : "Upload page Image"}
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
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editFormData.image || ""}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, image: e.target.value }))}
                          placeholder="Enter page image URL"
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

                {/* Description Editor */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500">page Content</label>
                  <TiptapEditor
                    value={editDescriptionContent}
                    onChange={handleEditDescriptionChange}
                    placeholder="Enter page content..."
                  />
                </div>

                {/* Meta Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Meta Keywords</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Meta Keywords"
                      name="metaKeyword"
                      value={editFormData.metaKeyword}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500">Updated By</label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                      placeholder="Enter Author Name"
                      name="updatedBy"
                      value={editFormData.updatedBy}
                      onChange={handleEditFormChange}
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500">Meta Description</label>
                  <textarea
                    className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                    placeholder="Enter Meta Description"
                    name="metaDescription"
                    value={editFormData.metaDescription}
                    onChange={handleEditFormChange}
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center px-8 py-3 bg-[#ce3c3d] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
                    disabled={uploadingImage}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {uploadingImage ? "Uploading..." : "Update page"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
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

export default CreatePages
