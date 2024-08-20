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
} from "@chakra-ui/react";
import "./index.css";
import { ConnectKitProvider } from "connectkit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    fontFamily: `"DMMonoRegular", "Arial", "serif"`,
    fontSize: "15px",
  },
  variants: {
    bold: () => ({
      fontFamily: `"DMMonoMedium", "Arial", "serif"`,
      fontSize: "20px",
    }),
  },
});

const theme = extendTheme({
  fonts: {
    heading: `"CloisterBlackHeading", "Arial", "serif"`,
    body: `"DMMonoRegular", "Arial", "serif"`,
  },
  styles: {
    global: {
      html: {
        background: "rgb(255, 255, 255)",
      },
      body: {
        background: "white",
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
            <RouterProvider router={router} />
          </ConnectKitProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
