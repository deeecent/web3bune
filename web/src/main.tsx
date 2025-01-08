import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
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

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: "0", // <-- border radius is same for all variants and sizes
    borderColor: "#000000",
    borderWidth: "0.5px",
  },
  variants: {
    primary: () => ({
      color: "black",
      backgroundColor: "white",
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
    fontFamily: `"SourceSerifPro", "Arial", "serif"`,
    fontSize: "1em",
    color: "rgb(78,85,99)",
  },
  variants: {
    bold: () => ({
      fontFamily: `"SourceSerifProBold", "Arial", "serif"`,
      fontSize: "1.2em",
    }),
    boldTitle: () => ({
      fontFamily: `"SourceSerifProBold", "Arial", "serif"`,
      fontSize: "1.2em",
      color: "black",
    }),
    title: () => ({
      fontFamily: `"SourceSerifPro", "Arial", "serif"`,
      fontSize: "1em",
      color: "black",
    }),
  },
});

const theme = extendTheme({
  fonts: {
    heading: `"AbrilFatface", "Arial", "serif"`,
    body: `"SourceSerifPro", "Arial", "serif"`,
  },
  styles: {
    global: {
      html: {
        background: "rgb(250, 250, 249)",
      },
      body: {
        background: "rgb(250, 250, 249)",
        color: "rgb(0, 0, 0)",
        textAlign: "center",
        height: "100vh",
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
    path: "/write",
    element: <Write />,
  },
  {
    path: "/articles/:tokenID",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ConnectKitProvider>
            <VStack
              width="70%"
              paddingTop="10px"
              maxWidth="1000px"
              margin="0 auto"
            >
              <RouterProvider router={router} />
            </VStack>
          </ConnectKitProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
