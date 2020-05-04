import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import AllPlots from "../plots/AllPlots";

const DOCPage = () => {
  const { file } = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "state_facilities.csv" }) {
        fields {
          ...CsvData
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Mass. DOC Prison Population" />
      <AllPlots sliceName="MA DOC" csvData={file.fields.csvData} />
    </Layout>
  );
};

export default DOCPage;
