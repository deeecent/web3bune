import { Box } from "@chakra-ui/react";

interface ElegantBoxProps extends React.PropsWithChildren<{}> {
  backgroundColor?: string; // Optional background color prop
  borderColor?: string;
}

export function ElegantBox({
  children,
  backgroundColor,
  borderColor = "#bbb",
}: ElegantBoxProps) {
  return (
    <Box backgroundColor={backgroundColor} border={`1px solid ${borderColor}`}>
      <Box
        backgroundColor={backgroundColor}
        border={`1px solid ${borderColor}`}
        margin="2px"
        padding="10px"
      >
        {children}
      </Box>
    </Box>
  );
}
