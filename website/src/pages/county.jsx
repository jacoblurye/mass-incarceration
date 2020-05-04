import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import AllPlots from "../plots/AllPlots";

const CountyPage = () => {
  const { file } = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "county_facilities.csv" }) {
        fields {
          ...CsvData
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Mass. County Prison Population" />
      <AllPlots sliceName="MA County" csvData={file.fields.csvData} />
    </Layout>
  );
};

export default CountyPage;
