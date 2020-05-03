import React from "react";
import map from "lodash/map";
import uniq from "lodash/uniq";
import { Flex, Box, Heading } from "rebass";
import FacilityTimelinePlot from "./FacilityTimelinePlot";

const FacilityPlots = ({ csvData }) => {
  return (
    <Flex alignItems="center" flexDirection="column">
      <Flex flexDirection="column" alignItems="center">
        <Heading>Occupancy by Facility</Heading>
        <Flex justifyContent="space-evenly" cols={4} flexWrap="wrap">
          {uniq(map(csvData, "facility")).map((f) => (
            <Box key={f} my={2}>
              <FacilityTimelinePlot facility={f} csvData={csvData} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FacilityPlots;
