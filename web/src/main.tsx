import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import "./markdown.css";
import { config } from "./wagmi.ts";
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
  VStack,
} from "@chakra-ui/react";
import "./index.css";
import { ConnectKitProvider } from "connectkit";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home.tsx";
import Write from "./Write.tsx";
import Read from "./Read.tsx";
import Manifesto from "./Manifesto.tsx";
import About from "./About.tsx";

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: "0", // <-- border radius is same for all variants and sizes
  },
  variants: {
    primary: () => ({
      color: "white",
      backgroundColor: "bune.darkGrey",
    }),
    disabled: () => ({
      fontSize: "md",
      backgroundColor: "white",
      color: "grey",
      _hover: {
        color: "black",
        backgroundColor: "white",
      },
    }),
  },
});

const Text = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontFamily: `"Courier New", "monospace"`,
    fontSize: "1em",
  },
  variants: {
    title: () => ({
      fontFamily: `"Courier New", "monospace"`,
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "1.2em",
    }),
  },
});

const customColors = {
  bune: {
    darkGrey: "rgb(51,51,51)",
    lightGrey: "rgb(240, 240, 240)",
  },
};

const theme = extendTheme({
  colors: customColors,
  fonts: {
    heading: `"Courier New", "monospace"`,
    body: `"Courier New", "monospace"`,
  },
  styles: {
    global: {
      html: {
        background: "bune.lightGrey",
      },
      body: {
        background: "bune.lightGrey",
        color: "bune.darkGrey",
        textAlign: "center",
        minHeight: "100vh",
      },
    },
  },
  components: {
    Button,
    Text,
  },
});

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/manifesto",
    element: <Manifesto />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/write",
    element: <Write />,
  },
  {
    path: "/read/:articleId",
    element: <Read />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ConnectKitProvider>
            <VStack width="70%" maxWidth="1000px" margin="0 auto">
              <RouterProvider router={router} />
            </VStack>
          </ConnectKitProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
