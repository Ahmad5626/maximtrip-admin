"use client"

import { useAuth } from "../contexts/authContext"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Toaster } from "sonner"
import { Loader2, Trash } from "lucide-react"
import TiptapEditor from "./TiptapEditor"

const CreatePage = () => {
  const { createPageFormData, handleSubmitCreatePage, handleChangeCreatePage, pageData, handleDeletePage ,uploadingHero} = useAuth()

  // Handle content change from Tiptap editor
  const handleContentChange = (content) => {
    handleChangeCreatePage({
      target: {
        name: "description",
        value: content,
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

          <form className="space-y-3 my-4 flex flex-wrap justify-between items-start" onSubmit={handleSubmitCreatePage}>
            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500">Title</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Blog Title"
                name="title"
                value={createPageFormData.title}
                onChange={handleChangeCreatePage}
              />
            </div>


            

            <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-0">
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
             <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-2 ">
              <label className="font-semibold text-xs text-gray-500">Slug</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Enter Slug"
                name="slug"
                value={createPageFormData.slug}
                onChange={handleChangeCreatePage}
              />
            </div>

            {/* Tiptap Rich Text Editor */}
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500">Page Content</label>
              <TiptapEditor
                content={createPageFormData.description || ""}
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
              />
            </div>

            <div className="w-full md:w-[48%] flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500">Upload Image</label>
              {uploadingHero ? (
                <>
                 <Loader2 className="w-8 h-8 mb-4 text-[#ce3c3d] animate-spin" />
                  <p className="mb-2 text-sm text-[#ce3c3d] font-semibold">Uploading ...</p></>
              ) : (
                <input
                type="file"
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100"
                placeholder="Choose image file"
                name="image"
                onChange={handleChangeCreatePage}
              />
              )
              }
            </div>

            <div className="mt-4 w-full">
              <button
                type="submit"
                className="px-8 py-3 bg-[#ce3c3d] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-yellow-500"
              >
                Publish Page
              </button>
            </div>
          </form>
        </div>

        {/* Blog History Table */}
        <div className="customContainer mt-10">
          <Card className="overflow-hidden w-full">
            <CardHeader>
              <CardTitle>Page History</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 gap-4 bg-muted p-4 font-medium">
                  <div>Title</div>
                  <div>Short Description</div>
                  <div>Content Preview</div>
                  <div>Slug</div>
                  <div>Image</div>
                  <div>Actions</div>
                </div>
                {pageData.length > 0 ? (
                  pageData.map((blog) => (
                    <div key={blog._id} className="grid grid-cols-6 gap-4 p-4 border-t items-center">
                      <div className="text-sm font-medium truncate">{blog.title}</div>
                      <div className="text-sm text-gray-600 truncate">{blog.shotDescription}</div>
                      <div className="text-sm text-gray-600 max-h-20 overflow-hidden">
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: blog.description?.substring(0, 100) + "...",
                          }}
                        />
                      </div>
                       <div className="text-sm font-medium truncate">{blog.slug}</div>

                      <div className="flex justify-center">
                        {blog.image && (
                          <img
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            className="w-16 h-16 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=64&width=64"
                            }}
                          />
                        )}
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-200 transition-colors"
                          onClick={() => handleDeletePage(blog._id)}
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
      </section>
    </div>
  )
}

export default CreatePage
