import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import { Link, NavLink } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { EthToUsdConverter } from "./EthConverter";
import { parseEther } from "viem";

export function BuneInput({
  placehodler = "",
  value = "",
}: {
  placehodler?: string;
  value?: string;
}) {
  return (
    <Input
      borderRadius="0px"
      textAlign="right"
      backgroundColor="white"
      value={value}
      placeholder={placehodler}
    ></Input>
  );
}

export function Windows98Button({
  label,
  onClick,
}: {
  label: string;
  onClick: () => any;
}) {
  return (
    <Button
      onClick={onClick}
      padding="0px"
      bg="lightGrey"
      border=".5px solid black"
      color="black"
      boxShadow="1px 1px 0px #404040"
      style={{ transition: "none" }}
      _active={{
        boxShadow: "inset 1px 1px 0px #404040",
        backgroundColor: "white",
      }}
      _hover={{}}
    >
      {label}
    </Button>
  );
}

export function Windows98ButtonGroup({
  labels,
  onClick,
}: {
  labels: string[];
  onClick: (index: number) => any;
}) {
  return (
    <HStack>
      {labels.map((label, index) => (
        <Windows98Button
          key={index}
          label={label}
          onClick={() => onClick(index)}
        />
      ))}
    </HStack>
  );
}

export function GlitchButton({
  label,
  onClick = () => {},
  isLoading,
}: {
  label: string;
  onClick: () => any;
  isLoading: boolean;
}) {
  return (
    <Button
      isLoading={isLoading}
      onClick={onClick}
      variant="primary"
      sx={{
        "@keyframes rgbEffect": {
          "0%, 4%": { textShadow: "2px 0 0 #ff0000, -2px 0 0 #00ff00" },
          "5%, 9%": { textShadow: "2px 0 0 #00ff00, -2px 0 0 #0000ff" },
          "10%, 14%": { textShadow: "2px 0 0 #0000ff, -2px 0 0 #ff0000" },
          "15%, 100%": { textShadow: "0px 0 0" },
        },
        animation: "rgbEffect 2s steps(1) 0s infinite",
      }}
    >
      {label}
    </Button>
  );
}

export function Header() {
  return (
    <HStack width="100%" marginTop="20px">
      <ConnectButton />
      <Spacer />
      <Heading as="h1" size="xl">
        <Link to="/">web3bune</Link>
      </Heading>
      <Spacer />
      <TrendingUp />
      <HStack marginLeft="20px" marginRight="20px">
        <Text>ETH </Text>
        <EthToUsdConverter ethValue={parseEther("1")} />
      </HStack>
    </HStack>
  );
}
