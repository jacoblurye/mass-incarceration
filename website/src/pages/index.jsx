import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import AllPlots from "../plots/AllPlots";
import DataRadios from "../components/DataRadios";

const ALL = "All";
const COUNTY = "County";
const DOC = "DOC";

const IndexPage = () => {
  const { countyFile, stateFile } = useStaticQuery(graphql`
    query {
      stateFile: file(relativePath: { eq: "doc_facilities.csv" }) {
        fields {
          ...CSVData
        }
      }
      countyFile: file(relativePath: { eq: "county_facilities.csv" }) {
        fields {
          ...CSVData
        }
      }
    }
  `);
  const countyData = countyFile.fields.csvData;
  const stateData = stateFile.fields.csvData;
  const allData = [...countyData, ...stateData];

  const views = {
    [ALL]: <AllPlots sliceName={ALL} csvData={allData} />,
    [COUNTY]: <AllPlots sliceName={COUNTY} csvData={countyData} />,
    [DOC]: <AllPlots sliceName={DOC} csvData={stateData} />,
  };
  const labels = Object.keys(views);

  const [view, setView] = React.useState(labels[0]);
  console.log(view);
  return (
    <Layout>
      <SEO title="Mass. Prison Population" />
      <DataRadios values={labels} checked={view} onChange={(v) => setView(v)} />
      {views[view]}
    </Layout>
  );
};

export default IndexPage;
