import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import OverallTimelinePlot from "../plots/OverallTimelinePlot";
import { Flex } from "rebass";
import FacilityPlots from "../plots/FacilityPlots";

const IndexPage = () => {
  const { countyFile } = useStaticQuery(csvDataQuery);

  return (
    <Layout>
      <SEO title="Home" />
      <Flex alignItems="center" flexDirection="column">
        <OverallTimelinePlot
          title="People in All County Prisons"
          csvData={countyFile.fields.csvData}
        />
        <FacilityPlots csvData={countyFile.fields.csvData} />
      </Flex>
    </Layout>
  );
};

const csvDataQuery = graphql`
  query {
    stateFile: file(relativePath: { eq: "state_facilities.csv" }) {
      fields {
        csvData {
          facility
          operational_capacity
          percent_occupied
          total_occupancy
          report_date
        }
      }
    }
    countyFile: file(relativePath: { eq: "county_facilities.csv" }) {
      fields {
        csvData {
          facility
          operational_capacity
          percent_occupied
          total_occupancy
          report_date
        }
      }
    }
  }
`;

export default IndexPage;
