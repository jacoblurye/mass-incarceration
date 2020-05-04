import React from "react";
import { Box } from "rebass";
import { Media, breakpoints } from "../Media";

const withResponsiveContainer = (WrapperComponent) => (props) => {
  return (
    <Box>
      <Media at="xs">
        <WrapperComponent width={350} height={400} {...props} />
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
      <Media greaterThanOrEqual="xl">
        <WrapperComponent width={breakpoints.xl / 1.1} {...props} />
      </Media>
    </Box>
  );
};

export default withResponsiveContainer;
