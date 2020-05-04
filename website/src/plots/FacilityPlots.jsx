import React from "react";
import map from "lodash/map";
import uniq from "lodash/uniq";
import { Flex, Box, Heading } from "rebass";
import FacilityTimelinePlot from "./FacilityTimelinePlot";

const FacilityPlots = ({ csvData }) => {
  const facilities = uniq(map(csvData, "facility"));

  return (
    <Flex alignItems="center" flexDirection="column">
      <Flex flexDirection="column" alignItems="center">
        <Heading>Occupancy by Facility</Heading>
        <Flex justifyContent="space-evenly" flexWrap="wrap">
          {facilities.map((f) => (
            <Box key={f} my={4}>
              <FacilityTimelinePlot facility={f} csvData={csvData} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FacilityPlots;
