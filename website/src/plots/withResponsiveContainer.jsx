import React from "react";
import { Box } from "rebass";
import { Media, breakpoints } from "../Media";

const withResponsiveContainer = (WrapperComponent) => (props) => {
  return (
    <Box>
      <Media at="xs">
        <WrapperComponent width={(breakpoints.sm * 2) / 3} {...props} />
      </Media>
      <Media at="sm">
        <WrapperComponent width={breakpoints.sm} {...props} />
      </Media>
      <Media at="md">
        <WrapperComponent width={breakpoints.md} {...props} />
      </Media>
      <Media at="lg">
        <WrapperComponent width={breakpoints.lg} {...props} />
      </Media>
      <Media at="xl">
        <WrapperComponent width={breakpoints.xl} {...props} />
      </Media>
    </Box>
  );
};

export default withResponsiveContainer;
