import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TurndownService from "turndown";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ElegantBox } from "./CustomComponents";
import Showdown from "showdown";

const STORAGE_KEY = "TMP_ARTICLE";

// Custom Toolbar
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }], // Headings (H1, H2, H3)
    ["bold", "italic", { color: [] }], // Bold, Italic, Text Color
    [{ align: [] }], // Text Alignment
    ["blockquote", "code-block"], // Quoting and Code Snippets
    ["link", "image"], // Insert Media
    ["clean"], // Remove formatting
  ],
};

function Write() {
  const [content, setContent] = useState("");

  const turndownService = new TurndownService();
  const markdownConverter = new Showdown.Converter();

  const handleContentChange = (value: string) => {
    setContent(value);
    const markdown = turndownService.turndown(value); // Convert HTML to Markdown
    localStorage.setItem(STORAGE_KEY, markdown);
  };

  useEffect(() => {
    const savedMarkdown = localStorage.getItem(STORAGE_KEY);
    if (savedMarkdown) {
      const html = markdownConverter.makeHtml(savedMarkdown);
      setContent(html);
    }
  }, []);

  return (
    <Flex
      direction="column"
      overflow="hidden"
      width="100%"
      height="100vh"
      alignItems="stretch"
      padding="20px"
    >
      <VStack
        height="100px"
        width="100%"
        marginBottom="20px"
        borderBottom="2px solid black"
      >
        <Heading size="2xl">New Article</Heading>
        <Text>Write good content</Text>
      </VStack>
      <ElegantBox>
        <Input
          border="none"
          _placeholder={{
            transform: "translateY(4px)",
            color: "gray.500", // Change the color
            fontSize: "2em", // Change the font size
            fontWeight: "bold", // Change the font weight
          }}
          placeholder="Article Title"
        ></Input>
      </ElegantBox>
      <Box
        flex="1"
        marginBottom="20px"
        marginTop="20px"
        overflow="hidden"
        sx={{
          ".quill": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
          ".ql-container": {
            flex: "1",
            overflow: "auto",
            border: "1px solid #bbb",
            borderTop: "none",
          },
          ".ql-toolbar": {
            border: "1px solid #bbb",
            borderRadius: "0 0 0 0",
          },
        }}
      >
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          placeholder="Start typing here..."
        />
      </Box>

      <Button
        marginTop="auto"
        background="rgb(196,127,35)"
        borderColor="rgb(160,90,25)"
        color="white"
        alignSelf="flex-start"
        onClick={() => {
          const markdown = turndownService.turndown(content);
          console.log("Exported Markdown:", markdown);
        }}
      >
        PUBLISH ARTICLE
      </Button>
    </Flex>
  );
}

export default Write;
