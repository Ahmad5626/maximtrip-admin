"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  Upload,
  ChevronDown,
} from "lucide-react"
import { useState, useRef } from "react"

const TiptapEditor = ({ value, onChange, placeholder = "Start typing..." }) => {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 border-0",
      },
    },
  })

  if (!editor) {
    return null
  }

  const addImageFromUrl = () => {
    const url = window.prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setUploadingImage(true)

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      editor.chain().focus().setImage({ src: base64String }).run()
      setUploadingImage(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
    reader.onerror = () => {
      alert("Error reading file")
      setUploadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const setHeading = (level) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level }).run()
    }
    setShowHeadingDropdown(false)
  }

  const getActiveHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1"
    if (editor.isActive("heading", { level: 2 })) return "H2"
    if (editor.isActive("heading", { level: 3 })) return "H3"
    if (editor.isActive("heading", { level: 4 })) return "H4"
    if (editor.isActive("heading", { level: 5 })) return "H5"
    if (editor.isActive("heading", { level: 6 })) return "H6"
    return "Normal"
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 items-center">
        {/* Heading Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium min-w-[80px] justify-between"
          >
            {getActiveHeading()}
            <ChevronDown className="w-3 h-3" />
          </button>

          {showHeadingDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                type="button"
                onClick={() => setHeading(0)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setHeading(1)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-xl font-bold"
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => setHeading(2)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-lg font-bold"
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => setHeading(3)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-base font-bold"
              >
                Heading 3
              </button>
              <button
                type="button"
                onClick={() => setHeading(4)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm font-bold"
              >
                Heading 4
              </button>
              <button
                type="button"
                onClick={() => setHeading(5)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-xs font-bold"
              >
                Heading 5
              </button>
              <button
                type="button"
                onClick={() => setHeading(6)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-xs font-bold"
              >
                Heading 6
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("code") ? "bg-gray-200" : ""}`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Links and Images */}
        <button type="button" onClick={addLink} className="p-2 rounded hover:bg-gray-100" title="Add Link">
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-gray-100"
          disabled={uploadingImage}
          title="Upload Image"
        >
          {uploadingImage ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </button>

        {/* Image URL Button */}
        <button
          type="button"
          onClick={addImageFromUrl}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Image from URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-100"
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-100"
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        {/* Hidden File Input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] p-4">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* Click outside to close dropdown */}
      {showHeadingDropdown && <div className="fixed inset-0 z-0" onClick={() => setShowHeadingDropdown(false)} />}
    </div>
  )
}

export default TiptapEditor
