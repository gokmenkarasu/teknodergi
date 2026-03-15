"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { EditorToolbar } from "./EditorToolbar";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose-article min-h-[300px] rounded-b-lg border border-t-0 border-border bg-surface-0 p-4 text-text-primary focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
