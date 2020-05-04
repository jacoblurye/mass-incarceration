import React from "react";
import map from "lodash/map";
import uniq from "lodash/uniq";
import { Flex, Box, Heading, Text } from "rebass";
import FacilityTimelinePlot from "./FacilityTimelinePlot";
import withResponsiveContainer from "./withResponsiveContainer";

const FacilityPlots = ({ csvData, width }) => {
  const facilities = uniq(map(csvData, "facility"));

  return (
    <Flex alignItems="center" flexDirection="column" width={width}>
      <Flex flexDirection="column" alignItems="center">
        <Heading>Occupancy by Prison</Heading>
        <Flex justifyContent="center">
          <Text fontSize={0}>
            <strong>Note:</strong> a facility operating below its capacity does{" "}
            <strong>NOT</strong> imply that the conditions at that facility are
            safe.
          </Text>
        </Flex>
        <Flex justifyContent="space-evenly" flexWrap="wrap">
          {facilities.map((f) => (
            <Box key={f} marginTop={2} marginBottom={4}>
              <FacilityTimelinePlot facility={f} csvData={csvData} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default withResponsiveContainer(FacilityPlots);
