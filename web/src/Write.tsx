import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TurndownService from "turndown";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BuneInput,
  ElegantBox,
  GlitchButton,
  Windows98Button,
  Windows98ButtonGroup,
} from "./CustomComponents";
import Showdown from "showdown";

const STORAGE_KEY_PREVIEW = "TMP_PREVIEW";
const STORAGE_KEY_PAID = "TMP_PAID";
const FONT = `"Courier New", "monospace"`;

const quillStyle = {
  ".quill": {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    fontFamily: `${FONT}`,
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
    fontFamily: `${FONT}`,
    fontSize: "19px",
    lineHeight: "1.6",
  },
  ".ql-editor h1": {
    fontSize: "38px",
    fontFamily: `${FONT}`,
  },
  ".ql-editor h2": {
    fontSize: "28px",
    fontFamily: `${FONT}`,
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

function ConfigurationInput({
  title,
  defaultValue,
}: {
  title: string;
  defaultValue: string;
}) {
  return (
    <VStack alignItems="left">
      <Text textAlign="left" marginTop="10px">
        {title}
      </Text>
      <HStack>
        <InputGroup minWidth="90px">
          <Input
            borderRadius="0px"
            textAlign="right"
            backgroundColor="white"
            value={defaultValue}
          ></Input>
          <InputRightElement pointerEvents="none">
            <Text>%</Text>
          </InputRightElement>
        </InputGroup>
        <Windows98ButtonGroup labels={["5%", "10%", "15%", "0%"]} />
      </HStack>
    </VStack>
  );
}

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
      textAlign="left"
      padding="20px"
      gap="20px"
    >
      <VStack height="100px" width="100%">
        <Heading size="2xl">New Article</Heading>
        <Text>Write good content</Text>
      </VStack>
      <Box
        backgroundColor="white"
        height="50px"
        boxShadow="5px 5px 0px 0px black"
      >
        <Input
          height="100%"
          border="none"
          borderRadius="0px"
          placeholder="Article Title"
          fontSize="2.2em"
          fontWeight="bold"
        ></Input>
      </Box>
      <Spacer />
      <Box>
        <Text variant="title">Free Preview</Text>
        <Text>
          A description, subtitle, paragraph... whatever works to make the
          reader by the rest.
        </Text>
      </Box>
      <Box overflow="visible" sx={quillStyle}>
        <ReactQuill
          value={preview}
          onChange={handlePreviewChange}
          modules={modules}
          placeholder="Start typing here..."
        />
      </Box>
      <Spacer />
      <Box>
        <Text variant="title">Paid Content</Text>
        <Text>
          This will be shown to the reader only after purchasing the article.
        </Text>
      </Box>
      <Box overflow="visible" sx={quillStyle}>
        <ReactQuill
          value={paid}
          onChange={handlePaidChange}
          modules={modules}
          placeholder="Start typing here..."
        />
      </Box>

      <SimpleGrid minChildWidth="300px" gap="20px">
        <Box
          backgroundColor="bune.lightGrey"
          border="1px dashed black"
          padding="20px"
          boxShadow="5px 5px 0px 0px black"
        >
          <Heading textAlign="left" variant="title" fontSize="1.5em">
            Revenue Configuration
          </Heading>
          <VStack alignItems="left" width="250px" minWidth="250px">
            <Text
              variant="boldTitle"
              textAlign="left"
              fontSize="1em"
              marginTop="20px"
            >
              Article Price (ETH)
            </Text>
            <BuneInput placehodler="0.01" />
            <ConfigurationInput
              defaultValue="5"
              title="Distributor Share (%)"
            />
            <ConfigurationInput defaultValue="1" title="Network Fee (%)" />
          </VStack>
        </Box>
        <Box
          backgroundColor="bune.lightGrey"
          border="1px dashed black"
          padding="20px"
          boxShadow="5px 5px 0px 0px black"
        >
          <VStack width="100%" alignItems="left" height="100%">
            <Heading textAlign="left" variant="title" fontSize="1.5em">
              Revenue Split
            </Heading>
            <Box
              padding="10px"
              marginTop="20px"
              textAlign="left"
              backgroundColor="white"
              borderBottom="2px solid black"
            >
              <Flex direction="row">
                <Text fontFamily="monospace" alignSelf="flex-start">
                  Your Share
                </Text>
                <Spacer />
                <Text fontFamily="monospace" alignSelf="flex-end">
                  0.008 ETH
                </Text>
              </Flex>
              <Flex direction="row">
                <Text fontFamily="monospace" alignSelf="flex-start">
                  Distributor Share
                </Text>
                <Spacer />
                <Text fontFamily="monospace" alignSelf="flex-end">
                  0.002 ETH
                </Text>
              </Flex>
              <Flex direction="row">
                <Text fontFamily="monospace" alignSelf="flex-start">
                  Network Fee
                </Text>
                <Spacer />
                <Text fontFamily="monospace" alignSelf="flex-end">
                  0.001 ETH
                </Text>
              </Flex>
            </Box>
            <Flex direction="row" padding="10px">
              <Text
                fontWeight="bold"
                fontFamily="monospace"
                alignSelf="flex-start"
              >
                Total
              </Text>
              <Spacer />
              <Text fontFamily="monospace" alignSelf="flex-end">
                0.01 ETH
              </Text>
            </Flex>
            <Spacer />
            <GlitchButton label="Publish Article" />
          </VStack>
        </Box>
      </SimpleGrid>
    </Flex>
  );
}

export default Write;
