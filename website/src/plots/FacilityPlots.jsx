import React from "react";
import map from "lodash/map";
import uniq from "lodash/uniq";
import groupBy from "lodash/groupBy";
import { Flex, Box, Heading } from "rebass";
import FacilityTimelinePlot from "./FacilityTimelinePlot";
import withResponsiveContainer from "./withResponsiveContainer";

const highOccupancyCutoff = 750;

const FacilityPlots = ({ csvData, width }) => {
  const groupedData = groupBy(
    csvData,
    (d) =>
      d.total_occupancy > highOccupancyCutoff ||
      d.operational_capacity > highOccupancyCutoff
  );
  const highOccupancyData = groupedData[true];
  const lowOccupancyData = groupedData[false];

  const makeFacilityPlots = (data) => {
    const facilities = uniq(map(data, "facility"));
    return (
      <Flex justifyContent="center" flexWrap="wrap" width={width}>
        {facilities.map((f) => (
          <Box key={f} m={1}>
            <FacilityTimelinePlot facility={f} csvData={data} />
          </Box>
        ))}
      </Flex>
    );
  };

  return (
    <Flex alignItems="center" flexDirection="column">
      <Heading>Higher Occupancy Facilities</Heading>
      {makeFacilityPlots(highOccupancyData)}
      <Heading>Lower Occupancy Facilities</Heading>
      {makeFacilityPlots(lowOccupancyData)}
    </Flex>
  );
};

export default withResponsiveContainer(FacilityPlots);
