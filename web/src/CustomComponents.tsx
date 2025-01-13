import { Box, Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";

interface ElegantBoxProps extends React.PropsWithChildren<{}> {
  backgroundColor?: string; // Optional background color prop
  borderColor?: string;
  padding?: string;
}

export function ElegantBox({
  children,
  backgroundColor,
  borderColor = "#bbb",
  padding = "10px",
}: ElegantBoxProps) {
  return (
    <Box backgroundColor={backgroundColor} border={`1px solid ${borderColor}`}>
      <Box
        backgroundColor={backgroundColor}
        border={`1px solid ${borderColor}`}
        margin="2px"
        padding={padding}
        height="100%"
      >
        {children}
      </Box>
    </Box>
  );
}

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
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => any;
}) {
  return (
    <Button
      onClick={onClick}
      padding="0px"
      bg={isSelected ? "white" : "lightGrey"}
      border=".5px solid black"
      color="black"
      boxShadow={
        isSelected ? "inset 1px 1px 0px #404040" : "1px 1px 0px #404040"
      }
      style={{ transition: "none" }}
      _active={{
        boxShadow: "inset 1px 1px 0px #404040",
      }}
      _hover={{}}
    >
      {label}
    </Button>
  );
}

export function Windows98ButtonGroup({ labels }: { labels: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <HStack>
      {labels.map((label, index) => (
        <Windows98Button
          key={index}
          label={label}
          isSelected={selectedIndex === index}
          onClick={() => setSelectedIndex(index)}
        />
      ))}
    </HStack>
  );
}

export function GlitchButton({ label }: { label: string }) {
  return (
    <Button
      variant="primary"
      sx={{
        "@keyframes rgbEffect": {
          "0%, 2%": { textShadow: "2px 0 0 #ff0000, -2px 0 0 #00ff00" },
          "3%, 5%": { textShadow: "2px 0 0 #00ff00, -2px 0 0 #0000ff" },
          "6%, 8%": { textShadow: "2px 0 0 #0000ff, -2px 0 0 #ff0000" },
          "9%, 100%": { textShadow: "0px 0 0" },
        },
        animation: "rgbEffect 3s steps(1) 0s infinite",
      }}
    >
      {label}
    </Button>
  );
}
