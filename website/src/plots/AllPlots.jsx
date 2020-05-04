import React from "react";
import { Flex, Box } from "rebass";
import { graphql } from "gatsby";
import OverallTimelinePlot from "./OverallTimelinePlot";
import FacilityPlots from "./FacilityPlots";

const AllPlots = ({ sliceName, csvData }) => {
  return (
    <Flex alignItems="center" flexDirection="column">
      <Box my={2}>
        <OverallTimelinePlot
          title={`People in ${sliceName} Prisons`}
          csvData={csvData}
        />
      </Box>
      <Box my={2}>
        <FacilityPlots csvData={csvData} />
      </Box>
    </Flex>
  );
};

export const query = graphql`
  fragment CsvData on FileFields {
    csvData {
      facility
      operational_capacity
      percent_occupied
      total_occupancy
      report_date
    }
  }
`;

export default AllPlots;
