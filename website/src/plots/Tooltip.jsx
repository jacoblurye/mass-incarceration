import React from "react";
import { Flex, Box } from "rebass";

const Tooltip = ({ entries }) => {
  return (
    <Flex
      flexDirection="column"
      bg="background"
      my={1}
      p={1}
      fontSize={1}
      sx={{ borderRadius: 5 }}
    >
      {entries.map(({ label, value, color }) => (
        <Box key={label}>
          {label}: <strong style={{ color }}>{value}</strong>
        </Box>
      ))}
    </Flex>
  );
};

export default Tooltip;
