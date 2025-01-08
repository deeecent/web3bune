import { Box } from "@chakra-ui/react";

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
