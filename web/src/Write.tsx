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
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ElegantBox } from "./CustomComponents";
import Showdown from "showdown";

const STORAGE_KEY_PREVIEW = "TMP_PREVIEW";
const STORAGE_KEY_PAID = "TMP_PAID";

const quillStyle = {
  ".quill": {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    fontFamily: `"SourceSerifPro", "Arial", "serif"`,
  },
  ".ql-container": {
    minHeight: "150px" /* Initial height */,
    overflowY: "visible" /* Allow height expansion */,
    border: "1px solid #bbb",
    backgroundColor: "white",
    borderTop: "none",
  },
  ".ql-toolbar": {
    border: "1px solid #bbb",
    borderRadius: "0 0 0 0",
  },
  ".ql-editor": {
    fontFamily: `"SourceSerifPro", "Arial", "serif"`,
    fontSize: "19px",
    lineHeight: "1.6",
  },
  ".ql-editor h1": {
    fontSize: "38px",
    fontFamily: `"SourceSerifPro", "Arial", "serif"`,
  },
  ".ql-editor h2": {
    fontSize: "28px",
    fontFamily: `"SourceSerifPro", "Arial", "serif"`,
  },
  ".ql-editor p": {
    marginBottom: "20px",
  },
};

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
  const [preview, setPreview] = useState("");
  const [paid, setPaid] = useState("");

  const turndownService = new TurndownService();
  const markdownConverter = new Showdown.Converter();

  const handlePreviewChange = (value: string) => {
    setPreview(value);
    const markdown = turndownService.turndown(value); // Convert HTML to Markdown
    localStorage.setItem(STORAGE_KEY_PREVIEW, markdown);
  };

  const handlePaidChange = (value: string) => {
    setPaid(value);
    const markdown = turndownService.turndown(value); // Convert HTML to Markdown
    localStorage.setItem(STORAGE_KEY_PAID, markdown);
  };

  useEffect(() => {
    const savedPreview = localStorage.getItem(STORAGE_KEY_PREVIEW);
    if (savedPreview) {
      const html = markdownConverter.makeHtml(savedPreview);
      setPreview(html);
    }
    const savedPaid = localStorage.getItem(STORAGE_KEY_PAID);
    if (savedPaid) {
      const html = markdownConverter.makeHtml(savedPaid);
      setPaid(html);
    }
  }, []);

  return (
    <Flex
      direction="column"
      overflow="auto"
      width="100%"
      minHeight="100vh"
      alignItems="stretch"
      padding="20px"
      gap="20px"
    >
      <VStack height="100px" width="100%" borderBottom="2px solid black">
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
      <ElegantBox
        backgroundColor="rgb(254,251,236)"
        borderColor="rgb(247,231,144)"
      >
        <Text variant="bold">Free Preview</Text>
      </ElegantBox>
      <Box overflow="visible" sx={quillStyle}>
        <ReactQuill
          value={preview}
          onChange={handlePreviewChange}
          modules={modules}
          placeholder="Start typing here..."
        />
      </Box>
      <ElegantBox
        backgroundColor="rgb(254,251,236)"
        borderColor="rgb(247,231,144)"
      >
        <Text variant="bold">Paid Content</Text>
      </ElegantBox>
      <Box overflow="visible" sx={quillStyle}>
        <ReactQuill
          value={paid}
          onChange={handlePaidChange}
          modules={modules}
          placeholder="Start typing here..."
        />
      </Box>

      <ElegantBox
        backgroundColor="rgb(254,251,236)"
        borderColor="rgb(247,231,144)"
        padding="20px"
      >
        <Heading textAlign="left" variant="title" fontSize="1.5em">
          Revenue Configuration
        </Heading>
        <Text variant="title" textAlign="left" marginTop="20px">
          Article Price (ETH)
        </Text>
        <Input placeholder="0.01"></Input>
        <Text variant="title" textAlign="left" marginTop="10px">
          Distributor Share (%)
        </Text>
        <Input placeholder="20"></Input>
        <Box
          marginTop="20px"
          padding="10px"
          textAlign="left"
          backgroundColor="rgb(252,247,219)"
        >
          <Flex direction="row">
            <Text fontFamily="monospace" alignSelf="flex-start">
              Your Share per sale
            </Text>
            <Spacer />
            <Text fontFamily="monospace" alignSelf="flex-end">
              0.008 ETH
            </Text>
          </Flex>
          <Flex direction="row">
            <Text fontFamily="monospace" alignSelf="flex-start">
              Distributor Share per sale
            </Text>
            <Spacer />
            <Text fontFamily="monospace" alignSelf="flex-end">
              0.002 ETH
            </Text>
          </Flex>
        </Box>
      </ElegantBox>

      <Button
        marginTop="auto"
        background="rgb(196,127,35)"
        borderColor="rgb(160,90,25)"
        color="white"
        alignSelf="flex-start"
        onClick={() => {
          const markdown = turndownService.turndown(preview);
          console.log("Exported Markdown:", markdown);
        }}
      >
        PUBLISH ARTICLE
      </Button>
    </Flex>
  );
}

export default Write;
