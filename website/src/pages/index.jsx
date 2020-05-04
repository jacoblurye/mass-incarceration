import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import AllPlots from "../plots/AllPlots";

const IndexPage = () => {
  const { countyFile, stateFile } = useStaticQuery(graphql`
    query {
      stateFile: file(relativePath: { eq: "state_facilities.csv" }) {
        fields {
          ...CsvData
        }
      }
      countyFile: file(relativePath: { eq: "county_facilities.csv" }) {
        fields {
          ...CsvData
        }
      }
    }
  `);

  const allData = [...countyFile.fields.csvData, ...stateFile.fields.csvData];

  return (
    <Layout>
      <SEO title="Mass. Prison Population" />
      <AllPlots sliceName="All MA" csvData={allData} />
    </Layout>
  );
};

export default IndexPage;
