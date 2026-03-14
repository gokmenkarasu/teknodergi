"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const setLink = useCallback(() => {
    const url = window.prompt("URL girin:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Gorsel URL'si girin:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Kalin",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italik",
    },
    { type: "divider" as const },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "Baslik 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      label: "Baslik 3",
    },
    { type: "divider" as const },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      label: "Liste",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      label: "Numarali Liste",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      label: "Alinti",
    },
    {
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      active: false,
      label: "Cizgi",
    },
    { type: "divider" as const },
    {
      icon: LinkIcon,
      action: setLink,
      active: editor.isActive("link"),
      label: "Link",
    },
    {
      icon: ImageIcon,
      action: addImage,
      active: false,
      label: "Gorsel",
    },
    { type: "divider" as const },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      active: false,
      label: "Geri Al",
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      active: false,
      label: "Ileri Al",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-border bg-surface-2 p-2">
      {buttons.map((btn, i) => {
        if ("type" in btn && btn.type === "divider") {
          return (
            <div key={i} className="mx-1 h-6 w-px bg-border" />
          );
        }
        const b = btn as {
          icon: React.ComponentType<{ className?: string }>;
          action: () => void;
          active: boolean;
          label: string;
        };
        return (
          <button
            key={i}
            type="button"
            onClick={b.action}
            title={b.label}
            className={cn(
              "rounded p-1.5 transition-colors",
              b.active
                ? "bg-accent/20 text-accent"
                : "text-text-secondary hover:bg-surface-1 hover:text-text-primary"
            )}
          >
            <b.icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
