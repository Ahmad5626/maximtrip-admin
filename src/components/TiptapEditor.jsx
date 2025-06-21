"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { useState, useCallback, useEffect } from "react"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Type,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react"

const TiptapEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const selection = editor.state.selection
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to)

    setLinkText(selectedText || "")
    setLinkUrl(previousUrl || "")
    setShowLinkModal(true)
  }, [editor])

  const handleSetLink = () => {
    if (!editor) return

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      setShowLinkModal(false)
      return
    }

    // If there's selected text, use it; otherwise use the link text from modal
    const selection = editor.state.selection
    const hasSelection = !selection.empty

    if (hasSelection) {
      // Update existing selection with link
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    } else {
      // Insert new text with link
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
    }

    setShowLinkModal(false)
    setLinkUrl("")
    setLinkText("")
  }

  const unsetLink = useCallback(() => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
  }, [editor])

  const getCurrentHeadingLevel = () => {
    if (!editor) return null
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive("heading", { level })) {
        return level
      }
    }
    return null
  }

  const getCurrentHeadingText = () => {
    const level = getCurrentHeadingLevel()
    if (level) return `H${level}`
    if (editor?.isActive("paragraph")) return "P"
    return "¶"
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="animate-pulse">Loading editor...</div>
      </div>
    )
  }

  const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )

  const headingOptions = [
    { level: null, label: "Paragraph", icon: <Type className="w-4 h-4" /> },
    { level: 1, label: "Heading 1", icon: <Heading1 className="w-4 h-4" /> },
    { level: 2, label: "Heading 2", icon: <Heading2 className="w-4 h-4" /> },
    { level: 3, label: "Heading 3", icon: <Heading3 className="w-4 h-4" /> },
    { level: 4, label: "Heading 4", icon: <Heading4 className="w-4 h-4" /> },
    { level: 5, label: "Heading 5", icon: <Heading5 className="w-4 h-4" /> },
    { level: 6, label: "Heading 6", icon: <Heading6 className="w-4 h-4" /> },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive("highlight")}
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings Dropdown */}
          <div className="relative border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
              className={`flex items-center gap-1 p-2 rounded transition-colors ${
                getCurrentHeadingLevel() ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
              }`}
              title="Text Format"
            >
              <span className="text-sm font-medium min-w-[20px]">{getCurrentHeadingText()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showHeadingDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                {headingOptions.map((option) => (
                  <button
                    key={option.level || "paragraph"}
                    type="button"
                    onClick={() => {
                      if (option.level) {
                        editor.chain().focus().toggleHeading({ level: option.level }).run()
                      } else {
                        editor.chain().focus().setParagraph().run()
                      }
                      setShowHeadingDropdown(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 ${
                      option.level
                        ? editor.isActive("heading", { level: option.level })
                          ? "bg-blue-50 text-blue-700"
                          : ""
                        : editor.isActive("paragraph")
                          ? "bg-blue-50 text-blue-700"
                          : ""
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lists and Quotes */}
          <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Links */}
          <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} title="Add Link">
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={unsetLink} disabled={!editor.isActive("link")} title="Remove Link">
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Text Alignment */}
          <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              isActive={editor.isActive({ textAlign: "justify" })}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Preview Toggle */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => setShowPreview(!showPreview)}
              isActive={showPreview}
              title={showPreview ? "Edit Mode" : "Preview Mode"}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] max-h-[500px] overflow-y-auto">
        {showPreview ? (
          <div className="p-4 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
          </div>
        ) : (
          <EditorContent editor={editor} className="min-h-[200px]" />
        )}
      </div>

      {/* Character Count */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>{editor.storage.characterCount?.characters() || 0} characters</span>
        <span>{editor.storage.characterCount?.words() || 0} words</span>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false)
                  setLinkText("")
                  setLinkUrl("")
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSetLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showHeadingDropdown && <div className="fixed inset-0 z-5" onClick={() => setShowHeadingDropdown(false)} />}
    </div>
  )
}

export default TiptapEditor
