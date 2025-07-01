"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import MeunBar from "./MeunBar";

const Editor = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 prose !prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none dark:prose-invert !w-full !max-w-none",
      },
    },

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<p>Hello World! 🌎️</p>",
  });
  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <MeunBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
