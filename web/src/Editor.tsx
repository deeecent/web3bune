import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import {
  ImageIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Quote,
} from "lucide-react";
import "./Editor.css";

export function FloatingMenu({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [isH1, setIsH1] = useState(false);
  const [isH2, setIsH2] = useState(false);
  const [isQuoted, setIsQuoted] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);

  function updateState(editor: Editor) {
    setIsBold(editor.isActive("bold"));
    setIsItalic(editor.isActive("italic"));
    setIsQuoted(editor.isActive("blockquote"));
    setIsBulletList(editor.isActive("bulletList"));
    setIsOrderedList(editor.isActive("orderedList"));
    setIsLinked(editor.isActive("link"));
    setIsH1(editor.isActive("heading", { level: 1 }));
    setIsH2(editor.isActive("heading", { level: 2 }));
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      console.log(e);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.on("selectionUpdate", ({ editor }) => {
      updateState(editor);
    });
    editor.on("update", ({ editor }) => {
      updateState(editor);
    });
  }, [editor]);

  return (
    <VStack width="70px">
      <Button
        width="100%"
        fontWeight="bold"
        isActive={isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Text fontWeight="bold">B</Text>
      </Button>
      <Button
        width="100%"
        isActive={isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Text fontStyle="italic">I</Text>
      </Button>
      <Button
        width="100%"
        isActive={isLinked}
        onClick={() =>
          isLinked ? editor.chain().focus().unsetLink().run() : setLink()
        }
      >
        <LinkIcon />
      </Button>
      <Button
        width="100%"
        isActive={isH1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Text fontWeight="bold">H1</Text>
      </Button>
      <Button
        width="100%"
        isActive={isH2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Text fontWeight="bold" fontSize="0.9em">
          H2
        </Text>
      </Button>
      <Button
        width="100%"
        isActive={isQuoted}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size="1em" fill="black" />
      </Button>
      <Button
        width="100%"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={isBulletList}
      >
        <ListIcon />
      </Button>
      <Button
        width="100%"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={isOrderedList}
      >
        <ListOrderedIcon />
      </Button>
      <Button
        width="100%"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        —
      </Button>

      <Button
        padding="0"
        width="100%"
        onClick={() => {
          const url = prompt("Enter image URL");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        <ImageIcon />
      </Button>
    </VStack>
  );
}

export default FloatingMenu;

interface TiptapEditorProps {
  onUpdate: (html: string) => void;
  onFocus: (editor: any) => void;
  content: string;
}

export function TiptapEditor({
  onUpdate,
  onFocus,
  content,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure an included extension
        heading: {
          levels: [1, 2],
        },
      }),
      Image.configure({ inline: true }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            url.includes(":") ? new URL(url) : new URL(`https://${url}`);

            return true;
          } catch {
            return false;
          }
        },
      }),
    ],
    content: content,

    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  useEffect(() => {
    if (content && editor.getText() === "") {
      editor.chain().setContent(content).run();
    }
  }, [content]);

  return (
    <Box
      onFocus={() => onFocus(editor)} // Notify parent when focused
      tabIndex={-1} // Make the div focusable
      style={styles.editorContainer}
    >
      <EditorContent
        content={content}
        editor={editor}
        style={styles.editorContent}
      />
    </Box>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  editorContainer: {
    minHeight: "150px" /* Initial height */,
  },
  editorContent: {
    overflowY: "visible" /* Allow height expansion */,
    border: "1px solid #bbb",
    backgroundColor: "white",
    position: "relative",
  },
};
