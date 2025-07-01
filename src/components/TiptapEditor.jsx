"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import CharacterCount from "@tiptap/extension-character-count"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import FontSize from "@tiptap/extension-font-size"
import FontFamily from "@tiptap/extension-font-family"
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Palette,
  Highlighter,
  TableIcon,
  Type,
  Plus,
  
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

const TiptapEditor = ({ value, onChange, placeholder = "Start typing...",className = "" }) => {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false)
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showBgColorPicker, setShowBgColorPicker] = useState(false)
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false)
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] = useState(false)
  const [showSpecialChars, setShowSpecialChars] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    strike: false,
    code: false,
    textAlign: 'left',
    bulletList: false,
    orderedList: false,
    blockquote: false,
    textStyle: false,
    highlight: false,
    heading: null,
    link: false,
    fontSize: null,
    fontFamily: null,
  })
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      HorizontalRule,
      CharacterCount,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontSize.configure({
        types: ['textStyle'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      updateActiveFormats(editor)
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 border-0",
      },
    },
  })

  const updateActiveFormats = (editor) => {
    if (!editor) return
    
    const currentFontSize = editor.getAttributes('textStyle').fontSize || null
    const currentFontFamily = editor.getAttributes('textStyle').fontFamily || null
    
    setActiveFormats({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      strike: editor.isActive('strike'),
      code: editor.isActive('code'),
      textAlign: 
        editor.isActive({ textAlign: 'left' }) ? 'left' :
        editor.isActive({ textAlign: 'center' }) ? 'center' :
        editor.isActive({ textAlign: 'right' }) ? 'right' :
        editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left',
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
      blockquote: editor.isActive('blockquote'),
      textStyle: editor.isActive('textStyle'),
      highlight: editor.isActive('highlight'),
      heading: 
        editor.isActive('heading', { level: 1 }) ? 1 :
        editor.isActive('heading', { level: 2 }) ? 2 :
        editor.isActive('heading', { level: 3 }) ? 3 :
        editor.isActive('heading', { level: 4 }) ? 4 :
        editor.isActive('heading', { level: 5 }) ? 5 :
        editor.isActive('heading', { level: 6 }) ? 6 : null,
      link: editor.isActive('link'),
      fontSize: currentFontSize,
      fontFamily: currentFontFamily,
    })
  }

  useEffect(() => {
    if (editor) {
      editor.on('selectionUpdate', ({ editor }) => {
        updateActiveFormats(editor)
      })
      editor.on('transaction', ({ editor }) => {
        updateActiveFormats(editor)
      })
      
      updateActiveFormats(editor)
    }

    return () => {
      if (editor) {
        editor.off('selectionUpdate')
        editor.off('transaction')
      }
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const setFontSize = (size) => {
    if (size === 'default') {
      editor.chain().focus().unsetFontSize().run()
    } else {
      editor.chain().focus().setFontSize(size).run()
    }
    setShowFontSizeDropdown(false)
  }

  const setFontFamily = (font) => {
    if (font === 'default') {
      editor.chain().focus().unsetFontFamily().run()
    } else {
      editor.chain().focus().setFontFamily(font).run()
    }
    setShowFontFamilyDropdown(false)
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
    if (activeFormats.heading === 1) return "H1"
    if (activeFormats.heading === 2) return "H2"
    if (activeFormats.heading === 3) return "H3"
    if (activeFormats.heading === 4) return "H4"
    if (activeFormats.heading === 5) return "H5"
    if (activeFormats.heading === 6) return "H6"
    return "Normal"
  }

  const addHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run()
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const addSpecialCharacter = (char) => {
    editor.chain().focus().insertContent(char).run()
    setShowSpecialChars(false)
  }

  const specialCharacters = [
    "©", "®", "™", "€", "£", "¥", "¢", "§", "¶", "•", "–", "—", "±", "×", "÷", "≠", "≈", "≤", "≥", "∞", "°", "µ", "π", "Ω", "∑", "√", "∆", "∏", "∫", "≈", "‰", "…", "←", "→", "↑", "↓", "↔", "↵", "⇐", "⇒", "⇑", "⇓", "⇔", "♠", "♣", "♥", "♦", "✓", "✔", "☆", "★", "☀", "☁", "☂", "☃", "☎", "☑", "☝", "☺", "♀", "♂", "♫", "⚓", "⚠", "⚡", "⛄", "⛔", "✂", "✈", "✉", "✌", "✍", "✏", "✒", "✔", "✖", "✝", "✡", "✨", "✳", "✴", "❄", "❌", "❎", "❤", "➡", "⏱", "⏲", "⏰", "⌛", "⏳"
  ]

  const fontFamilies = [
    { name: 'Default', value: 'default' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Monospace', value: 'monospace' },
  ]

  return (
    <div className="border rounded-lg">
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
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${activeFormats.heading === null ? 'bg-gray-100' : ''}`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setHeading(1)}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-xl font-bold ${activeFormats.heading === 1 ? 'bg-gray-100' : ''}`}
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => setHeading(2)}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-lg font-bold ${activeFormats.heading === 2 ? 'bg-gray-100' : ''}`}
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => setHeading(3)}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-base font-bold ${activeFormats.heading === 3 ? 'bg-gray-100' : ''}`}
              >
                Heading 3
              </button>
              <button
                type="button"
                onClick={() => setHeading(4)}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm font-bold ${activeFormats.heading === 4 ? 'bg-gray-100' : ''}`}
              >
                Heading 4
              </button>
              <button
                type="button"
                onClick={() => setHeading(5)}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-xs font-bold ${activeFormats.heading === 5 ? 'bg-gray-100' : ''}`}
              >
                Heading 5
              </button>
              <button
                type="button"
                onClick={() => setHeading(6)}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-xs font-bold ${activeFormats.heading === 6 ? 'bg-gray-100' : ''}`}
              >
                Heading 6
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Font Family Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFontFamilyDropdown(!showFontFamilyDropdown)}
            className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium"
            title="Font Family"
          >
            <div className="w-4 h-4" />
            <span className="text-xs">
              {activeFormats.fontFamily ? 
                fontFamilies.find(f => f.value === activeFormats.fontFamily)?.name || 'Font' : 
                'Font'
              }
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showFontFamilyDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[150px] max-h-64 overflow-y-auto">
              {fontFamilies.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => setFontFamily(font.value)}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${activeFormats.fontFamily === font.value ? 'bg-gray-100' : ''}`}
                  style={{ fontFamily: font.value === 'default' ? 'inherit' : font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
            className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium"
            title="Font Size"
          >
            <Type className="w-4 h-4" />
            <span className="text-xs">
              {activeFormats.fontSize ? activeFormats.fontSize.replace('px', '') : 'Size'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showFontSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                type="button"
                onClick={() => setFontSize('default')}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${!activeFormats.fontSize ? 'bg-gray-100' : ''}`}
              >
                Default
              </button>
              {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(`${size}px`)}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${activeFormats.fontSize === `${size}px` ? 'bg-gray-100' : ''}`}
                  style={{ fontSize: `${size}px` }}
                >
                  {size}px
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.bold ? "bg-gray-200" : ""}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.italic ? "bg-gray-200" : ""}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.strike ? "bg-gray-200" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.code ? "bg-gray-200" : ""}`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Text Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            className={`p-2 rounded hover:bg-gray-100 ${activeFormats.textStyle ? "bg-gray-200" : ""}`}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </button>

          {showTextColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 p-2 grid grid-cols-5 gap-1 w-48">
              {[
                "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
                "#FFFF00", "#00FFFF", "#FF00FF", "#C0C0C0", "#808080",
                "#800000", "#808000", "#008000", "#800080", "#008080",
                "#000080", "#FFA500", "#A52A2A", "#8B4513", "#FFD700"
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(color).run()
                    setShowTextColorPicker(false)
                  }}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Background Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            className={`p-2 rounded hover:bg-gray-100 ${activeFormats.highlight ? "bg-gray-200" : ""}`}
            title="Background Color"
          >
            <Highlighter className="w-4 h-4" />
          </button>

          {showBgColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 p-2 grid grid-cols-5 gap-1 w-48">
              {[
                "#FFC0C0", "#FFFFC0", "#C0FFC0", "#C0FFFF", "#C0C0FF",
                "#FFC0FF", "#FFE0C0", "#E0FFC0", "#C0FFE0", "#C0E0FF",
                "#E0C0FF", "#FFE0E0", "#E0FFE0", "#E0E0FF", "#FFE0FF",
                "#FFF0C0", "#F0FFC0", "#C0FFF0", "#C0F0FF", "#F0C0FF",
                "#FFD700", "#FFA500", "#FF6347", "#FF4500", "#FF8C00"
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run()
                    setShowBgColorPicker(false)
                  }}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.textAlign === 'left' ? "bg-gray-200" : ""}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.textAlign === 'center' ? "bg-gray-200" : ""}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.textAlign === 'right' ? "bg-gray-200" : ""}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.textAlign === 'justify' ? "bg-gray-200" : ""}`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.bulletList ? "bg-gray-200" : ""}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.orderedList ? "bg-gray-200" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.blockquote ? "bg-gray-200" : ""}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={addHorizontalRule}
          className="p-2 rounded hover:bg-gray-100"
          title="Horizontal Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Special Characters */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSpecialChars(!showSpecialChars)}
            className="p-2 rounded hover:bg-gray-100"
            title="Special Characters"
          >
            <Plus className="w-4 h-4" />
          </button>

          {showSpecialChars && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 p-2 grid grid-cols-8 gap-1 w-64 max-h-64 overflow-y-auto">
              {specialCharacters.map((char, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addSpecialCharacter(char)}
                  className="p-1 hover:bg-gray-100 rounded text-center"
                >
                  {char}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Table */}
        <button
          type="button"
          onClick={insertTable}
          className="p-2 rounded hover:bg-gray-100"
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        {/* Links and Images */}
        <button 
          type="button" 
          onClick={addLink} 
          className={`p-2 rounded hover:bg-gray-100 ${activeFormats.link ? "bg-gray-200" : ""}`} 
          title="Add Link"
        >
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
      <div className={`min-h-[300px] p-4 ${className}`}>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* Click outside to close dropdowns */}
      {(showHeadingDropdown || showTextColorPicker || showBgColorPicker || 
       showFontSizeDropdown || showFontFamilyDropdown || showSpecialChars) && (
        <div className="fixed inset-0 z-0" onClick={() => {
          setShowHeadingDropdown(false)
          setShowTextColorPicker(false)
          setShowBgColorPicker(false)
          setShowFontSizeDropdown(false)
          setShowFontFamilyDropdown(false)
          setShowSpecialChars(false)
        }} />
      )}
    </div>
  )
}

export default TiptapEditor

// npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-highlight @tiptap/extension-horizontal-rule @tiptap/extension-character-count @tiptap/extension-table @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-table-row lucide-react